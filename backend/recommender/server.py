# testing Flask
from flask import Flask, redirect, url_for, request, abort
import json
import uuid
import decider

app = Flask(__name__)

# simply returns out the questions to be displayed on the frontend
@app.route("/client/questions/short")
def sendShortQuestions():
    query = request.args

    # booleans that decides if the price/distance question should be provided;
    # ... do not provide in event where distance and price pref are already known
    distance_bool = query.get("hasDistance", "false")
    hasDistance = distance_bool.lower() == "true"  
    
    price_bool = query.get("hasPrice", "false")
    hasPrice = price_bool.lower() == "true"
    
    return decider.getShortSessionQuestions(hasPrice=hasPrice,hasDistance=hasDistance)

# receives short question answers to process results and return yelp api results
@app.route("/client/answers/short")
def receiveShortAnswers():
    # TODO: verify answers are valid
    query = request.args
    answers = query.get("answers",None)
    # answers should be in this format:
    # query["answers"] = 
    #               {
    #                   "<questionID>": "<answer>",
    #                    ...
    #               }
    if not answers:
        abort(400, "Parameter \"answers\" not provided.")
    
    answers = json.loads(answers)
    return decider.processShortSessionAnswers(answers)

if __name__ == "__main__":
    app.run(debug=True)