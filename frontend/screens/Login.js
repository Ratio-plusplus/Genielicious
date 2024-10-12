import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useAuth } from '../../backend/contexts/authContext/index';
import { doSignInWithEmailAndPassword } from '../../backend/firebase/auth';
import { ProfileContext } from "./ProfileContext";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";


export default function Login({navigation}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordIsVisible, setPasswordIsVisible] = React.useState(false);
  const [isLoggingIn, setisLoggingIn] = React.useState(false);
  const [validUser, setvalidUser] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 
  const { setUsername, setpfp } = useContext(ProfileContext);

    const handleLogin = async (e) => {
      const auth = getAuth();
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)

        //fetch user data from database using uid
        if (user) {
          const db = getDatabase();
          const userRef = ref(db, 'users/' + user.uid);

          //fetch data from firebase
          onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              //update context with fetched user data
              const username = data.username || "Ratio++"
              const pfp = data.photoURL || "../assets/pfp.png"

              setUsername(username);
              setpfp(pfp);

              navigation.navigate("Tab");
            }
          }, (error) => {
            console.error("Error fetching user data:", error);
          });
        } else {
          Alert.alert("Login Failed", "No user data found.");
        }
      } catch (error) {
        setErrorMessage("Login failed. Please check your credentials.");
        console.error("Login error:", error);
      }
        // await loginUser();
        // if (validUser) {
        //     navigation.navigate('Tab')
        // }
        
    }

    // const loginUser = async () => {
    //     setErrorMessage('');
    //     if (!isLoggingIn) {
    //         setisLoggingIn(true);

    //         try {
    //             await doSignInWithEmailAndPassword(email, password)
    //             setvalidUser(true);
    //         } catch (errorMessage) {
    //             if (errorMessage.code === 'auth/invalid-email') {
    //                 setErrorMessage('Invalid email.');
    //                 setisLoggingIn(false);
    //             }
    //         }
    //     }
    // }


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
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Feather name="mail" size={22} color="#7C808D" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email or Username"
              placeholderTextColor="#7C808D"
              //selectionColor="#3662AA"
              onChangeText={setEmail}
              value={email}
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Feather name="lock" size={22} color="#7C808D" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={!passwordIsVisible}
              placeholderTextColor="#7C808D"
              //selectionColor="#3662AA"
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity
              style={styles.passwordVisibleButton}
              onPress={() => setPasswordIsVisible(!passwordIsVisible)}
            >
              <Feather
                name={passwordIsVisible ? "eye" : "eye-off"}
                size={22}
                color="#7C808D"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordButtonText}>
              Forgot password?
            </Text>
                  </TouchableOpacity>
                  <Text style={styles.error}>{errorMessage}</Text>
                  <TouchableOpacity style={styles.loginButton} onPress={() => handleLogin()}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>
          <TouchableOpacity style={styles.googleButton}>
            <Image
              style={styles.googleLogo}
              //source={require("./assets/google-logo.png")}
            />
            <Text style={styles.googleButtonText}>Login with Google</Text>
          </TouchableOpacity>
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
    backgroundColor: "#2C3E50",
  },
  content: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#F4D1AE"
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
    borderBottomColor: "#F4D1AE",
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
    color: "#f0c016",
    fontSize: 16,
    fontWeight: "500",
    },
    error: {
        color: "#ff0000",
        marginTop: 10
    },
  loginButton: {
    backgroundColor: "#ed9a1c",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  loginButtonText: {
    color: "#272725",
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
    backgroundColor: "#ebeefa",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  googleButtonText: {
    color: "#272725",
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
    color: "#ebeefa",
  },
  registerButtonTextHighlight: {
    fontSize: 16,
    color: "#f0c016",
    fontWeight: "500",
  },
});