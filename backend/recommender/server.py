# testing Flask
import flask
from flask import Flask, redirect, url_for, request, abort
import json
import uuid
import decider
import firebase
import gemini
import results

app = Flask(__name__)

# clears all user related cache in the database
@app.route("/client/session_cache/clear")
def clearSessionCache():
    user_id = "3" #TODO: get from auth
    return results.clearCache(user_id)

# compilation of restaurant recommendations to be displayed on results page
@app.route("/client/results")
def compileResults():
    user_id = "3" # TODO: get from auth
    return results.compileResults(user_id)

# simply returns out the questions to be displayed on the frontend
@app.route("/client/questions/<mode>")
def sendQuestion(mode: str):
    user_id = "3" # TODO: will get from Auth Token
    mode = mode.lower()
    if mode not in ("short", "medium", "long"):
        abort(400, "Invalid API url")

    if mode == "short":
        return decider.getShortSessionQuestions()
    if mode == "medium":
        return gemini.getNextQuestion(user_id,mode)
    if mode == "long":
        # TODO
        pass

# receives short question answers to process results and return yelp api results
@app.route("/client/answers/<mode>")
def receiveAnswer(mode:str, methods=["POST"]):
    user_id = "3" # TODO: will get from Auth Token
    # verify the mode called
    mode = mode.lower()
    if mode not in ("short", "medium", "long"):
        abort(400, "Invalid API url")

    # check for answer parameters
    query = request.args
    answers = query.get("answers",None)
    if not answers:
        abort(400, "Parameter \"answers\" not provided.")
    answers = json.loads(answers)

    # carryout mode selection
    if mode == "short":
        # TODO: verify answers are valid (will be done within decider)
        # answers should be in this format:
        # query["answers"] = 
        #               {
        #                   "<questionID>": "<answer>",
        #                    ...
        #               }
        return decider.processShortSessionAnswers(answers)
    if mode == "medium":
        # TODO: complete this
        # answers are should be in this format: 
        #       query["answers"] = <answer> 
        # return answers
        return gemini.submitAnswer(user_id, answers)

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

@app.route("/database/update_user", methods=["POST"])
def updateUser():
    query = request.get_json()

    if not query:
        abort(400, "Data not provided")

    return firebase.updateDatabaseUser(query)

if __name__ == "__main__":
    try:
        app.run(debug=False)
    except Exception as e:
        print(f"Error: {e}")

