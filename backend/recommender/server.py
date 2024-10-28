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
@app.route("/client/clear_session")
def clearSessionCache():
    # user_id = "3" # used in testing
    # # # check if auth header is given
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = verifyIDToken(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    return results.clearCache(user_id)
    

# compilation of restaurant recommendations to be displayed on results page
@app.route("/client/results")
def getResults():
    # user_id = "3" 
    # # # check if auth header is given
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = verifyIDToken(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    return results.getResults(user_id)

# simply returns out the questions to be displayed on the frontend
@app.route("/client/questions/<mode>")
def sendQuestion(mode: str):
    # user_id = "3" 
    # # # check if auth header is given
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = verifyIDToken(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    # verify the mode called
    mode = mode.lower()
    if mode not in ("short", "medium", "long"):
        abort(400, {'error':"Invalid API url"})

    # question depending on mode
    return gemini.getNextQuestion(user_id,mode)

# receives short question answer to process results and return yelp api results
@app.route("/client/answer/<mode>")
def receiveAnswer(mode:str, methods=["POST"]):
    # user_id = "3"     
    # # # check if auth header is given
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = verifyIDToken(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    # verify the mode called
    mode = mode.lower()
    if mode not in ("short", "medium", "long"):
        abort(400, {'error':"Invalid API url"})

    # check for answer parameter
    # answers should be in this format: 
        #       query["answer"] = <answer>
    query = request.args
    answer = query.get("answer",None)
    if not answer:
        abort(400, "Parameter \"answer\" not provided.")
    answer = json.loads(answer)

    # answer submission works the same in all modes
    return gemini.submitAnswer(user_id, answer)

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
    query = request.headers.get("Authorization")

    if not query:
        abort(400, "Information not provided")

    return firebase.getUser(query)

@app.route("/database/get_user_profile", methods=["GET"])
def getUserProfile():
    query = request.headers.get("Authorization")

    if not query:
        abort(400, "Information not provided")

    return firebase.getProfile(query)

@app.route("/database/add_flavor_profile", methods=["POST"])
def addFlavorProfile():
    query = request.get_json()
    idToken = request.headers.get("Authorization")


    if not query:
        abort(400, "Information not provided")

    return firebase.addFlavorProfile(query, idToken)

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

