#!pip install -q -U google-generativeai
# import requests
import json
from firebase_init import getTestUser, getDataRef
from dotenv import find_dotenv, load_dotenv
from yelp import cacheToJson # used in development
from results import clearCache, compileResults
import google.generativeai as genai
import os
dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash") # model version we're using

def formatStringToJson(s):
  data = str(s).replace('json', '').replace('\\n', '').replace('\\"', '"').replace('```', '').replace('\n', '').replace('\\', '')
  return json.loads(json.dumps(data)) # returns json dictionary as a string

def getPrompt(mode):
  # TODO: -Add active food profile details to default prompt
  #       -Change prompt based on medium or long mode
  data_ref = getDataRef()
  prompt = data_ref.child("default_prompt").get()

  return prompt

def submitAnswer(user_id,answer):
  #TODO: Reference cache to send to model
  user = getTestUser(user_id) ### TODO: change to actual users when complete

  surveyCache_ref = user.child("surveyCache")
  surveyCache = surveyCache_ref.get()

  if not surveyCache :
    return {"Error 401" : "No question provided yet."} 
  else:
    surveyCache = json.loads(surveyCache)
    if surveyCache[-1]["role"] == "user":
      return {"Error 401" : "Client already answered question."}


  parts = str(answer)
  surveyCache.append({"role":"user","parts":parts})
  surveyCache = json.dumps(surveyCache) # converts cache to a single string
  user.update({"surveyCache" : surveyCache})

  return "success" # returns str to confirm success
  

def getNextQuestion(user_id:str, mode:str):
  user = getTestUser(user_id) ### TODO: change to actual users when Auth complete

  surveyCache_ref = user.child("surveyCache")
  surveyCache = surveyCache_ref.get()

  if not surveyCache:
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
  
  formatted_question = formatStringToJson(response.text)
  surveyCache.append({"role":"model","parts":formatted_question})
  surveyCache = json.dumps(surveyCache) # converts cache to a single string

  user.update({"surveyCache" : surveyCache})
  # cacheToJson("backend\\recommender\\tests\\model_history.json",surveyCache) # saves surverycache locally

  #TODO: update conditional based on if the formatted_question is actually the final result
  if "recommendations" in formatted_question: 
    clearCache(user_id) #erase surveyCache after giving result
    compileResults(formatted_question) # puts results into resultsCache
    return {"results": True} # tells frontend results are ready

  return formatted_question

if __name__ == "__main__":
  print(getNextQuestion("3"))
  # submitAnswer("3", "yes")
  # print(getPrompt("medium"))