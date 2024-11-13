import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useEffect, useState } from 'react';
import { Colors } from './Colors';
import { ProfileContext } from '../contexts/ProfileContext';
import { getActionFromState } from '@react-navigation/native';
import { getAuth, updatePassword, updateProfile } from '@firebase/auth';
import { database, auth } from '../firebase/firebase';


export default function EditProfile({ navigation }) {
    const { pfp, setPfp } = useContext(ProfileContext)
    const { username, setUsername} = useContext(ProfileContext)
    const [selectedImage, setSelectedImage] = React.useState(pfp);
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    //fetch user email from Firebase
    useEffect(() => {
        const user = auth.currentUser;

        if (user) {
            setEmail(user.email);
        }
    }, []) //empty array to make sure nothing important get overwritten

    const handleImageSelection = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,4],
            quality: 1
        });

        if(!result.canceled){
            setSelectedImage(result.assets[0].uri)
        }
    };

    const handleCameraCapture = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1
        })
        
        console.log(result)
    
        if (!result.canceled){
            setSelectedImage(result.assets[0].uri)
        }
    };  

    //Update user password on Firebase
    const updateFirebasePassword = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            if (password.length >= 1) {
                try {
                    //update user password
                    await updatePassword(user, password);
                    Alert.alert("Password has been successfully updated")
                } catch (error) {
                    Alert.alert("Error", error.message);
                }
            }
        }
    };

    //save profile changes to firebase auth and realtime database
    const saveProfile = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        const idToken = await user.getIdToken(true);
        

        try {
            //save to Realtime Database
            const response = await fetch('http://10.0.2.2:5000/database/update_user',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ username: username, photoURL: selectedImage}),
                });

            //update context state
            setUsername(username);
            setPfp(selectedImage);
            
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert("Error", error.message);
        }
    
    }

    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.container}>
                    <TouchableOpacity 
                        onPress={()=>navigation.navigate('Settings')}   //navigate back to settings if back arrow is pressed
                        style={{
                            position: "absolute",
                            left: 0
                        }}>
                        <MaterialIcons
                            name="keyboard-arrow-left"
                            size={33}
                            color={Colors.ghost}
                        />
                    </TouchableOpacity>
                    <Text style={styles.title}>Edit Account</Text>
            </View>

            {/* button to use the camera */}
            <View style = {{alignItems: 'center', marginBottom: 15, marginTop: 15 }}>
                <TouchableOpacity onPress = {handleCameraCapture} style = {styles.cameraButton}>
                    <Text style = {styles.cameraButtonText}>Take a Picture</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={styles.pfpContainer}>
                    <TouchableOpacity
                        onPress={handleImageSelection}>
                        <Image 
                            source={{uri: selectedImage}}
                            style={{
                                height: 130,
                                width: 130,
                                borderRadius: 85,
                                borderWidth: 2,
                                borderColor: "#000"
                            }}/>

                        <View style={{
                            position: "absolute",
                            bottom: -5,
                            right: -5,
                            zIndex: 9999
                        }}>
                            <MaterialIcons
                                name="photo-camera"
                                size={32}
                                color={Colors.ghost}/>
                        </View>
                    </TouchableOpacity>
                </View>

                <View>
                    {/* username input field */}
                    <View style={{
                        flexDirection: "column",
                        marginBottom: 6
                    }}>
                        <Text style={styles.sectionText}>Username</Text>
                        <View style={styles.inputContainers}>
                            <TextInput
                                placeholder="Username"
                                placeholderTextColor="#7C808D"
                                onChangeText={setUsername}
                                value={username}
                                color={Colors.ghost}
                                editable={true}/>
                        </View>
                    </View>

                    {/* Email input field (non-editable) */}
                    <View style={{
                        flexDirection: "column",
                        marginBottom: 6
                    }}>
                        <Text style={styles.sectionText}>Email</Text>
                        <View style={styles.inputContainers}>
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="#7C808D"
                                onChangeText={setEmail}
                                value={email}
                                color={Colors.ghost}
                                editable={false}/>
                        </View>
                    </View>

                    {/* password input field */}
                    <View style={{
                        flexDirection: "column",
                        marginBottom: 6
                    }}>
                        <Text style={styles.sectionText}>Password</Text>
                        <View style={styles.inputContainers}>
                            <TextInput
                                placeholder="New Password"
                                placeholderTextColor="#7C808D"
                                onChangeText={setPassword}
                                value={password}
                                editable={true}
                                color={Colors.ghost}
                                secureTextEntry/>
                        </View>
                    </View>

                    {/* Save button */}
                    <TouchableOpacity style={styles.saveButton}
                        onPress={async()=>
                        {
                            // setpfp(selectedImage)
                            // setUsername(username)
                            await updateFirebasePassword();
                            await saveProfile();
                            navigation.navigate('Settings')
                            
                        }}>
                        <Text style={styles.saveText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.blue,
    },
    container: {
        marginHorizontal: 12,
        marginTop: 12,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "center"
    },
    title: {
        marginTop: 2, 
        fontWeight: '600', 
        fontSize: 22, 
        color: Colors.ghost
    },
    pfpContainer: {
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20
    },
    pfpLook: {
        height: 130,
        width: 130,
        borderRadius: 85,
        borderWidth: 2,
        borderColor: "#000"
    },
    cameraLook: {
        position: "absolute",
        bottom: -5,
        right: -5,
        zIndex: 9999
    },
    sectionText: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 15,
        color: Colors.ghost
    },
    inputContainers: {
        height: 44,
        width: "92%",
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 4,
        marginVertical: 6,
        marginLeft: 15,
        alignItems: "center",
        paddingLeft: 8
    },
    saveButton: {
        backgroundColor: Colors.gold,
        marginLeft: 60,
        marginTop: 20,
        height: 50,
        width: "67%",
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    },
    saveText: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.raisin
    },
    cameraButton: {
        backgroundColor: Colors.gold,
        padding: 10,
        borderRadius: 6,
    },
    cameraButtonText: {
        color: Colors.raisin,
        fontSize: 16,
        fontWeight: 'bold',
    },
});