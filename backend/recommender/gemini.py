#!pip install -q -U google-generativeai
# import requests
import json
from firebase import getTestUser, getDataRef
from dotenv import find_dotenv, load_dotenv
# from yelp import cacheToJson # used in development
import results
import google.generativeai as genai
import os
dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash") # model version we're using

def getPrompt(mode):
  # TODO: -Add active food profile details to chosen prompt (next sprint)
  data_ref = getDataRef()

  if mode == "short":
    prompt = data_ref.child("short_prompt").get()
  elif mode == "medium":
    prompt = data_ref.child("medium_prompt").get()
  elif mode == "long":
    prompt = data_ref.child("long_prompt").get()
  return prompt

def submitAnswer(user_id,answer):
  # user = getTestUser(user_id) 
  user = getUser(user_id)

  surveyCache = user.child("surveyCache").get()

  if not surveyCache :
    return {"Error 401" : "No question provided yet."} 
  else:
    surveyCache = json.loads(surveyCache)
    # TODO: update section after active profiles are set (next sprint)
    # Checks if distance/budget needs to be updated
    if "distance" in surveyCache:
      if answer == "10 miles or less":
        user.update({"distanceCache": 16093}) # store distance in meters as an integer
      elif answer == "15 miles or less":
        user.update({"distanceCache": 24140})
      elif answer == "20 miles or less": 
        user.update({"distanceCache": 32187})
      elif answer == "25 miles or less":
        user.update({"distanceCache": 40000})
      else:
        return {"Error 401" : "Invalid answer."}
      return {"success": True, "results": False}
    elif "budget" in surveyCache:
      if answer == "$10 or less":
        user.update({"budgetCache": 1}) # price intervals according to yelp api
      elif answer == "$30 or less":
        user.update({"budgetCache": 2})
      elif answer == "$60 or less": 
        user.update({"budgetCache": 3})
      elif answer == "More than $60":
        user.update({"budgetCache": 4})
      else:
        return {"Error 401" : "Invalid answer."}
      user.update({"surveyCache":"",})
      return {"success": True, "results": False}
    elif surveyCache[-1]["role"] == "user": # if not user then the last response was model
      return {"Error 401" : "Client already answered question."}
    elif "recommendations" in json.loads(surveyCache[-1]["parts"]): # checks if last response from model were the recommendations
      results.compileResults(user_id, answer) # puts results into resultsCache
      return {"success": True, "results": True}

  parts = str(answer)
  surveyCache.append({"role":"user","parts":parts})
  surveyCache = json.dumps(surveyCache) # converts cache to a single string
  user.update({"surveyCache" : surveyCache})

  return {"success": True, "results": False} # returns value to confirm success
  

def getNextQuestion(user_id:str, mode:str):
  # user = getTestUser(user_id) 
  user = getUser(user_id)

  surveyCache = user.child("surveyCache").get()
  # TODO: update distance/price questions once active profiles are set (next sprint)
  # provide distance/budget question if preference does not exist
  distance = user.child("distance").get()
  distanceCache = user.child("distanceCache").get()
  budget = user.child("budget").get()
  budgetCache = user.child("budgetCache").get()
  print(not distance, not distanceCache)
  print(not budget, not budgetCache)
  if not distance and not distanceCache:
    distance_question = {"question": "How far are you willing to travel?","answers":["10 miles or less", "15 miles or less", "20 miles or less", "25 miles or less"]}
    user.update({"surveyCache":json.dumps({"distance":"need distance"})})
    return distance_question
  if not budget and not budgetCache:
    budget_question = {"question": "How much money are you willing to spend?","answers":["$10 or less", "$30 or less", "$60 or less", "More than $60"]}
    user.update({"surveyCache":json.dumps({"budget":"need budget"})})
    return budget_question

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

  # encode json object for gemini input
  surveyCache.append({"role":"model","parts":json.dumps(formatted_question)})
  # cacheToJson("backend\\recommender\\tests\\surveryCache_history.json",surveyCache) # saves surverycache locally

  # converts cache to a single string for db
  user.update({"surveyCache" : json.dumps(surveyCache)})

  if "recommendations" in formatted_question: # ai outputs a json with recommendations field when it is done
    final_choices = formatted_question["recommendations"]
    final_question = {
        "question": "We predict you want one of these items.", 
        "answer_choices" : final_choices
        }
    return final_question # sends frontend final question

  return formatted_question #return dict

#formats the output from gemini api
def formatStringToJson(s):
  data = str(s).replace('json', '').replace('\\n', '').replace('\\"', '"').replace('```', '').replace('\n', '').replace('\\', '')
  
  data = json.loads(data) # returns json dictionary
  return data

if __name__ == "__main__":
  print(getNextQuestion("3"))
  # submitAnswer("3", "yes")
  # print(getPrompt("medium"))