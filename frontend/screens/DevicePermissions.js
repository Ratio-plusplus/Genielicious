import React, {useState} from 'react';
import {Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import { Colors } from './Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function DevicePermissions ({ navigation }) {
    {/* lists all permissions */}
    return(
        <SafeAreaView style={styles.background}>
            {/* Back button and title screen */}
            <View style={styles.container}>
                    <TouchableOpacity 
                        onPress={()=>navigation.navigate('Settings')}    //navigate back to profile page if back arrow is pressed
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
                    <Text style={styles.title}>Device Permissions</Text>
                    
            </View>

            <View>
                <Text style={styles.sectionText}>Location Permissions</Text>
                    <Text>If you choose to allow location access:

                        We may receive information about your precise location through things like: Your GPS location, bluetooth, and Wi-Fi connections. We will receive your location information from Location Services. Without this service, our Genie's accuracy will significantly lower.
                    </Text>
            </View>

            <View>
            <Text style={styles.sectionText}>Camera Permissions</Text>
                <Text>If you choose to allow camera access:

                    Genielicious is allowed to access this device's camera. This allows us to use your images should you want to change your profile picture or flavor Profiles. 
                </Text>
            </View>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    sectionText: {
        fontSize: 22,
        fontWeight: "bold",
        marginLeft: 15,
        marginBottom: 5,
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
    descContainers: {
        height: 300,
        width: "92%",
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 4,
        marginVertical: 6,
        marginLeft: 15,
        alignItems: "center",
        paddingLeft: 8
    },
    background: {
        flex: 1, 
        backgroundColor: Colors.blue
    },
    container: {
        marginHorizontal: 12,
        marginTop: 12,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "center"
    },
    arrow: {
        position: "absolute",
        left: 0
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.ghost,
        marginTop: 2,
    },
    saveButton: {
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
    saveText: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.raisin
    },
    sectionTitle: {
        fontSize: 22, 
        fontWeight: "bold", 
        color: Colors.ghost, 
        marginBottom: 20,
    },
    selectContainer: {
        paddingLeft: 22,
        paddingTop: 10,
    },
    checkbox: {
        // flex: 1,
        marginRight: 10,
    },
    checkboxText: {
        fontSize: 19, 
        color: Colors.ghost,
    },
    radioButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    circle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.ghost,
        marginRight: 12,
    },
    selectedCircle: {
        backgroundColor: Colors.gold,
    },
    radioLabel: {
        fontSize: 19,
        color: Colors.ghost,
    }
});