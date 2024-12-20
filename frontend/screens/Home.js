import * as React from 'react';
import { useState, useEffect, useCallback,useRef } from 'react';
import { Colors } from './Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal, ActivityIndicator, Animated, Dimensions} from "react-native";
import { FlavorPreferencesContext } from '../contexts/FlavorPreferencesContext';
import * as Location from "expo-location";
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext'
import { ProfileContext } from '../contexts/ProfileContext';

const { width, height } = Dimensions.get('window');

export default function Home({ navigation }) {
    const { currentUser } = useAuth(); // Access currentUser and loading
    const { setMode, flavorProfiles, activeProfileId, updateActiveProfileInFirebase } = React.useContext(FlavorPreferencesContext);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    const { setLocation, getUserLocation } = React.useContext(ProfileContext);


    const moveAnimation = useRef(new Animated.Value(0)).current; // For vertical movement
    const fadeAnimation = useRef(new Animated.Value(0)).current; // For fading

    useEffect(() => {
        // Map flavorProfiles to the format required by DropDownPicker
        const profileItems = [
            { label: 'None', value: 'None' }, // Add "None" option
            ...flavorProfiles.map(profile => ({
                label: profile.title,
                value: profile.id
            }))
        ];

        setItems(profileItems);

        // Set the active profile ID when it changes
        if (activeProfileId && profileItems.length > 0) {
            setValue(activeProfileId);
        }
        // Animation: Move up and down
        const moveAnimationLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(moveAnimation, {
                toValue: 10, // Move down
                duration: 1300,
                useNativeDriver: true,
              }),
            Animated.timing(moveAnimation, {
              toValue: 0, // Move up
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        );
    
        // Animation: Fade in and out
        const fadeAnimationLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(fadeAnimation, {
              toValue: 1, // Fully visible
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnimation, {
              toValue: 0, // Fully invisible
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        );
    
        // Start animations
        moveAnimationLoop.start();
        fadeAnimationLoop.start();
    
        // // Cleanup function (optional, if needed for stopping animations)
        // return () => {
        //   moveAnimationLoop.stop();
        //   fadeAnimationLoop.stop();
        // };
      }, [flavorProfiles, activeProfileId, moveAnimation, fadeAnimation]);

    const handleValueChange = (newValue) => {
        console.log("handleValueChange called with:", newValue);
        if (newValue !== value) { // Ensure it's a new selection
            console.log("Updating active profile to:", newValue);
            setValue(newValue);
            updateActiveProfileInFirebase(newValue === '' ? '' : newValue); // Send empty string for "None"
        } else {
            console.log("No change in profile ID or no profile selected.");
        }
    };

    const handleMode = async (mode) => {
        setMode(mode);
        navigation.navigate('Question');
    }

    
    const clearSession = async () => {
        const idToken = await currentUser.getIdToken();
        const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/client/clear_session', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        });
    }
    useFocusEffect(
        useCallback(() => {
            getUserLocation();
            clearSession();
        }, [])
    );

    return (
        <SafeAreaView style={styles.background}>
            {/* title */}
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>G e n i e l i c i o u s</Text>
            </View>

            {/* all the images in the background */}
            <View style={styles.genieContainer}>
                <Image
                    source={require("../assets/sparkle.png")}
                    style={styles.sparkle}
                    resizeMode="contain"
                    onError={(error) => console.log('Image load failed', error)}
                />
                <Animated.Image
                    source={require("../assets/chef_hands_hover.png")}
                    style={[styles.genieImage, {transform: [{ translateY: moveAnimation }]},]}
                    resizeMode="contain"
                />
                <Image
                    source={require("../assets/crystal_ball.png")}
                    style={styles.crystalBall}
                    resizeMode="contain"
                />
                <Animated.Image
                    source={require("../assets/food.png")}
                    style={[styles.food, {opacity: fadeAnimation},]}
                    resizeMode="contain"
                />
            </View>

            {/* taste profile dropdown section */}
            <View style={[styles.tasteProfilesContainer, { zIndex: 1000 }]}>
                <Text style={styles.tasteProfilesText}>Taste Profile:</Text>
                <View style={styles.pickerContainer}>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        onSelectItem={(item) => handleValueChange(item.value)}
                        setItems={setItems}
                        placeholder={'Select a Taste Profile'}
                        zIndex={10000}
                        style={{ backgroundColor: Colors.ghost }}
                        dropDownContainerStyle={{
                            backgroundColor: Colors.ghost,
                            zIndex: 10000,
                        }}
                        dropDownDirection='TOP'
                        listMode="SCROLLVIEW"
                        scrollViewProps={{
                            nestedScrollEnabled: true,
                        }}
                    />
                </View>
            </View>

            {/* select a mode section */}
            <View style={styles.modeContainer}>
                <Text style={styles.modeText}>Select a Mode:</Text>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleMode('short')}>
                        <Text style={styles.profileSubtitle}>Short</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleMode('medium')}>
                        <Text style={styles.profileSubtitle}>Medium</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleMode('long')}>
                        <Text style={styles.profileSubtitle}>Long</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.blue,
    },
    titleContainer: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '8%'
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.champagne,
    },
    genieContainer: {
        flex: 0.63,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0,
    },
    sparkle: {
        // position: 'relative',
        width: width * 2,
        height: height * 0.93,
    },
    genieImage: {
        position: 'absolute',
        width: width * 1,
        height: height * 0.4,
    },
    crystalBall: {
        position: 'absolute',
        width: width * 0.7,
        height: height * 0.28,
        bottom: height * -0.12,
        left: width * 0.165,
    },
    food: {
        position: 'absolute',
        width: width * 0.27,
        height: height * 0.1,
        bottom: height * 0.035,
        left: width * 0.38,
    },
    tasteProfilesContainer: {
        flex: 0.1,
        paddingTop: height * 0.12,
        paddingLeft: 20,
        zIndex: 1000,
    },
    tasteProfilesText: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: Colors.champagne,
    },
    pickerContainer: {
        width: '94%',
        paddingTop: height * 0.005,
        zIndex: 10000,
    },
    modeContainer: {
        flex: 0.1,
        paddingTop: height * 0.05,
        paddingLeft: 20,
    },
    modeText: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: Colors.champagne,
        marginBottom: height * 0.01,
        marginTop: height * 0.005
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '93%',
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        backgroundColor: Colors.gold,
        padding: height * 0.01,
        width: '30%',
        borderRadius: 15,
        borderColor: Colors.champagne,
        borderWidth: 2
    },
    profileSubtitle: {
        fontSize: width * 0.04,
        color: Colors.raisin,
    },
});