import React from 'react';
import { Text, StyleSheet, Switch, View, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Colors } from './Colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function DevicePermissions({ navigation }) {

    const askCameraPermissions = () => {
        
    };



    return (
        <>
        <StatusBar/>
        <SafeAreaView style={styles.background}>
            {/* Back button and title screen */}
            <View style={styles.container}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Settings')}
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

            <ScrollView style={styles.contentContainer}>
                {/* location permissions section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Location Permissions</Text>
                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={1}
                        value={1}
                        />
                    <Text style={styles.descText}>
                        If you choose to allow location access, we may receive information about your precise location through things like:
                    </Text>
                    <Text style={styles.bulletText}>
                        • GPS Location
                    </Text>
                    <Text style={styles.bulletText}>
                        • Bluetooth
                    </Text>
                    <Text style={styles.bulletText}>
                        • Wi-Fi Connections
                    </Text>
                    <Text style={styles.descText}>
                        We will receive your location information through Location Services. If you choose not to allow location access, our Genie's accuracy will be limited.
                    </Text>
                </View>

                {/* camera permissions section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>
                        Camera Permissions
                    </Text>
                    <Text style={styles.descText}>
                        If you choose to allow camera access, Genielicious can access this device's camera. This allows us to use your images for account and Flavor Profile customization.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.blue,
    },
    container: {
        marginHorizontal: 12,
        marginTop: '8%',
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "center"
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.ghost,
    },
    contentContainer: {
        padding: 20,
    },
    sectionContainer: {
        backgroundColor: Colors.ghost,
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: Colors.gold,
        shadowColor: Colors.yellow, // Subtle shadow for depth
        shadowOffset: { width: 7, height: 7 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: Colors.darkGold,
        marginBottom: 5,
    },
    descText: {
        fontSize: 16,
        color: Colors.raisin,
        marginVertical: 10,
    },
    bulletText: {
        fontSize: 16,
        color: Colors.gold,
        marginLeft: 10,
        marginVertical: 5,
        fontWeight: '600'
    },
});
