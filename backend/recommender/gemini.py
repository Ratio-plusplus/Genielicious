#!pip install -q -U google-generativeai
# import requests
import json
from firebase import getDataRef, getUserCacheRef, getActiveFoodProfile
# from firebase import getTestUser
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

def getPrompt(user_id, mode):
  dataRef = getDataRef()
  activeFoodProfile = getActiveFoodProfile(user_id)      

  if mode == "short":
    prompt = dataRef.child("short_prompt").get()
  elif mode == "medium":
    prompt = dataRef.child("medium_prompt").get()
  elif mode == "long":
    prompt = dataRef.child("long_prompt").get()

  # reference active food profile details
  if activeFoodProfile:
    allergies = activeFoodProfile["allergies"]["include"] # list of food allergy strings
    includedPreferences = activeFoodProfile["tastePreferences"]["include"]
    excludedPreferences = activeFoodProfile["tastePreferences"]["exclude"]
    if allergies:
      prompt += f"Do not consider food options that contain these food allergies: {', '.join(allergies)}."
    if includedPreferences:
      prompt += f"Food options with the following qualities are prefered: {', '.join(includedPreferences)}."
    if excludedPreferences:
      prompt += f"Food options with the following qualities are not prefered: {', '.join(excludedPreferences)}."

  return prompt

def submitAnswer(user_id,answer):
  cache = getUserCacheRef(user_id)

  surveyCache = cache.child("surveyCache").get()

  if not surveyCache :
    return {"Error 401" : "No question provided yet."} 
  else:
    surveyCache = json.loads(surveyCache)
    # Checks if distance/budget needs to be updated
    if "distance" in surveyCache:
      if answer == "10 miles or less":
        cache.update({"distanceCache": 16093}) # store distance in meters as an integer
      elif answer == "15 miles or less":
        cache.update({"distanceCache": 24140})
      elif answer == "20 miles or less": 
        cache.update({"distanceCache": 32187})
      elif answer == "25 miles or less":
        cache.update({"distanceCache": 40000})
      else:
        return {"Error 401" : "Invalid answer."}
      return {"success": True, "results": False}
    elif "budget" in surveyCache:
      if answer == "$10 or less":
        cache.update({"budgetCache": 1}) # price intervals according to yelp api
      elif answer == "$30 or less":
        cache.update({"budgetCache": 2})
      elif answer == "$60 or less": 
        cache.update({"budgetCache": 3})
      elif answer == "More than $60":
        cache.update({"budgetCache": 4})
      else:
        return {"Error 401" : "Invalid answer."}
      cache.update({"surveyCache":"",})
      return {"success": True, "results": False}
    elif surveyCache[-1]["role"] == "user": # if not user then the last response was model
      return {"Error 401" : "Client already answered question."}
    elif "recommendations" in json.loads(surveyCache[-1]["parts"]): # checks if last response from model were the recommendations
      results.compileResults(user_id, answer) # puts results into resultsCache
      return {"success": True, "results": True}

  parts = str(answer)
  surveyCache.append({"role":"user","parts":parts})
  surveyCache = json.dumps(surveyCache) # converts cache to a single string
  cache.update({"surveyCache" : surveyCache})

  return {"success": True, "results": False} # returns value to confirm success

def getNextQuestion(user_id:str, mode:str):
  cache = getUserCacheRef(user_id)
  surveyCache = cache.child("surveyCache").get()
  distanceCache = cache.child("distanceCache").get()
  budgetCache = cache.child("budgetCache").get()
  
  activeProfile = getActiveFoodProfile(user_id)

  if activeProfile:
      budget = activeProfile["budget"]
      distance = activeProfile["distance"]
  else:
      budget = "" 
      distance = "" 

  # provide distance/budget question if preference does not exist  
  if not distance and not distanceCache:
    distance_question = {"question": "How far are you willing to travel?","answer_choices":["10 miles or less", "15 miles or less", "20 miles or less", "25 miles or less"]}
    cache.update({"surveyCache":json.dumps({"distance":"need distance"})})
    return distance_question
  if not budget and not budgetCache:
    budget_question = {"question": "How much money are you willing to spend?","answer_choices":["$10 or less", "$30 or less", "$60 or less", "More than $60"]}
    cache.update({"surveyCache":json.dumps({"budget":"need budget"})})
    return budget_question

  if not surveyCache: # empty survey cache = new session
    # Default prompt may differ based on user/mode
    prompt = getPrompt(user_id, mode)

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
  cache.update({"surveyCache" : json.dumps(surveyCache)})

  if "recommendations" in formatted_question: # ai outputs a json with recommendations field when it is done
    final_choices = formatted_question["recommendations"]
    final_question = {
        "question": "We predict you want one of these items.", 
        "answer_choices" : final_choices
        }
    return final_question # sends frontend final question

  return formatted_question #return dict

#formats the output from gemini api
# returns json dictionary
def formatStringToJson(s):
  data = str(s).replace('json', '').replace('\\n', '').replace('\\"', '"').replace('```', '').replace('\n', '').replace('\\', '')
  data = json.loads(data) 
  return data

if __name__ == "__main__":
  print(getNextQuestion("3"))
  # submitAnswer("3", "yes")
  # print(getPrompt("medium"))