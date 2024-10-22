import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "./Colors";
import { doCreateUserWithEmailAndPassword } from '../../backend/firebase/auth';
import { ProfileContext } from "../../backend/contexts/ProfileContext";
import { useContext } from "react";
import { getDataConnect } from "firebase/data-connect";
import { getDatabase, ref, get} from "firebase/database";

export default function Signup({navigation}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [passwordIsVisible, setPasswordIsVisible] = React.useState(false);
  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdUser, setcreatedUser] = useState(false);
  const { setUsername: setProfileUsername, setpfp } = useContext(ProfileContext)


    //On Press Method
    const handleSignup = async () => {
        //Check if passwords match
        try{
          const userCredential = await createUser();
          console.log(userCredential);
          if (userCredential) {
            //fetch user data after signing up
            const userId = userCredential.user.uid;
            const userRef = ref(getDatabase(), 'users/' + userId);
            const snapshot = await get(userRef);
  
            if (snapshot.exists()) {
              const userData = snapshot.val();
              //Update profilecontext with username and pfp
              setProfileUsername(userData.username || "Ratio++");
              setpfp(userData.pfp || Image.resolveAssetSource(require("../assets/pfp.png")).uri);
            }
            setcreatedUser(true);
          }
        } catch (error) {
          console.error("Error during signup:", error.message);
          setErrorMessage(error.message);
          setIsRegistering(false);
        }
      };

    const validate = (text) => {
        console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(text) === false) {
            setErrorMessage("Invalid Email");
            setEmail(text)
            return false;
        }
        else {
            setEmail(text)
            console.log("Email is Correct");
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
                if (validate(email)){
                    if (password == confirmPassword) {
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
    }

    useEffect(() => {
        if (createdUser) {
            navigation.navigate('Tab');
        }
    }, [createdUser]);

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
            <Text style={styles.title}>Sign Up</Text>
          </View>

          {/* username input field */}
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Ionicons name="person" size={22} color="#7C808D" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#7C808D"
              color={Colors.ghost}
              onChangeText={setUsername}    //updates username state
              value={username}    //current username state
            />
          </View>

          {/* email input field */}
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Feather name="mail" size={22} color="#7C808D" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#7C808D"
              color={Colors.ghost}
              onChangeText={(text) => validate(text)}     //updates email state
              value={email}     //current email state
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
              onChangeText={setPassword}      //updates password state
              value={password}      //current password state
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

          {/* confirm password input field */}
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Feather name="lock" size={22} color="#7C808D" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!confirmPasswordIsVisible}
              placeholderTextColor="#7C808D"
              color={Colors.ghost}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />

            {/* toggle password visibility */}
            <TouchableOpacity
              style={styles.passwordVisibleButton}
              onPress={() => setConfirmPasswordIsVisible(!confirmPasswordIsVisible)}>
              <Feather
                name={confirmPasswordIsVisible ? "eye" : "eye-off"}
                size={22}
                color="#7C808D"
              />
            </TouchableOpacity>
          </View>
                    <Text style={styles.error}>{errorMessage}</Text>
          {/* signup button */}
          <TouchableOpacity style={styles.signupButton} onPress={() => handleSignup()}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* separator between signup methods */}
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          {/* sign up with Google button */}
          <TouchableOpacity style={styles.googleButton}>
            <Image
              style={styles.googleLogo}
              source={require("../../frontend/assets/google-logo.png")}
            />
            <Text style={styles.googleButtonText}>Sign up with Google</Text>
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
        marginTop: 10
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
  signupButton: {
    backgroundColor: Colors.gold,
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  signupButtonText: {
    color: Colors.raisin,
    textAlign: "center",
    fontWeight: "600",
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
    backgroundColor: Colors.ghost,
    flex: 1,
  },
  orText: {
    color: Colors.ghost,
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
    fontWeight: "600",
    textAlign: "center",
  },
  googleLogo: {
    width: 20.03,
    height: 20.44,
    position: "absolute",
    left: 14,
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