# testing Flask
from flask import Flask, redirect, url_for, request
# import json
import uuid
import decider

app = Flask(__name__)

# simply returns out the questions to be displayed on the frontend
@app.route("/client/questions/short")
def sendShortQuestions():
    query = request.args

    distance_val = query.get("hasDistance",False) # should be boolean, decides if the price/distance should be provided; 
    hasDistance = distance_val.lower() == "true"  # ... do not provide in event where distance and price pref are already known
    price_str = query.get("hasPrice", False)
    hasPrice = price_str == "true"
    
    return decider.getShortSessionQuestions(hasPrice=hasPrice,hasDistance=hasDistance)

# receives short question answers to process results and return yelp api results
@app.route("/client/answers/short")
def receiveShortAnswers():
    # TODO
    pass

if __name__ == "__main__":
    app.run(debug=True)