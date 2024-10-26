# testing Flask
from flask import Flask, request, abort
from firebase_init import verifyIDToken
import json
# import decider
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

if __name__ == "__main__":
    app.run(debug=True)