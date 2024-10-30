#!pip install -q -U google-generativeai
# import requests
import json
from firebase import getTestUser, getDataRef, getUser, getProfile, updateDatabaseUser
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
  response = getUser(user_id)
  result = response.get_json()
  info = result["info"]

  surveyCache = info["surveyCache"]

  if not surveyCache :
    return {"Error 401" : "No question provided yet."} 
  else:
    surveyCache = json.loads(surveyCache)
    # TODO: update section after active profiles are set (next sprint)
    # Checks if distance/budget needs to be updated
    if "distance" in surveyCache:
      if answer == "10 miles or less":
        updateDatabaseUser({"distanceCache": 16093}, user_id) # store distance in meters as an integer
      elif answer == "15 miles or less":
        updateDatabaseUser({"distanceCache": 24140}, user_id)
      elif answer == "20 miles or less": 
        updateDatabaseUser({"distanceCache": 32187}, user_id)
      elif answer == "25 miles or less":
        updateDatabaseUser({"distanceCache": 40000}, user_id)
      else:
        return {"Error 401" : "Invalid answer."}
      return {"success": True, "results": False}
    elif "budget" in surveyCache:
      if answer == "$10 or less":
        updateDatabaseUser({"budgetCache": 1}, user_id) # price intervals according to yelp api
      elif answer == "$30 or less":
        updateDatabaseUser({"budgetCache": 2}, user_id)
      elif answer == "$60 or less": 
        updateDatabaseUser({"budgetCache": 3}, user_id)
      elif answer == "More than $60":
        updateDatabaseUser({"budgetCache": 4}, user_id)
      else:
        return {"Error 401" : "Invalid answer."}
      updateDatabaseUser({"surveyCache":"",}, user_id)
      return {"success": True, "results": False}
    elif surveyCache[-1]["role"] == "user": # if not user then the last response was model
      return {"Error 401" : "Client already answered question."}
    elif "recommendations" in json.loads(surveyCache[-1]["parts"]): # checks if last response from model were the recommendations
      results.compileResults(user_id, answer) # puts results into resultsCache
      return {"success": True, "results": True}

  parts = str(answer)
  surveyCache.append({"role":"user","parts":parts})
  surveyCache = json.dumps(surveyCache) # converts cache to a single string
  updateDatabaseUser({"surveyCache" : surveyCache}, user_id)

  return {"success": True, "results": False} # returns value to confirm success
  

def getNextQuestion(user_id:str, mode:str, profile_id:str = None):
  # user = getTestUser(user_id)
  response = getUser(user_id)
  result = response.get_json()
  info = result["info"]
  profile = getProfile(user_id)
  if profile_id is None:
      budget = "" #activeProfile["budget"]
      distance = "" #activeProfile["distance"]
  else:
      activeProfile = profile[profile_id]
      budget = activeProfile["budget"]
      distance = activeProfile["distance"]

  surveyCache = info["surveyCache"]
  # TODO: update distance/price questions once active profiles are set (next sprint)
  # provide distance/budget question if preference does not exist
  distanceCache = info["distanceCache"]
  
  budgetCache = info["budgetCache"]
  print(not distance, not distanceCache)
  print(not budget, not budgetCache)
  if not distance and not distanceCache:
    distance_question = {"question": "How far are you willing to travel?","answer_choices":["10 miles or less", "15 miles or less", "20 miles or less", "25 miles or less"]}
    updateDatabaseUser({"surveyCache":json.dumps({"distance":"need distance"})}, user_id)
    return distance_question
  if not budget and not budgetCache:
    budget_question = {"question": "How much money are you willing to spend?","answer_choices":["$10 or less", "$30 or less", "$60 or less", "More than $60"]}
    updateDatabaseUser({"surveyCache":json.dumps({"budget":"need budget"})}, user_id)
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
  updateDatabaseUser({"surveyCache" : json.dumps(surveyCache)}, user_id)

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