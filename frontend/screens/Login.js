import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal } from "react-native";
import { Colors } from "./Colors";
import React, { useContext, useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { doSignInWithEmailAndPassword, doSignInWithGoogle, doPasswordReset } from '../firebase/auth';
import { ProfileContext } from "../contexts/ProfileContext";

export default function Login({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordIsVisible, setPasswordIsVisible] = React.useState(false);
  const [isLoggingIn, setisLoggingIn] = React.useState(false);
  const [validUser, setvalidUser] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setUsername, setPfp } = useContext(ProfileContext);
  //Reset Password States
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { userLoggedIn } = useAuth()
  useEffect(() => {
    if (userLoggedIn) {
      navigation.navigate('Tab');
    }
  }, []);

  const handleLogin = async () => {
    setErrorMessage('');
    if (!isLoggingIn) {
      setisLoggingIn(true);
    }
    try {
      const user = await doSignInWithEmailAndPassword(email, password);
      //fetch user data from database using uid
      if (user) {
        setvalidUser(true);
      }
    } catch (errorMessage) {
      if (errorMessage.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email. Please try again.');
      }
      else if (errorMessage.code === 'auth/invalid-credential') {
        setErrorMessage('Incorrect password for email. Please try again.');
      }
      else if (errorMessage.code === 'auth/missing-password') {
        setErrorMessage('Please input a password.')
      }
      else {
        setErrorMessage(errorMessage.code);
        console.log(errorMessage);
      }
      setisLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    await onGoogleSignIn();
    if (validUser) {
      console.log("Success2");
      navigation.navigate('Tab')
    }
  };

  const onGoogleSignIn = async () => {
    if (!isLoggingIn) {
      setisLoggingIn(true);
      try {
        await doSignInWithGoogle()
        console.log("Success");
        setvalidUser(true);

      } catch (errorMessage) {
        setErrorMessage(errorMessage.code);
        console.log(errorMessage);

      }
    }
    setisLoggingIn(false);
  };

  const handlePasswordReset = async () => {
    try {
      await doPasswordReset(resetEmail);
      setMessage("Password reset email sent! Please check your inbox.");
      setResetEmail("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error sending reset email: " + error.message);
      setMessage("");
    }
  };

  useEffect(() => {
    if (validUser) {
      console.log("checkpoint");
      setvalidUser(false);
      navigation.navigate('Tab');
    }
  }, [validUser]);

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
            <Text style={styles.title}>Login</Text>
          </View>

          {/* email/username input field */}
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
                onChangeText={setEmail}   //updates email state when user types
                value={email}   //current email state
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
                secureTextEntry={!passwordIsVisible}
                placeholderTextColor="#555"
                color={Colors.raisin}
                onChangeText={setPassword}    //updates password state
                value={password}    //current password state
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

          {/* forgot password */}
          <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.forgotPasswordButtonText}>
              Forgot password?
            </Text>
          </TouchableOpacity>
          <Text style={styles.error}>{errorMessage}</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => handleLogin()}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* separator between login methods */}
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          {/* login with Google button */}
          <TouchableOpacity style={styles.googleButton} onPress={() => handleGoogleLogin()}>
            <Image
              style={styles.googleLogo}
              source={require("../../frontend/assets/google-logo.png")}
            />
            <Text style={styles.googleButtonText}>Login with Google</Text>
          </TouchableOpacity>

          {/* navigate to the Signup screen */}
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>
              Don't have an account yet?{" "}
              <Text style={styles.registerButtonTextHighlight}
                onPress={() => navigation.navigate('Signup')}>
                Register now!
              </Text>
            </Text>
          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Reset Password</Text>
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                {message ? <Text style={styles.success}>{message}</Text> : null}
                <TextInput
                  style={styles.resetField}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  color={Colors.ghost}
                />
                <TouchableOpacity onPress={handlePasswordReset}>
                  <View style={styles.resetButton}>
                      <Text style={{fontSize: 16, textAlign: 'center'}}>Send Reset Email</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <View style={styles.cancelButton}>
                      <Text style={{fontSize: 16, textAlign: 'center'}}>Cancel</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: Colors.blue,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.ghost
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: Colors.ghost
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
  inputField: {
    backgroundColor: Colors.champagne,
    flex: 1,
    fontSize: 16,
    flexDirection: 'row',
  },
  passwordVisibleButton: {
    position: "absolute",
    right: 10,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
  },
  forgotPasswordButtonText: {
    color: Colors.yellow,
    fontSize: 16,
    fontWeight: "500",
  },
  error: {
    color: "#ff0000",
    marginTop: 10
  },
  loginButton: {
    backgroundColor: Colors.gold,
    padding: 14,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: Colors.raisin
  },
  loginButtonText: {
    color: Colors.raisin,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  orLine: {
    height: 1,
    backgroundColor: "#eee",
    flex: 1,
  },
  orText: {
    color: "#7C808D",
    marginRight: 10,
    marginLeft: 10,
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: Colors.ghost,
    padding: 14,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: Colors.raisin
  },
  googleButtonText: {
    color: Colors.raisin,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  googleLogo: {
    width: 20.03,
    height: 20.44,
    position: "absolute",
    left: 14,
  },
  registerButton: {
    alignSelf: "center",
    marginTop: 40,
  },
  registerButtonText: {
    fontSize: 16,
    color: Colors.ghost,
  },
  registerButtonTextHighlight: {
    fontSize: 16,
    color: Colors.yellow,
    fontWeight: "500",
  },
  resetField: {
    backgroundColor: Colors.blue,
    fontSize: 16,
    padding: 10,
    borderWidth: 2,
    borderColor: Colors.ghost,
    borderRadius: 10,
    width: '90%',
  },
  resetButton: {
    backgroundColor: Colors.gold,
    padding: 10,
    borderWidth: 2,
    borderColor: Colors.raisin,
    borderRadius: 10,
    width: 250,
    marginVertical: 10
  },
  cancelButton: {
    backgroundColor: Colors.ghost,
    padding: 10,
    borderWidth: 2,
    borderColor: Colors.raisin,
    borderRadius: 10,
    width: 250,
  }
});