import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Colors } from './Colors';

export default function Preference({ navigation, route }) {
    const { profileData } = route.params;

    const [tasteProfile, setTasteProfile] = useState({
        title: profileData?.title || '',
        tastePreferences: profileData?.tastePreferences || {},
        allergies: profileData?.allergies || {},
        distance: profileData?.distance || '',
        budget: profileData?.budget || '',
        image: profileData?.photoURL || require("../assets/pfp.png"),
    });

    const getTrueKeysAsString = (obj) => {
        return Object.keys(obj)
            .filter(key => obj[key])
            .join(', ');
    };

    const tastePreferencesString = getTrueKeysAsString(tasteProfile.tastePreferences);
    const allergiesString = getTrueKeysAsString(tasteProfile.allergies);

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
                            <Text style={styles.boxText}>{tasteProfile.distance}</Text>
                        </View>
                    </View>

                    <View style={[styles.boxSection, styles.absoluteBox, { top: 360 }]}>
                        <Text style={styles.sectionText}>Budget:</Text>
                        <View style={styles.boxContainer}>
                            <Text style={styles.boxText}>{tasteProfile.budget || 'Not specified'}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.editButton}
                    onPress={() => navigation.navigate('Add Preference 1', { profileData: {...tasteProfile, id: profileData.id} })}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.activeButton}>
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
