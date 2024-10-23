from firebase_admin import db, credentials, initialize_app, auth
from dotenv import find_dotenv, load_dotenv
import os
from flask import Flask, request, jsonify

from firebase_init import initialize_firebase   

dotenv_path = find_dotenv()
load_dotenv(dotenv_path) # loads env vars into path

initialize_firebase();


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

