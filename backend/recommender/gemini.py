#!pip install -q -U google-generativeai
# import requests
import json
from firebase_init import getTestUser
from dotenv import find_dotenv, load_dotenv
from yelp import cacheToJson
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

def submitAnswer(user_id,answer:str):
  #TODO: Reference cache to send to model
  pass

def getNextQuestion(user_id:str):
  user = getTestUser(user_id) ### TODO: change to actual users when complete

  surveyCache_ref = user.child("surveyCache")
  surveyCache = surveyCache_ref.get()

  if not surveyCache:
    with open("backend\\recommender\\tests\\default_prompt.txt", "r") as file:
      default_prompt = file.readline()
    surveyCache = [
          {"role":"user",
          "parts":[{
            "text": default_prompt}]},
        ]
  else:
    surveyCache = json.loads(surveyCache_ref)
    if surveyCache[-1]["role"] == "model":
      return { "error" : "Expecting client answer to model question."}

  response = model.generate_content(
      surveyCache, # "contents" parameter
      generation_config=genai.types.GenerationConfig(
          temperature=1.0, # "randomness" of model
      ),
  )
  parts = str(response.parts)
  surveyCache.append({"role":"model","parts":parts})
  surveyCache = json.dumps(surveyCache) # saves cache as a single string


  user.update({"surveyCache" : surveyCache})
  formatted_question = formatStringToJson(response.text)
  cacheToJson("backend\\recommender\\tests\\model_history.json",surveyCache)
  return formatted_question

if __name__ == "__main__":
  getNextQuestion("3")
  submitAnswer("3", "yes")