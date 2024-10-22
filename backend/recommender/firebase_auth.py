from firebase_admin import db, credentials, initialize_app, auth
from dotenv import find_dotenv, load_dotenv
import os
from flask import Flask, request, jsonify

cred = credentials.Certificate("confidential\\serviceAccountKey.json")
db_url = {'databaseURL': os.getenv("DATABASE_URL")}

genie_app = initialize_app(cred, db_url)

def create_user(query):
    try:
        email = query.get("email")
        password = query.get("password")
        username = query.get("username")

        #Create User with Firebase Admin SDK
        user = auth.create_user(email=email, password=password)
        print(f'User created with UID: {user.uid}')

        ref = db.reference(f'users/{user.uid}')
        ref.set({
            'username': username,
            'email':email,
            'pfp': ''
            })

        return jsonify({"uid": user.uid, "message": "User created successfully"}), 200

    except Exception as e:
        print(f"Error creating user: {e}")
        return jsonify(message=f"Error with code: {e}")

def verify_id_token(info):
    idToken = info['idToken']
    try:
        decoded_token = auth.verify_id_token(idToken)
        uid = decoded_token['uid']
        return jsonify({"uid": uid, "message": "Token verificed!"}), 200
    except auth.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 400