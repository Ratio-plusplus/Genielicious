import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Colors } from './Colors';

export default function EditProfile({ navigation }) {
    const pfp = require("../assets/pfp.png");
    const [selectedImage, setSelectedImage] = React.useState(pfp);
    const [name, setName] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

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
                        onPress={()=>navigation.navigate('Profile')}
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

            <ScrollView>
                <View style={{
                    alignItems: "center",
                    marginTop: 10,
                    marginBottom: 20}}>
                    <TouchableOpacity
                        onPress={handleImageSelection}>
                        <Image 
                            source={require("../assets/pfp.png")}
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
                    <View style={{
                        flexDirection: "column",
                        marginBottom: 10
                    }}>
                        <Text style={styles.sectionText}>Name</Text>
                        <View style={styles.inputContainers}>
                            <TextInput
                                placeholder="Name"
                                placeholderTextColor="#7C808D"
                                onChangeText={setName}
                                value={name}
                                editable={true}/>
                        </View>
                    </View>

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
                                editable={true}/>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: "column",
                        marginBottom: 6
                    }}>
                        <Text style={styles.sectionText}>Password</Text>
                        <View style={styles.inputContainers}>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#7C808D"
                                onChangeText={setPassword}
                                value={password}
                                editable={true}
                                secureTextEntry/>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.saveButton}>
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
    }
});