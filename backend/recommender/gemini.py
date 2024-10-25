#!pip install -q -U google-generativeai
# import requests
import json
from firebase_init import getTestUser, getDataRef
from dotenv import find_dotenv, load_dotenv
from yelp import cacheToJson # used in development
import results
import google.generativeai as genai
import os
dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash") # model version we're using

def getPrompt(mode):
  # TODO: -Add active food profile details to default prompt
  #       -Change prompt based on medium or long mode
  data_ref = getDataRef()
  prompt = data_ref.child("default_prompt").get()
  return prompt

def submitAnswer(user_id,answer):
  user = getTestUser(user_id) ### TODO: change to actual users when complete

  surveyCache = user.child("surveyCache").get()

  if not surveyCache :
    return {"Error 401" : "No question provided yet."} 
  else:
    surveyCache = json.loads(surveyCache)
    if surveyCache[-1]["role"] == "user": # if not user then the last response was model
      return {"Error 401" : "Client already answered question."}
    elif "recommendations" in surveyCache[-1]["parts"][0]: # checks if last response from model were the recommendations
      results.clearCache(user_id) # erase surveyCache and resultsCache before compiling results
      results.compileResults(user_id, answer) # puts results into resultsCache
      return {"success": True, "results": True}

  parts = str(answer)
  surveyCache.append({"role":"user","parts":parts})
  surveyCache = json.dumps(surveyCache) # converts cache to a single string
  user.update({"surveyCache" : surveyCache})

  return {"success": True, "results": False} # returns value to confirm success
  

def getNextQuestion(user_id:str, mode:str):
  user = getTestUser(user_id) ### TODO: change to actual users when Auth complete

  surveyCache = user.child("surveyCache").get()

  if not surveyCache: # empty survey cache = new session
    # Default prompt may differ based on user/mode
    prompt = getPrompt(mode)

    # Format of the Contents parameter for Gem API
    surveyCache = [{"role":"user","parts":[{"text": prompt}]},] 
  else:
    surveyCache = json.loads(surveyCache) # existing survey cache
    if surveyCache[-1]["role"] == "model": 
      # last response in the chat was the model; thus expecting user response through submitAnswer()
      return {"Error 401" : "Model has already provided question OR result"}
    
  response = model.generate_content(
      surveyCache, # "contents" parameter
      generation_config=genai.types.GenerationConfig(
          temperature=1.0, # "randomness" of model
      ),
  )
  
  formatted_question = formatStringToJson(response.text) # response made into json dictionary
  cacheToJson("backend\\recommender\\tests\\model_history.json",formatted_question) # saves formatted_question locally
  # print("formattype:",type(formatted_question)) # TODO: REMOVE THIS AND CACHETOJSON

  if "recommendations" in formatted_question: # ai outputs a json with recommendations field when it is done
    final_choices = formatted_question["recommendations"]
    final_question = {
        "question": "We predict you want one of these items.", 
        "answer_choices" : final_choices
        }
    return final_question # sends frontend final question
  
  # encode json object for gemini input
  surveyCache.append({"role":"model","parts":json.dumps(formatted_question)})
  cacheToJson("backend\\recommender\\tests\\surveryCache_history.json",surveyCache) # saves surverycache locally
  # converts cache to a single string for db
  user.update({"surveyCache" : json.dumps(surveyCache)})

  return formatted_question #return dict

#formats the output from gemini api
def formatStringToJson(s):
  cacheToJson("backend\\recommender\\tests\\reponse_history.json",s) # TODO: Remove
  data = str(s).replace('json', '').replace('\\n', '').replace('\\"', '"').replace('```', '').replace('\n', '').replace('\\', '')
  
  data = json.loads(json.loads(json.dumps(data))) # returns json dictionary
  cacheToJson("backend\\recommender\\tests\\formatted_reponse_history.json",data) # TODO: Remove
  return data

if __name__ == "__main__":
  print(getNextQuestion("3"))
  # submitAnswer("3", "yes")
  # print(getPrompt("medium"))