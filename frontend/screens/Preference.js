import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert, Modal, Dimensions, PixelRatio } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useContext } from 'react';
import { Colors } from './Colors';
import { auth } from '../firebase/firebase';
import { FlavorPreferencesContext } from '../contexts/FlavorPreferencesContext';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375; 
const guidelineBaseHeight = 667; 

// Utility Functions for Responsiveness
const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
const getFontSize = (size) => Math.round(PixelRatio.roundToNearestPixel(scale(size)));

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
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Profile')} 
                    style={styles.headerIcon}>
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={scale(33)}
                        color={Colors.ghost}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}>{tasteProfile.title}</Text>
                <TouchableOpacity 
                    onPress={() => setModalVisible(true)} 
                    style={styles.headerIcon}>
                    <MaterialIcons 
                        name="delete" 
                        size={scale(28)} 
                        color={Colors.ghost} />
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

            {/* <ScrollView contentContainerStyle={styles.scrollView}> */}
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: tasteProfile.image }} 
                    style={styles.image} />
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Taste Preferences:</Text>
                <Text style={styles.infoText}>{tastePreferencesString || 'None'}</Text>

                <Text style={styles.infoTitle}>Dietary Restrictions/Allergies:</Text>
                <Text style={styles.infoText}>{allergiesString || 'None'}</Text>

                <Text style={styles.infoTitle}>Distance:</Text>
                <Text style={styles.infoText}>
                    {tasteProfile.distance ? distanceLabels[tasteProfile.distance] : 'Not specified'}
                </Text>

                <Text style={styles.infoTitle}>Budget:</Text>
                <Text style={styles.infoText}>
                    {tasteProfile.budget ? budgetLabels[tasteProfile.budget] : 'Not specified'}
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton}
                    onPress={() => navigation.navigate('Add Preference 1', { profileData: {...tasteProfile, id: profileData.id} })}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={handleSetActiveProfile}
                    style={styles.activeButton}>
                    <Text style={styles.buttonText}>Set Active</Text>
                </TouchableOpacity>
            </View>
            {/* </ScrollView> */}
        </SafeAreaView>
    );
}

// Styles
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: scale(12),
        marginVertical: verticalScale(12),
    },
    headerIcon: {
        padding: scale(5)
    },
    headerText: {
        fontSize: getFontSize(22),
        fontWeight: '600',
        color: Colors.ghost,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: verticalScale(10)
    },
    image: {
        width: moderateScale(120),
        height: moderateScale(120),
        borderRadius: moderateScale(60),
        borderWidth: 3,
        borderColor: Colors.raisin
    },
    infoContainer: {
        marginHorizontal: scale(20),
        marginBottom: verticalScale(20)
    },
    infoTitle: {
        fontSize: getFontSize(18),
        fontWeight: '600',
        marginVertical: verticalScale(5),
        color: Colors.ghost,
    },
    infoText: {
        fontSize: getFontSize(16),
        color: '#B3B3B3',
        marginBottom: verticalScale(10),
        borderWidth: 2,
        borderRadius: 10,
        borderColor: Colors.ghost,
        padding: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: scale(30),
        marginTop: verticalScale(-10)
    },
    editButton: {
        backgroundColor: Colors.ghost,
        borderRadius: 10,
        padding: verticalScale(10),
        flex: 1,
        marginRight: scale(10)
    },
    activeButton: {
        backgroundColor: Colors.gold,
        borderRadius: 10,
        padding: verticalScale(10),
        flex: 1,
        marginLeft: scale(10)
    },
    buttonText: {
        fontSize: getFontSize(18),
        textAlign: 'center',
        fontWeight: '600',
        color: Colors.raisin
    },
    modalOverlay: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)' 
    },
    modalContainer: { 
        width: width * 0.80,
        backgroundColor: Colors.blue,
        borderRadius: 10,
        borderWidth: 3,
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
    modalText: { 
        fontSize: getFontSize(20), 
        marginBottom: verticalScale(20), 
        textAlign: 'center', 
        color: Colors.ghost,
        fontWeight: '600'
    },
    modalButtons: { 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        width: '90%'
    },
    modalYesButton: { 
        flex: 1, 
        backgroundColor: Colors.gold, 
        borderRadius: 5, 
        padding: verticalScale(10), 
        marginHorizontal: 10,
    },
    modalNoButton: { 
        flex: 1, 
        backgroundColor: Colors.ghost, 
        borderRadius: 5, 
        padding: verticalScale(10), 
        marginHorizontal: 10,
    },
    modalButtonText: { 
        textAlign: 'center', 
        fontSize: getFontSize(19), 
        color: Colors.raisin,
        fontWeight: '600'
    },
});
