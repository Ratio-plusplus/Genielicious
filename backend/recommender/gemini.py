import requests
import json
import os
from dotenv import find_dotenv, load_dotenv
import google.generativeai as genai
import os
from yelp import cacheToJson
dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=API_KEY)

history = [
        {"role":"user",
         "parts":[{
           "text": "Hello"}]},
        {"role": "model",
         "parts":[{
           "text": "Great to meet you. What would you like to know?"}]},
        {"role":"user",
         "parts":[{
           "text": "I have two dogs in my house. How many paws are in my house?"}]},
      ]
    

model = genai.GenerativeModel("gemini-1.5-flash") # model version we're using
response = model.generate_content( 
    history, # "contents" parameter
    generation_config=genai.types.GenerationConfig(        
        candidate_count=1, # Only one candidate option for now.
        # stop_sequences=["x"],
        # max_output_tokens=20,
        temperature=1.0,
    ),
)

cacheToJson("backend\\recommender\\tests\\model_history.json",response.text)
print(response.text)
