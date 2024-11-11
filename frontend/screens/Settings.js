import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from './Colors';
import { doSignOut, deleteAccount } from '../firebase/auth';

export default function Settings({ navigation }) {
    const [modalVisible, setModalVisible] = React.useState(false)
    const [modalMessage, setModalMessage] = React.useState("")

    const accountItems = [
        { icon: "person-outline", text: "Edit Account", action: () => navigation.navigate('Edit Profile') },
        //Change icon to better fit the screeen
        { icon: "location-pin", text: "Device Permissions", action: () => navigation.navigate('DevicePermissions') },
    ];

    const historyItems = [
        {
            icon: "delete-outline", text: "Clear History", action: () => {
                setModalMessage("Are you sure you want to clear your history?")
                setModalVisible(true);
            }
        }
    ];

    const actionsItems = [
        {
            icon: "outlined-flag", text: "Report a Problem", action: () => {
                navigation.navigate('Report a Problem')
                console.log("Report")
            }
        },
        {
            icon: "logout", text: "Logout", action: () => {
                setModalMessage("Are you sure you want to log out?")
                setModalVisible(true)
            }
        },
        {
            icon: "backspace", text: "Delete Account", action: () => {
                setModalMessage("Are you sure you want to delete your account?")
                setModalVisible(true)
            }
        }
    ];

    //render each setting item with the corresponding icon, text, and action 
    const renderSettingItem = ({ icon, text, action }) => (
        <TouchableOpacity
            onPress={action}    //this action occurs when the setting item is pressed
            style={styles.settingItems}>
            <MaterialIcons name={icon} size={28} color={Colors.raisin} />
            <Text style={styles.settingText}>{text}</Text>
        </TouchableOpacity>
    )

    const handleAction = async () => {
        if (modalMessage === "Are you sure you want to clear your history?") {
            console.log("History Cleared")
        }
        else if (modalMessage === "Are you sure you want to delete your account?") {
            try {
                response = await deleteAccount();
                navigation.navigate('Login');
                console.log("Account Deleted")
            } catch (error) {
                console.error("Failed to log out", error)
            }
        }
        else if (modalMessage === "Are you sure you want to log out?") {
            try {
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
                    onPress={() => navigation.navigate('Profile')}    //navigate back to profile page if back arrow is pressed
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

            <ScrollView style={{ marginHorizontal: 15 }}>
                {/* account setting section */}
                <View style={styles.sectionContainer}>
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
                <View style={styles.sectionContainer}>
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
                <View style={styles.sectionContainer}>
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
                transparent={true}
                animationType='fade'
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >

                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>{modalMessage}</Text>
                            <View style={styles.buttonContainer}>
                                {/* Yes Button */}
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: Colors.gold }]}
                                    onPress={handleAction}>
                                    <Text style={[styles.buttonText, { color: Colors.raisin }]}>Yes</Text>
                                </TouchableOpacity>
                                {/* No Button */}
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: Colors.ghost }]}
                                    onPress={() => setModalVisible(false)}>
                                    <Text style={[styles.buttonText, { color: Colors.raisin }]}>No</Text>
                                </TouchableOpacity>
                            </View>
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
        paddingVertical: 13,
        paddingLeft: 12,
    },
    settingText: {
        marginLeft: 36,
        fontWeight: '600',
        fontSize: 18
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
    sectionContainer: { 
        marginBottom: 12, 
        marginHorizontal: 8 
    },
    sectionTitle: {
        marginTop: 20,
        marginVertical: 10,
        fontWeight: "bold",
        fontSize: 20,
        color: Colors.ghost
    },
    sectionBox: {
        borderRadius: 12,
        backgroundColor: Colors.champagne
    },
    modalContainer: {
        width: '80%',
        height: '20%',
        backgroundColor: Colors.blue,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.ghost,
        padding: 20,
        marginHorizontal: 0,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalText: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 20,
        color: Colors.ghost,
        alignItems: 'center',
        textAlign: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '90%',
        height: '38%',
        marginTop: 1
    },
    modalButton: {
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: Colors.raisin,
        fontWeight: '600',
        fontSize: 22
    },
    clearButton: {
        color: Colors.ghost, // Change clear button color to red
    },
})