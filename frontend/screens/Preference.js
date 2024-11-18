import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useContext } from 'react';
import { Colors } from './Colors';
import { auth } from '../firebase/firebase';
import { FlavorPreferencesContext } from '../contexts/FlavorPreferencesContext';
import { useAuth } from '../contexts/AuthContext';

export default function Preference({ navigation, route }) {
    const { currentUser, loading } = useAuth(); // Access currentUser and loading
    const { profileData } = route.params;
    const { setActiveProfile } = useContext(FlavorPreferencesContext);

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

    const handleDeleteProfile = () => {
        Alert.alert(
            "Delete Profile",
            "Are you sure you want to delete this flavor profile?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const idToken = await currentUser.getIdToken();
                            console.log(profileData.id);
                            const response = await fetch('http://10.0.2.2:5000/database/delete_flavor_profile', {
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
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleSetActiveProfile = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            const response = await fetch('http://10.0.2.2:5000/database/set_active_profile', {
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
                <Text style={{ marginTop: 2, fontWeight: '600', fontSize: 22, color: Colors.ghost }}>{tasteProfile.title}</Text>
                <TouchableOpacity
                    onPress={handleDeleteProfile}
                    style={{ position: "absolute", right: 0 }}>
                    <MaterialIcons
                        name="delete"
                        size={28}
                        color={Colors.ghost}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
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
            </ScrollView>

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
        fontSize: 20,
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
        fontSize: 20,
        color: "#B3B3B3"
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 20,
    },
    editButton: {
        backgroundColor: Colors.ghost,
        width: "40%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.raisin,
        alignItems: "center",
        justifyContent: "center",
        height: 90
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
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.raisin
    }
});
