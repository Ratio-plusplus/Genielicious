import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Colors } from './Colors';

const tasteProfile = {
    title: 'Spicy Savory',
    taste: 'Spicy, Savory, Salty',
    allergies: 'None',
    distance: 'Within 10 miles',
    budget: '$20',
    image: require("../assets/pfp.png"),
};

export default function Preference({ navigation }) {
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
                justifyContent: "center"
            }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
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
                <Text style={{ marginTop: 2, fontWeight: 600, fontSize: 22, color: Colors.ghost }}>{tasteProfile.title}</Text>
            </View>

            <ScrollView>
                <View style={{ alignItems: "center", marginTop: 10, marginBottom: 20 }}>
                    <Image
                        source={tasteProfile.image}
                        style={styles.image}
                    />
                </View>

                <View style={styles.boxSection}>
                    <Text style={styles.sectionText}>Taste Profile:</Text>
                    <View style={styles.boxContainer}>
                        <Text style={styles.boxText}>{tasteProfile.taste}</Text>
                    </View>
                </View>

                <View style={styles.boxSection}>
                    <Text style={styles.sectionText}>Dietary Restriction/Allergies:</Text>
                    <View style={styles.boxContainer}>
                        <Text style={styles.boxText}>{tasteProfile.allergies}</Text>
                    </View>
                </View>

                <View style={styles.boxSection}>
                    <Text style={styles.sectionText}>Distance:</Text>
                    <View style={styles.boxContainer}>
                        <Text style={styles.boxText}>{tasteProfile.distance}</Text>
                    </View>
                </View>

                <View style={styles.boxSection}>
                    <Text style={styles.sectionText}>Budget:</Text>
                    <View style={styles.boxContainer}>
                        <Text style={styles.boxText}>{tasteProfile.budget}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.editButton}>
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
    boxSection: {
        marginBottom: 10,
        height: '21%'
    },
    boxContainer: {
        flex: 1,
        width: "89%",
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
        flex: 0.4,
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
        justifyContent: "center"
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
