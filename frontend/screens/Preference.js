import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert, Modal, Dimensions, PixelRatio } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useContext } from 'react';
import { Colors } from './Colors';
import { auth } from '../firebase/firebase';
import { FlavorPreferencesContext } from '../contexts/FlavorPreferencesContext';
import { useAuth } from '../contexts/AuthContext';

const getFontSize = (size) => {
    const { width } = Dimensions.get('window');
    const guidelineBaseWidth = 375;     // base width for most devices
    const scale = width / guidelineBaseWidth;
    return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

export default function Preference({ navigation, route }) {
    const { currentUser, loading } = useAuth(); // Access currentUser and loading
    const { profileData } = route.params;
    const { setActiveProfile } = useContext(FlavorPreferencesContext);
    const [modalVisible, setModalVisible] = useState(false);

    const [tasteProfile, setTasteProfile] = useState({
        title: profileData?.title || '',
        tastePreferences: profileData?.tastePreferences || {},
        allergies: profileData?.allergies || {},
        distance: profileData?.distance || '',
        budget: profileData?.budget || '',
        image: profileData?.photoURL || require("../assets/pfp.png"),
    });

    const budgetLabels = {
        1: "$10 or less",
        2: "$30 or less",
        3: "$60 or less",
        4: "More than $60"
    };

    const distanceLabels = {
        16093: "Within 10 mile",
        24140: "Within 15 miles",
        32187: "Within 20 miles",
        40000: "Within 25 miles"
    };

    const getTrueKeysAsString = (obj) => {
        return Object.keys(obj)
            .filter(key => obj[key])
            .join(', ');
    };

    const tastePreferencesString = getTrueKeysAsString(tasteProfile.tastePreferences);
    const allergiesString = getTrueKeysAsString(tasteProfile.allergies);

    const handleDeleteProfile = async () => {
        try {
            const idToken = await currentUser.getIdToken();
            console.log(profileData.id);
            const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/delete_flavor_profile', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ profileId: profileData.id })
            });

            console.log("Response Status:", response.status);
            const responseText = await response.text();
            console.log("Response Text:", responseText);

            if (response.ok) {
                navigation.navigate('Profile');
            } else {
                console.error("Error deleting profile: ", responseText);
            }
        } catch (error) {
            console.error("Error deleting profile: ", error);
        }
    };

    const handleConfirmYes = () => {
        setModalVisible(false);  // close the modal
        handleDeleteProfile();
        navigation.navigate('Tab');  // navigate back to the Home page
    };

    const handleConfirmNo = () => {
        setModalVisible(false);  // close the modal without navigating
    };

    const handleSetActiveProfile = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/set_active_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ profileId: profileData.id })
            });

            if (response.ok) {
                console.log("Profile set as active successfully.");
                setActiveProfile(profileData.id);
                navigation.navigate('Profile');
            } else {
                const errorText = await response.text();
                console.error("Error setting active profile: ", errorText);
            }
        } catch (error) {
            console.error("Error setting active profile: ", error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.blue }}>
            <View style={{ marginHorizontal: 12, marginTop: 12, marginBottom: 12, flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                    style={{ position: "absolute", left: 0 }}>
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={33}
                        color={Colors.ghost}
                    />
                </TouchableOpacity>
                <Text style={{ marginTop: 2, fontWeight: '600', fontSize: getFontSize(22), color: Colors.ghost }}>{tasteProfile.title}</Text>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{ position: "absolute", right: 0 }}>
                    <MaterialIcons
                        name="delete"
                        size={28}
                        color={Colors.ghost}
                    />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Are you sure you want to delete this taste profile?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalYesButton} onPress={handleConfirmYes}>
                                <Text style={styles.modalButtonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalNoButton} onPress={handleConfirmNo}>
                                <Text style={styles.modalButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* <ScrollView contentContainerStyle={{ paddingBottom: 20 }}> */}
                <View style={{ alignItems: "center", marginTop: 10, marginBottom: 20 }}>
                    <Image
                        source={{ uri: tasteProfile.image }}
                        style={styles.image}
                    />
                </View>

                <View style={styles.relativeContainer}>
                    <View style={[styles.boxSection, styles.absoluteBox, { top: 0 }]}>
                        <Text style={styles.sectionText}>Taste Preferences:</Text>
                        <View style={styles.boxContainer}>
                            <Text style={styles.boxText}>{tastePreferencesString || 'None'}</Text>
                        </View>
                    </View>

                    <View style={[styles.boxSection, styles.absoluteBox, { top: 120 }]}>
                        <Text style={styles.sectionText}>Dietary Restrictions/Allergies:</Text>
                        <View style={styles.boxContainer}>
                            <Text style={styles.boxText}>{allergiesString || 'None'}</Text>
                        </View>
                    </View>

                    <View style={[styles.boxSection, styles.absoluteBox, { top: 240 }]}>
                        <Text style={styles.sectionText}>Distance:</Text>
                        <View style={styles.boxContainer}>
                            <Text style={styles.boxText}>
                                {tasteProfile.distance ? distanceLabels[tasteProfile.distance] : 'Not specified'}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.boxSection, styles.absoluteBox, { top: 360 }]}>
                        <Text style={styles.sectionText}>Budget:</Text>
                        <View style={styles.boxContainer}>
                            <Text style={styles.boxText}>
                                {tasteProfile.budget ? budgetLabels[tasteProfile.budget] : 'Not specified'}
                            </Text>
                        </View>
                    </View>
                </View>
            {/* </ScrollView> */}

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.editButton}
                    onPress={() => navigation.navigate('Add Preference 1', { profileData: {...tasteProfile, id: profileData.id} })}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.activeButton} onPress={handleSetActiveProfile}>
                    <Text style={styles.buttonText}>Set Active</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    image: {
        height: 130,
        width: 130,
        borderRadius: 85,
        borderWidth: 2,
        borderColor: "#000"
    },
    sectionText: {
        fontSize: getFontSize(20),
        fontWeight: "bold",
        marginTop: 5,
        marginLeft: 20,
        color: Colors.ghost
    },
    relativeContainer: {
        position: 'relative',
        height: 500, // Increased height to accommodate larger boxes
    },
    boxSection: {
        marginBottom: 20, // Increased margin for better spacing
    },
    absoluteBox: {
        position: 'absolute',
        width: '100%',
    },
    boxContainer: {
        flex: 1,
        width: "90%", // Slightly increased width
        height: 60, // Increased height for larger boxes
        flexDirection: "column",
        borderWidth: 1,
        borderColor: Colors.ghost,
        borderRadius: 10,
        marginVertical: 10,
        marginLeft: 20,
        paddingLeft: 20,
        justifyContent: "center",
        backgroundColor: Colors.blue
    },
    boxText: {
        fontSize: getFontSize(20),
        color: "#B3B3B3"
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        height: '8%',
        marginTop: -15
    },
    editButton: {
        backgroundColor: Colors.ghost,
        width: "40%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.raisin,
        alignItems: "center",
        justifyContent: "center",
    },
    activeButton: {
        backgroundColor: Colors.gold,
        width: "40%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.raisin,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        fontSize: getFontSize(20),
        fontWeight: "bold",
        color: Colors.raisin
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  
    },
    modalContainer: {
        width: '80%',
        height: '20%',
        backgroundColor: Colors.blue,
        borderRadius: 10,
        borderWidth: 2,
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
    modalText: {
        fontSize: getFontSize(22),
        fontWeight: '600',
        marginBottom: 20,
        color: Colors.ghost,
        alignItems: 'center',
        textAlign: 'center'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        height: '35%'
    },
    modalYesButton: {
        padding: 10,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
        backgroundColor: Colors.gold
    },
    modalNoButton: {
        padding: 10,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
        backgroundColor: Colors.ghost
    },
    modalButtonText: {
        color: Colors.raisin,
        fontWeight: '600',
        fontSize: getFontSize(19)
    },
});
