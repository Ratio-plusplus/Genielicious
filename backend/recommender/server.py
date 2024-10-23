# testing Flask
import flask
from flask import Flask, redirect, url_for, request, abort
import json
import uuid
import decider
import firebase

app = Flask(__name__)

# simply returns out the questions to be displayed on the frontendpip
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

# @app.route("/auth/create_user", methods=['POST'])
# def createUser():
#     query = request.get_json()

#     if not query:
#         abort(400, "User info not provided")

   
#     #info = json.loads(info)
#     print(query)
#     return firebase.create_user(query)

@app.route("/auth/verify_tokens", methods=['POST'])
def verifyToken():
    query = request.args
    info = query.get("info", None)

    if not info:
        abort(400, "User info not provided")

    info = json.loads(info)
    return firebase.verify_id_token(info)

@app.route("/database/get_user_info", methods=["GET"])
def getUserInfo():
    query = request.get_json()

    if not query:
        abort(400, "Information not provided")

    return firebase.getUser(query)

@app.route("/database/create_user", methods=["POST"])
def createUserInfo():

    query = request.get_json()

    if not query:
        abort(400, "Information not provided")

    return firebase.createNewUser(query)

if __name__ == "__main__":
    try:
        app.run(debug=False)
    except Exception as e:
        print(f"Error: {e}")

@app.route("/database/update_user", methods=["POST"])
def updateUser():
    query = request.get_json()

    if not query:
        abort(400, "Data not provided")

    return firebase.updateUser(query)