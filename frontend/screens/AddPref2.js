import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, {useState} from 'react';
import { Colors } from './Colors';
import CheckBox from 'react-native-check-box';


//adding backend plus previous data from other page
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import { isChecked } from ''

const appSettings = {
    databaseURL: REACT_APP_FIREBASE_DATABASE_URL
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
//need to connect user authentication to this part

export default function AddPref2({ navigation }) {
    const pfp = require("../assets/pfp.png");
    const [selectedImage, setSelectedImage] = React.useState(pfp);
    const [name, setName] = React.useState();
    const [isChecked, setIsChecked] = useState({
        ten: false, fifteen: false, twenty: false,
        $20: false, $50: false, 
    });

    //handle image selection
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
        <SafeAreaView style={styles.background}>
            <View style={styles.container}>
                    <TouchableOpacity 
                        onPress={()=>navigation.navigate('Add Preference 1')}   //navigate back to previous page
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
                    <Text style={styles.title}>New Preference</Text>
            </View>

            <ScrollView>
                <View style={styles.scrollContainer}>
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
                    {/* title input field */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.sectionText}>Title:</Text>
                        <View style={styles.inputContainers}>
                            <TextInput
                                placeholder="Title"
                                placeholderTextColor="#7C808D"
                                color={Colors.ghost}
                                onChangeText={setName}
                                value={name}
                                editable={true}/>
                        </View>
                    </View>

                    {/* distance checkbox section */}
                    <View style={styles.checkboxContainer}>
                        <Text style={styles.sectionTitle}>
                            Distance:
                        </Text>
                            <CheckBox
                                style={styles.checkbox}
                                isChecked={isChecked.ten} 
                                onClick={()=>setIsChecked({...isChecked, ten: !isChecked.ten})}
                                rightText='Within 10 miles'
                                rightTextStyle={styles.checkboxText}
                                uncheckedCheckBoxColor={Colors.ghost}
                                checkedCheckBoxColor={Colors.gold}/>
                            <CheckBox 
                                style={styles.checkbox}
                                isChecked={isChecked.fifteen} 
                                onClick={()=>setIsChecked({...isChecked, fifteen: !isChecked.fifteen})}
                                rightText='Within 15 miles'
                                rightTextStyle={styles.checkboxText}
                                uncheckedCheckBoxColor={Colors.ghost}
                                checkedCheckBoxColor={Colors.gold}/>

                            <CheckBox 
                                style={styles.checkbox}
                                isChecked={isChecked.twenty} 
                                onClick={()=>setIsChecked({...isChecked, twenty: !isChecked.twenty})}
                                rightText='Within 20 miles'
                                rightTextStyle={styles.checkboxText}
                                uncheckedCheckBoxColor={Colors.ghost}
                                checkedCheckBoxColor={Colors.gold}/>
                    </View>

                    {/* budget checkbox section */}
                    <View style={styles.checkboxContainer}>
                        <Text style={styles.sectionTitle}>
                            Budget:
                        </Text>
                            <CheckBox
                                style={styles.checkbox}
                                isChecked={isChecked.$20} 
                                onClick={()=>setIsChecked({...isChecked, $20: !isChecked.$20})}
                                rightText='$20'
                                rightTextStyle={styles.checkboxText}
                                uncheckedCheckBoxColor={Colors.ghost}
                                checkedCheckBoxColor={Colors.gold}/>
                            <CheckBox 
                                style={styles.checkbox}
                                isChecked={isChecked.$50} 
                                onClick={()=>setIsChecked({...isChecked, $50: !isChecked.$50})}
                                rightText='$50'
                                rightTextStyle={styles.checkboxText}
                                uncheckedCheckBoxColor={Colors.ghost}
                                checkedCheckBoxColor={Colors.gold}/>
                    </View>
                    
                    {/* add preference button */}
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>Add Preference</Text>
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
        fontWeight: 600, 
        fontSize: 22, 
        color: Colors.ghost
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
    titleContainer: {
        flexDirection: "column",
        marginBottom: 10
    },
    scrollContainer: {
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20
    },
    sectionText: {
        fontSize: 22,
        fontWeight: "bold",
        marginLeft: 15,
        marginBottom: 10,
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
    checkboxContainer: {
        paddingLeft: 22,
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 22, 
        fontWeight: "bold", 
        color: Colors.ghost, 
        marginBottom: 15,
    },
    checkbox: {
        flex: 1,
        marginRight: 20,
        marginBottom: 16,
    },
    checkboxText: {
        fontSize: 19, 
        color: Colors.ghost,
    },
    addButton: {
        backgroundColor: Colors.gold,
        marginLeft: 60,
        marginTop: 20,
        marginBottom: 35,
        height: 50,
        width: "67%",
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    },
    addText: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.raisin
    }
});