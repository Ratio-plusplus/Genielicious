import React, { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import { Text, StyleSheet, Switch, View, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Dimensions } from 'react-native';
=======
import { Text, Platform, StyleSheet, Switch, View, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
>>>>>>> Stashed changes
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Colors } from './Colors';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function DevicePermissions({ navigation }) {
        {/* Vars to keep track of permissions*/}
        const [cameraPermission, setCameraPermission] = useState(false);
        const [locationPermission, setLocationPermission] = useState(false);

        //checks device type perms to ask for 
        const CamPermsToCheck = Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
        const LocPermsToCheck = Platform.OS === "ios" ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        useEffect(() => {
          // Check permission state when the component mounts
          checkCameraPermission();
          checkLocationPermission();
        }, []);
      
        const checkCameraPermission = async () => {
          // Check camera permission for both devices
          const result = await check(CamPermsToCheck);
          setCameraPermission(result === RESULTS.GRANTED);
        };
      
        const requestCameraPermission = async () => {
          // Request camera permission for Android
          const result = await request(CamPermsToCheck);
          setCameraPermission(result === RESULTS.GRANTED);
        };
      
        const toggleCameraPermission = () => {
            if (cameraPermission) {
                setCameraPermission(false); // Simulate revocation
              } else {
                requestCameraPermission();
              }
        };

        const checkLocationPermission = async () => {
            const result = await check(LocPermsToCheck);
            setLocationPermission(result === RESULTS.GRANTED);
          };
        
          const requestLocationPermission = async () => {
            const result = await request(LocPermsToCheck);
            if (result === RESULTS.GRANTED) {
              setLocationPermission(true);
            } else if (result === RESULTS.BLOCKED) {
              Alert.alert(
                'Permission Blocked',
                'Location permission is blocked. Please enable it from app settings.',
                [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
              );
            }
          };
        
          const toggleLocationPermission = () => {
            if (locationPermission) {
              setLocationPermission(false); // Simulate revocation
            } else {
              requestLocationPermission();
            }
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
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.sectionTitle}>Location Permissions</Text>
                        <Switch
                            trackColor={{false: '#767577', true: '#81b0ff'}}
                            onValueChange={toggleLocationPermission}
                            value={locationPermission}
                        />
                    </View>
                    
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
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.sectionTitle}>
                            Camera Permissions
                        </Text>
                        <Switch
                            trackColor={{false: '#767577', true: '#81b0ff'}}
                            onValueChange={toggleCameraPermission}
                            value={cameraPermission}
                            />
                    </View>
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
        flexDirection: "row",
        justifyContent: "center"
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: Colors.ghost,
    },
    contentContainer: {
        padding: 20,
    },
    sectionContainer: {
        backgroundColor: Colors.ghost,
        borderRadius: 10,
        padding: 15,
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
        fontSize: width * 0.05,
        fontWeight: "bold",
        color: Colors.darkGold,
        marginBottom: 5,
    },
    descText: {
        fontSize: width * 0.04,
        color: Colors.raisin,
        marginVertical: 10,
    },
    bulletText: {
        fontSize: width * 0.04,
        color: Colors.gold,
        marginLeft: 10,
        marginVertical: 5,
        fontWeight: '600'
    },
});
