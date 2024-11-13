from flask import Flask, request, abort
import firebase
import gemini
import results

app = Flask(__name__)

#region Backend recommender calls
# clears all user related cache in the database
@app.route("/client/clear_session")
def clearSessionCache():
    # # # check if auth header is given
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    return results.clearCache(user_id)
    

# compilation of restaurant recommendations to be displayed on results page
@app.route("/client/results")
def getResults():
    # # # check if auth header is given
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    return results.getResults(user_id)

# simply returns out the questions to be displayed on the frontend
@app.route("/client/questions/<mode>")
def sendQuestion(mode: str):
    # # # check if auth header is given
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    # verify the mode called
    mode = mode.lower()
    if mode not in ("short", "medium", "long"):
        abort(400, {'error':"Invalid API url"})

    # question depending on mode
    return gemini.getNextQuestion(user_id,mode)

# receives short question answer to process results and return yelp api results
@app.route("/client/answer/<mode>", methods=["POST"])
def receiveAnswer(mode:str):
    # # # check if auth header is given
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    # verify the mode called
    mode = mode.lower()
    if mode not in ("short", "medium", "long"):
        abort(400, {'error':"Invalid API url"})

    # check for answer parameter
    # answers should be in this format: 
        #       query["answer"] = <answer>
    query = request.get_json()
    answer = query.get("answer",None)
    if not answer:
        abort(400, "Parameter \"answer\" not provided.")

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

#endregion

#region Outer Region: Firebase Database calls
#region Inner Region: User info
@app.route("/database/create_user", methods=["POST"])
def createUserInfo():

    query = request.get_json()

    if not query:
        abort(400, "Information not provided")

    return firebase.createNewUser(query)

@app.route("/database/update_user", methods=["POST"])
def updateUser():
    query = request.get_json()

    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    return firebase.updateDatabaseUser(query, user_id)

@app.route("/database/get_user_info", methods=["GET"])
def getUserInfo():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    return firebase.getUser(user_id)

@app.route("/database/get_result_cache", methods=["GET"])
def getResultCache():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    return firebase.getResultsCache(user_id)

@app.route("/database/add_history", methods=["POST"])
def addHistory():
    query = request.get_json()
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    if not query:
        abort(400, "Information not provided")

    return firebase.addHistory(query, user_id)

@app.route("/database/get_history", methods=["GET"])
def getHistory():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    return firebase.getHistory(user_id)
#endregion Inner Region

#region Inner Region: User Flavor Profiles
@app.route("/database/get_user_profile", methods=["GET"])
def getUserProfile():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    return firebase.getProfile(user_id)

@app.route("/database/add_flavor_profile", methods=["POST"])
def addFlavorProfile():
    query = request.get_json()
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    if not query:
        abort(400, "Information not provided")

    return firebase.addFlavorProfile(query, user_id)

@app.route("/database/update_flavor_profile", methods=["POST"])
def updateFlavorProfile():
    query = request.get_json()
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401,{'error': 'Missing authorization header'})

    # # # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401,{'error': 'Invalid or expired token'})

    if not query:
        abort(400, "Information not provided")

    return firebase.updateFlavorProfile(query, user_id)

@app.route("/database/delete_flavor_profile", methods=["DELETE"])
def deleteFlavorProfile():
    query = request.get_json()
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401, {'error': 'Missing authorization header'})

    # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401, {'error': 'Invalid or expired token'})

    profile_id = query.get("profileId")
    if not profile_id:
        abort(400, "Profile ID not provided")

    return firebase.deleteFlavorProfile(user_id, profile_id)

@app.route("/database/delete_user", methods=["DELETE"])
def deleteUser():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401, {'error': 'Missing authorization header'})

    # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401, {'error': 'Invalid or expired token'})

    return firebase.deleteUserData(user_id)
#endregion Inner Region

#endregion Outer Region

@app.route("/database/set_active_profile", methods=["POST"])
def setActiveProfile():
    query = request.get_json()
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401, {'error': 'Missing authorization header'})

    # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401, {'error': 'Invalid or expired token'})

    profile_id = query.get("profileId")
    if not profile_id:
        abort(400, "Profile ID not provided")

    return firebase.setActiveProfile(user_id, profile_id)

@app.route("/database/get_active_profile", methods=["GET"])
def getActiveProfile():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        abort(401, {'error': 'Missing authorization header'})

    # Validate Token
    id_token = auth_header.split(' ')[1]
    user_id = firebase.verify_id_token(id_token)
    if not user_id:
        abort(401, {'error': 'Invalid or expired token'})

    return firebase.getActiveProfileId(user_id)

if __name__ == "__main__":
    try:
        app.run(debug=False)
    except Exception as e:
        print(f"Error: {e}")

