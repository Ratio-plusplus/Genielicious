import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import * as React from "react";
import auth from '@react-native-firebase/auth';
import db from '@react-native-firebase/database';

export default function Login({navigation}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordIsVisible, setPasswordIsVisible] = React.useState(false);

    const createProfile = async (response: FirebaseAuthTypes.UserCredential) => {
        db().ref('/users/${response.user.uid}').set({ name });
        //db().ref('/users/${response.user.uid}').set({})
    };
    const handleLogin = async () => {
        if (email && password) {
            try {
                const response = await auth().createUserWithEmailAndPassword(email, password);

                if (response.user) {
                    await createProfile(response);
                    nav.replace("Home");
                }
            } catch (e) {
                Alert.alert("Oops", "Please try again.");
            }
        }
    };

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
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}
            onPress={() => navigation.navigate('Tab')}>Login</Text>
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
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 40,
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
    borderBottomColor: "#eee",
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
    color: "#3662AA",
    fontSize: 16,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#3662AA",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
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
    backgroundColor: "#F2F6F2",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  googleButtonText: {
    color: "#4E5867",
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
    color: "#7C808D",
  },
  registerButtonTextHighlight: {
    fontSize: 16,
    color: "#3662AA",
    fontWeight: "500",
  },
});