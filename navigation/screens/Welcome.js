import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import * as React from "react";

export default function Welcome({navigation}) {
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
            <Text style={styles.title}>Welcome</Text>
          </View>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}
            onPress={() => navigation.navigate('Login')}>Login</Text>
          </TouchableOpacity>
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>
          <TouchableOpacity style={styles.googleButton}>
            <Text style={styles.googleButtonText}
            onPress={() => navigation.navigate('Signup')}>Sign Up</Text>
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
});