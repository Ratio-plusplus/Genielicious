import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions, PixelRatio } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from './Colors';
import { doSignOut, deleteAccount, deleteUserHistory } from '../firebase/auth';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375; 
const guidelineBaseHeight = 667; 

// Utility Functions for Responsiveness
const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
const getFontSize = (size) => Math.round(PixelRatio.roundToNearestPixel(scale(size)));

export default function Settings({ navigation }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalMessage, setModalMessage] = React.useState("");
    const { currentUser } = useAuth();

    const accountItems = [
        { icon: "person-outline", text: "Edit Account", action: () => navigation.navigate('Edit Profile') },
        { icon: "location-pin", text: "Device Permissions", action: () => navigation.navigate('DevicePermissions') },
    ];

    const historyItems = [
        { icon: "delete-outline", text: "Clear History", action: () => {
            setModalMessage("Are you sure you want to clear your history?");
            setModalVisible(true);
        }}
    ];

    const actionsItems = [
        { icon: "outlined-flag", text: "Report a Problem", action: () => {
            navigation.navigate('Report a Problem');
            console.log("Report");
        }},
        { icon: "logout", text: "Logout", action: () => {
            setModalMessage("Are you sure you want to log out?");
            setModalVisible(true);
        }},
        { icon: "backspace", text: "Delete Account", action: () => {
            setModalMessage("Are you sure you want to delete your account?");
            setModalVisible(true);
        }}
    ];

    const renderSettingItem = ({ icon, text, action }) => (
        <TouchableOpacity onPress={action} style={styles.settingItems}>
            <MaterialIcons name={icon} size={28} color={Colors.raisin} />
            <Text style={styles.settingText}>{text}</Text>
        </TouchableOpacity>
    );

    const handleAction = async () => {
        if (modalMessage === "Are you sure you want to clear your history?") {
            try {
                response = await deleteUserHistory();
                navigation.navigate('Profile');
                console.log("History Deleted");
            } catch (error) {
                console.log("Failed to delete history", error);
            }
        }
        else if (modalMessage === "Are you sure you want to delete your account?") {
            try {
                response = await deleteAccount();
                navigation.navigate('Login');
                console.log("Account Deleted");
            } catch (error) {
                console.error("Failed to delete account", error);
            }
        }
        else if (modalMessage === "Are you sure you want to log out?") {
            try {
                await doSignOut();
                navigation.navigate('Login');
                console.log("Logged Out");
            } catch (error) {
                console.error("Failed to log out", error);
            }
        }
        setModalVisible(false);
    };

    // Function to save the updated history
    const saveHistory = async (currentUser, restaurants) => {
        const idToken = await currentUser.getIdToken();
        const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/update_history', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ "restaurantsInfo": JSON.stringify(restaurants) })
        });
        const json = await response.json();
        console.log(json);
    };

    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.backButton}>
                    <MaterialIcons name="keyboard-arrow-left" size={33} color={Colors.ghost} />
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Account Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.sectionBox}>
                        {accountItems.map((item, index) => (
                            <React.Fragment key={index}>{renderSettingItem(item)}</React.Fragment>
                        ))}
                    </View>
                </View>

                {/* User Data Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>User Data</Text>
                    <View style={styles.sectionBox}>
                        {historyItems.map((item, index) => (
                            <React.Fragment key={index}>{renderSettingItem(item)}</React.Fragment>
                        ))}
                    </View>
                </View>

                {/* Actions Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Actions</Text>
                    <View style={styles.sectionBox}>
                        {actionsItems.map((item, index) => (
                            <React.Fragment key={index}>{renderSettingItem(item)}</React.Fragment>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Modal for Clear History */}
            <Modal transparent={true} animationType='fade' visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>{modalMessage}</Text>
                            <View style={styles.buttonContainer}>
                                {/* Yes Button */}
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: Colors.gold }]} onPress={handleAction}>
                                    <Text style={[styles.buttonText, { color: Colors.raisin }]}>Yes</Text>
                                </TouchableOpacity>
                                {/* No Button */}
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: Colors.ghost }]} onPress={() => setModalVisible(false)}>
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
        paddingVertical: verticalScale(13),
        paddingLeft: scale(12),
    },
    settingText: {
        marginLeft: scale(36),
        fontWeight: '600',
        fontSize: getFontSize(18),
    },
    background: {
        flex: 1,
        backgroundColor: Colors.blue,
    },
    container: {
        marginHorizontal: scale(12),
        marginTop: verticalScale(12),
        marginBottom: verticalScale(12),
        flexDirection: "row",
        justifyContent: "center",
    },
    backButton: {
        position: "absolute",
        left: 0,
    },
    title: {
        marginTop: verticalScale(2),
        fontWeight: "bold",
        fontSize: getFontSize(22),
        color: Colors.ghost,
    },
    scrollView: {
        marginHorizontal: scale(15),
    },
    sectionContainer: { 
        marginBottom: verticalScale(12), 
        marginHorizontal: scale(8), 
    },
    sectionTitle: {
        marginTop: verticalScale(20),
        marginVertical: verticalScale(10),
        fontWeight: "bold",
        fontSize: getFontSize(20),
        color: Colors.ghost,
    },
    sectionBox: {
        borderRadius: scale(12),
        backgroundColor: Colors.champagne,
    },
    modalContainer: {
        width: width * 0.80,
        height: height * 0.24,
        backgroundColor: Colors.blue,
        borderRadius: scale(10),
        borderWidth: scale(2),
        borderColor: Colors.ghost,
        padding: scale(20),
        marginVertical: verticalScale(10),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(2) },
        shadowOpacity: 0.25,
        shadowRadius: scale(4),
        elevation: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  
    },
    modalText: {
        fontSize: getFontSize(20),
        fontWeight: '600',
        marginBottom: verticalScale(20),
        color: Colors.ghost,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '90%',
        marginTop: verticalScale(1),
    },
    modalButton: {
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(10),
    },
    buttonText: {
        color: Colors.raisin,
        fontWeight: '600',
        fontSize: getFontSize(22),
    },
    clearButton: {
        color: Colors.ghost, // Change clear button color to red
    },
});
