import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { Colors } from "./Colors";
import React, { useEffect, useState } from "react";
import { useAuth } from '../../backend/contexts/authContext/index';
import { doSignInWithEmailAndPassword } from '../../backend/firebase/auth';

export default function Login({navigation}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordIsVisible, setPasswordIsVisible] = React.useState(false);
  const [isLoggingIn, setisLoggingIn] = React.useState(false);
  const [validUser, setvalidUser] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        await loginUser();
        if (validUser) {
            navigation.navigate('Tab')
        }
        
    }

    const loginUser = async () => {
        setErrorMessage('');
        if (!isLoggingIn) {
            setisLoggingIn(true);

            try {
                await doSignInWithEmailAndPassword(email, password)
                setvalidUser(true);
            } catch (errorMessage) {
                if (errorMessage.code === 'auth/invalid-email') {
                    setErrorMessage('Invalid email.');
                    setisLoggingIn(false);
                }
            }
        }
    }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto"/>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}>

        <View style={styles.content}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.title}>Login</Text>
          </View>

          {/* email/username input field */}
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Feather name="mail" size={22} color="#7C808D" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email or Username"
              placeholderTextColor="#7C808D"
              color={Colors.ghost}
              onChangeText={setEmail}   //updates email state when user types
              value={email}   //current email state
            />
          </View>

          {/* password input field */}
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Feather name="lock" size={22} color="#7C808D" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={!passwordIsVisible}
              placeholderTextColor="#7C808D"
              color={Colors.ghost}
              onChangeText={setPassword}    //updates password state
              value={password}    //current password state
            />

            {/* toggle password visibility */}
            <TouchableOpacity
              style={styles.passwordVisibleButton}
              onPress={() => setPasswordIsVisible(!passwordIsVisible)}>
              <Feather
                name={passwordIsVisible ? "eye" : "eye-off"}    //changes icon based on visibility state
                size={22}
                color="#7C808D"
              />
            </TouchableOpacity>
          </View>

          {/* forgot password */}
          <TouchableOpacity style={styles.forgotPasswordButton}>
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
          <TouchableOpacity style={styles.googleButton}>
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
  },
  input: {
    borderBottomWidth: 1.5,
    flex: 1,
    paddingBottom: 10,
    borderBottomColor: Colors.champagne,
    fontSize: 16,
  },
  passwordVisibleButton: {
    position: "absolute",
    right: 0,
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
    borderRadius: 10,
    marginTop: 20,
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
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
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
});