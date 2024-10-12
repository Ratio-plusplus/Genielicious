import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useEffect, useState } from 'react';
import { Colors } from './Colors';
import { ProfileContext } from './ProfileContext';
import { getActionFromState } from '@react-navigation/native';
import { getAuth, updatePassword } from '@firebase/auth';
import { doPasswordChange } from '../../backend/firebase/auth';

export default function EditProfile({ navigation }) {
    const { pfp, setpfp } = useContext(ProfileContext)
    const { username, setUsername} = useContext(ProfileContext)
    const [selectedImage, setSelectedImage] = React.useState(pfp);
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    //fetch user email from Firebase
    useEffect(() => {
        const auth = getAuth();
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

        console.log(result);

        if(!result.canceled){
            setSelectedImage(result.assets[0].uri)
            console.log(pfp)
            
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

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: Colors.blue,
        }}>
            <View style={{
                marginHorizontal: 12,
                marginTop: 12,
                marginBottom: 12,
                flexDirection: "row",
                justifyContent: "center"}}>
                    <TouchableOpacity 
                        onPress={()=>navigation.navigate('Settings')}
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
                    <Text style={{marginTop: 2, fontWeight: 600, fontSize: 22, color: Colors.ghost}}>Edit Profile</Text>
            </View>

            {/* button to use the camera */}
            <View style = {{alignItems: 'center', marginBottom: 15, marginTop: 15 }}>
                <TouchableOpacity onPress = {handleCameraCapture} style = {styles.cameraButton}>
                    <Text style = {styles.cameraButtonText}>Take a Picture</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={{
                    alignItems: "center",
                    marginTop: 10,
                    marginBottom: 20}}>
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
                    {/* Username input field */}
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
                                color="#7C808D"
                                editable={false}/>
                        </View>
                    </View>

                    {/* Password input field */}
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
                                secureTextEntry/>
                        </View>
                    </View>

                    {/* Save button */}
                    <TouchableOpacity style={styles.saveButton}
                        onPress={()=>
                        {
                            setpfp(selectedImage)
                            setUsername(username)
                            updateFirebasePassword();
                            navigation.navigate('Settings')
                            console.log(username)
                        }}>
                        <Text style={styles.saveText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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