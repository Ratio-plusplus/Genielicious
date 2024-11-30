import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "./Colors";
import { doCreateUserWithEmailAndPassword } from '../firebase/auth';



export default function Signup({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [passwordIsVisible, setPasswordIsVisible] = React.useState(false);
  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdUser, setcreatedUser] = useState(false);
  const [isEditable, setIsEditable] = useState(true);


  //On Press Method
  const handleSignup = async () => {
    setIsEditable(false);
    //Check if passwords match
    try {
      const user = await createUser();
      if (user) {
        const intervalId = setInterval(async () => {
          await user.reload();
          if (user.emailVerified) {
            console.log("verified");
            clearInterval(intervalId);
            //fetch user data after signing up
            navigation.navigate('Tab');
          } else {
            setErrorMessage('Please verify your email before logging in.');
            console.log("Waiting for verification");
          }
        }, 1000);

        setcreatedUser(true);
      }
    } catch (error) {
      console.error("Error during signup:", error.message);
      setErrorMessage(error.message);
      setIsRegistering(false);
    }
  };

  const validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      setErrorMessage("Invalid Email");
      setEmail(text)
      return false;
    }
    else {
      setEmail(text)
      setErrorMessage("");
      return true;
    }
  }

  //Create user method
  const createUser = async () => {
    //e.preventDefault()
    setErrorMessage('');
    if (!isRegistering) {
      setIsRegistering(true);

      try {
        //Check if passwords match
        if (validate(email)) {
          if (password == confirmPassword) {
            console.log(username);
            return await doCreateUserWithEmailAndPassword(email, password, username)
          }
        }
        //Error msgs from Firebase Auth
      } catch (errorMessage) {
        if (errorMessage.code === "auth/email-already-in-use") {
          setErrorMessage("Email already exists. Please choose a different email.");
        } else if (errorMessage.code === "auth/missing-email") {
          setErrorMessage("Please provide an email address");
        } else if (errorMessage.code === "auth/invalid-password") {
          setErrorMessage("Invalid Password. Password must be at least six characters and contain an uppercase letter, number, and special character");
        } else if (errorMessage.code === "auth/password-does-not-meet-requirements") {
          setErrorMessage("Invalid Password. Password must be at least six characters and contain an uppercase letter, number, and special character");
        }
        else {
          setErrorMessage(errorMessage.code)
        }
        //No longer registering
        setIsRegistering(false);
      }
    }
  }

  const handleGoogleLogin = async () => {
    await onGoogleSignIn();
    if (createdUser) {
      console.log("Success2");
      navigation.navigate('Tab')
    }
  }

  const onGoogleSignIn = async () => {
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doSignInWithGoogle()
        console.log("Success");
        setcreatedUser(true);

      } catch (errorMessage) {
        setErrorMessage(errorMessage.code);
        console.log(errorMessage);

      }
    }
    setIsRegistering(false);
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}>

        <View style={styles.content}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.title}>Sign Up</Text>
          </View>

          {/* username input field */}
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <View style={styles.icon}>
                <Ionicons name="person" size={22} color={Colors.raisin} />
              </View>
              <TextInput
                style={styles.inputField}

                placeholder="Username"
                placeholderTextColor="#555"
                color={Colors.raisin}
                disabled={!isEditable}
                onChangeText={setUsername}    //updates username state
                value={username}    //current username state
              />
            </View>
          </View>

          {/* email input field */}
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <View style={styles.icon}>
                <Feather name="mail" size={22} color={Colors.raisin} />
              </View>
              <TextInput
                style={styles.inputField}

                placeholder="Email"
                placeholderTextColor="#555"
                color={Colors.raisin}
                disabled={!isEditable}
                onChangeText={(text) => validate(text)}     //updates email state
                value={email}     //current email state
              />
            </View>
          </View>

          {/* password input field */}
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <View style={styles.icon}>
                <Feather name="lock" size={22} color={Colors.raisin} />
              </View>
              <TextInput
                style={styles.inputField}
                placeholder="Password"
                disabled={!isEditable}
                secureTextEntry={!passwordIsVisible}
                placeholderTextColor="#555"
                color={Colors.raisin}
                onChangeText={setPassword}      //updates password state
                value={password}      //current password state
              />
            </View>

            {/* toggle password visibility */}
            <TouchableOpacity
              style={styles.passwordVisibleButton}
              onPress={() => setPasswordIsVisible(!passwordIsVisible)}>
              <Feather
                name={passwordIsVisible ? "eye" : "eye-off"}    //changes icon based on visibility state
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          {/* confirm password input field */}
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <View style={styles.icon}>
                <Feather name="lock" size={22} color={Colors.raisin} />
              </View>
              <TextInput
                style={styles.inputField}
                placeholder="Confirm Password"
                secureTextEntry={!confirmPasswordIsVisible}
                placeholderTextColor="#555"
                color={Colors.raisin}
                disabled={!isEditable}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
              />
            </View>

            {/* toggle password visibility */}
            <TouchableOpacity
              style={styles.passwordVisibleButton}
              disabled={!isEditable}
              onPress={() => setConfirmPasswordIsVisible(!confirmPasswordIsVisible)}>
              <Feather
                name={confirmPasswordIsVisible ? "eye" : "eye-off"}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.error}>{errorMessage}</Text>

          {/* signup button */}
          <TouchableOpacity style={styles.signupButton} onPress={() => handleSignup()}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* navigate to Login screen */}
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>
              Already have an account?{" "}
              <Text style={styles.loginButtonTextHighlight}
                onPress={() => navigation.navigate('Login')}>
                Login now!
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blue,
  },
  inputField: {
    backgroundColor: Colors.champagne,
    flex: 1,
    fontSize: 16,
    flexDirection: 'row',
  },
  content: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 40,
    color: Colors.champagne
  },
  error: {
    color: "#ff0000",
    marginBottom: 10
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },
  icon: {
    marginRight: 15,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: Colors.raisin,
    backgroundColor: Colors.yellow,
    paddingVertical: 5,
    paddingHorizontal: 15
  },
  input: {
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: Colors.champagne,
    flex: 1,
    padding: 10,
    borderColor: Colors.gold,
    fontSize: 16,
    flexDirection: 'row',
  },
  passwordVisibleButton: {
    position: "absolute",
    right: 10,
  },
  signupButton: {
    backgroundColor: Colors.gold,
    padding: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.raisin
  },
  signupButtonText: {
    color: Colors.raisin,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  loginButton: {
    alignSelf: "center",
    marginTop: 40,
  },
  loginButtonText: {
    fontSize: 16,
    color: Colors.ghost,
  },
  loginButtonTextHighlight: {
    fontSize: 16,
    color: Colors.yellow,
    fontWeight: "600",
  },
});