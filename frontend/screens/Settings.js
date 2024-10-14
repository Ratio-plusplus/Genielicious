import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Button, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from './Colors';
import { doSignOut } from '../../backend/firebase/auth';

export default function Settings({ navigation }) {
    const [modalVisible, setModalVisible] = React.useState(false)
    const [modalMessage, setModalMessage] = React.useState("")

    const accountItems = [
        {icon: "person-outline", text: "Edit Profile", action: () => navigation.navigate('Edit Profile')},
        {icon: "location-pin", text: "Location Services", action: () => navigation.navigate('Home')},
    ];

    const historyItems = [
        {icon: "delete-outline", text: "Clear History", action: () =>{
            setModalMessage("Are you sure you want to clear your history?")
            setModalVisible(true);
        }}
    ];

    const actionsItems = [
        {icon: "outlined-flag", text: "Report a Problem", action: console.log("Report")},
        {icon: "logout", text: "Logout", action: () => {
            setModalMessage("Are you sure you want to log out?")
            setModalVisible(true)
        }},
        {icon: "backspace", text: "Delete Account", action: () => {
            setModalMessage("Are you sure you want to delete your account?")
            setModalVisible(true)
        }}
    ];

    //render each setting item with the corresponding icon, text, and action 
    const renderSettingItem = ({ icon, text, action }) => (
        <TouchableOpacity
            onPress={action}    //this action occurs when the setting item is pressed
            style={styles.settingItems}>
            <MaterialIcons name={icon} size={24} color={Colors.raisin}/>
            <Text style={styles.settingText}>{text}</Text>
        </TouchableOpacity>
    )

    const handleAction = async () => {
        if (modalMessage === "Are you sure you want to clear your history?"){
            console.log("History Cleared")
        }
        else if (modalMessage === "Are you sure you want to delete your account?"){
            console.log("Account Deleted")
        }
        else if (modalMessage === "Are you sure you want to log out?"){
            try{
                await doSignOut();
                navigation.navigate('Login');
                console.log("Logged Out")
            } catch (error) {
                console.error("Failed to log out", error)
            }
        }
        setModalVisible(false)
    }

    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.container}>
                    <TouchableOpacity 
                        onPress={()=>navigation.navigate('Profile')}    //navigate back to profile page if back arrow is pressed
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
                    <Text style={styles.title}>Settings</Text>
            </View>

            <ScrollView style={{marginHorizontal: 15}}>
                {/* account setting section */}
                <View style={{marginBottom: 12}}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.sectionBox}>
                        {
                            accountItems.map((item, index) => (
                                //render each account setting item
                                <React.Fragment key={index}> 
                                    {renderSettingItem(item)}
                                </React.Fragment>
                            ))
                        }
                    </View>
                </View>

                {/* user data setting section */}
                <View style={{marginBottom: 12}}>
                    <Text style={styles.sectionTitle}>User Data</Text>
                    <View style={styles.sectionBox}>
                        {
                            historyItems.map((item, index) => (
                                //render each user data setting item
                                <React.Fragment key={index}>
                                    {renderSettingItem(item)}
                                </React.Fragment>
                            ))
                        }
                    </View>
                </View>

                {/* actions setting section */}
                <View style={{marginBottom: 12}}>
                    <Text style={styles.sectionTitle}>Actions</Text>
                    <View style={styles.sectionBox}>
                        {
                            actionsItems.map((item, index) => (
                                //render each action setting item
                                <React.Fragment key={index}>
                                    {renderSettingItem(item)}
                                </React.Fragment>
                            ))
                        }
                    </View>
                </View>
            </ScrollView>

            {/* Modal for clear history confirmation */}
            <Modal
                transparent = {true}
                animationType ='fade'
                visible = {modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >

            <View style = {styles.modalOverlay}></View>
            
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>{modalMessage}</Text>
                    <View style={styles.buttonContainer}>
                        {/* No Button */}
                <Pressable
                    style={[styles.modalButton, { backgroundColor: '#ED9A1C' }]} 
                    onPress={() => setModalVisible(false)}>
                    <Text style={[styles.buttonText, { color: '#000' }]}>No</Text>
                </Pressable>

                {/* Yes Button */}
                <Pressable
                    style={[styles.modalButton, { backgroundColor: '#EBEEFA' }]} 
                    onPress={handleAction}>
                    <Text style={[styles.buttonText, { color: '#000' }]}>Yes</Text>
                </Pressable>
            </View>
        </View>
    </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    settingItems: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingLeft: 12,
    },
    settingText: {
        marginLeft: 36,
        fontWeight: 600,
        fontSize: 16
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
    title: {
        marginTop: 2, 
        fontWeight: "bold", 
        fontSize: 22, 
        color: Colors.ghost
    },
    sectionTitle: {
        marginTop: 20, 
        marginVertical: 10, 
        fontWeight: "bold", 
        fontSize: 18, 
        color: Colors.ghost
    },
    sectionBox: {
        borderRadius: 12,
        backgroundColor: Colors.champagne
    },
    modalContainer: {
        backgroundColor: Colors.blue,
        borderRadius: 15,
        padding: 45,
        width: '80%', // Ensure it has proper width
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -0.4 * 450 }, { translateY: -0.4 * 450 }], // Center the modal perfectly on the screen
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black for dim effect
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: Colors.ghost // Font color using project's color
    },
    modalText: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: "center",
        color: Colors.ghost // Font color using project's color
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: '100%', // Use full width of modal
        marginTop: 10,
    },
    modalButton:{
        paddingVertical: 3,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.black, // Use project's font color
        fontSize: 25,
        padding: 10,
        flex: 1, // Flex to take space
        textAlign: "center", // Center text
        marginHorizontal: 5 // Space between buttons
    },
    clearButton: {
        color: Colors.ghost, // Change clear button color to red
    },
})