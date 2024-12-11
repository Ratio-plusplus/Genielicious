import json
from firebase import getDataRef, getUserCacheRef, getActiveFoodProfile
#from firebase import getTestUserCacheRef
import results
from openai import OpenAI
# from dotenv import find_dotenv, load_dotenv

# dotenv_path = find_dotenv()
# load_dotenv(dotenv_path)

client = OpenAI()

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
    allergies = []
    for allergy in activeFoodProfile["allergies"]:
        if activeFoodProfile["allergies"][allergy] == True:
            allergies.append(allergy)
            
    includedPreferences = []
    excludedPreferences = []
    for pref in activeFoodProfile["tastePreferences"]:
        if activeFoodProfile["tastePreferences"][pref] == True:
            includedPreferences.append(pref)
        else:
            excludedPreferences.append(pref)
            
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
    elif json.loads(surveyCache[-1]["content"])["recommendations"]: # checks if last response from model had the recommendations (should be boolean)
      results.compileResults(user_id, answer) # puts results into resultsCache
      return {"success": True, "results": True}

  parts = str(answer)
  surveyCache.append({"role":"user","content":parts})
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
    surveyCache = [{"role": "system", "content": [{"type": "text","text": prompt}]}]
  else:
    surveyCache = json.loads(surveyCache) # existing survey cache
    if surveyCache[-1]["role"] == "system": 
      # last response in the chat was the model; thus expecting user response through submitAnswer()
      return {"Error 401" : "Model has already provided question OR result"}

    
  response = client.chat.completions.create(
      model="gpt-4o",
      messages=surveyCache,
      response_format={
        "type": "json_schema",
        "json_schema": {
          "name": "food_response",
          "strict": True,
          "schema": {
            "type": "object",
            "properties": {
              "question": {
                "type": "string"
              },
              "answer_choices": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "recommendations": {
                "type": "boolean"
              }
            },
            "additionalProperties": False,
            "required": [
              "question",
              "answer_choices",
              "recommendations"
            ]
          }
        }
      },
      temperature=1.3,
      max_tokens=1025,
      top_p=1,
      frequency_penalty=0,
      presence_penalty=0
    )
  
  formatted_question = json.loads(response.choices[0].message.content) # response made into json dictionary

  # encode json object for GPT input
  surveyCache.append({"role":"system","content":json.dumps(formatted_question)})
  # cacheToJson("backend\\recommender\\tests\\surveryCache_history.json",surveyCache) # saves surverycache locally

  # converts cache to a single string for db
  cache.update({"surveyCache" : json.dumps(surveyCache)})

  if formatted_question["recommendations"]: # ai outputs a boolean
    final_choices = formatted_question["answer_choices"]
    final_question = {
        "question": "We predict you want one of these items.", 
        "answer_choices" : final_choices
        }
    return final_question # sends frontend final question
  
  formatted_question.pop("recommendations")
  return formatted_question #return dict

if __name__ == "__main__":
  from yelp import cacheToJson # used in development
  with open(r"backend\recommender\unused\survey.json", "r") as file:
    prompt = json.load(file)["prompt"] 

  surveyCache = [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": prompt
            }
          ]
        }
      ]
  while True:
    response = client.chat.completions.create(
      model="gpt-4o",
      messages=surveyCache,
      response_format={
        "type": "json_schema",
        "json_schema": {
          "name": "food_response",
          "strict": True,
          "schema": {
            "type": "object",
            "properties": {
              "question": {
                "type": "string"
              },
              "answer_choices": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "recommendations": {
                "type": "boolean"
              }
            },
            "additionalProperties": False,
            "required": [
              "question",
              "answer_choices",
              "recommendations"
            ]
          }
        }
      },
      temperature=1.1,
      max_tokens=2048,
      top_p=1,
      frequency_penalty=0.1,
      presence_penalty=0.2
    )
    message = response.choices[0].message.content
    print("msg:",message)
    # print()
    # print("res:",response)
    surveyCache.append({"role":"system","content":message})
    # cacheToJson(r"backend\recommender\unused\response_full.json",response)
    # cacheToJson(r"backend\recommender\unused\response_choices.json",response.choices)
    cacheToJson(r"backend\recommender\unused\res.json",message)
    cacheToJson(r"backend\recommender\unused\res_out.json",json.loads(message))
    prompt = input("Response: ")
    surveyCache.append({"role":"user", "content":prompt})

  # print(getNextQuestion("3"))
  # submitAnswer("3", "yes")
  # print(getPrompt("medium"))