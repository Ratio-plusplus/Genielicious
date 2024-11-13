import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Colors } from './Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal, ActivityIndicator} from "react-native";
import { FlavorPreferencesContext } from '../contexts/FlavorPreferencesContext';
import * as Font from 'expo-font';
import * as Location from "expo-location";
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext'


export default function Home({ navigation }) {
    // load custom font
    const [fontLoaded, setFontLoaded] = useState(false);
    const { currentUser } = useAuth(); // Access currentUser and loading
    
    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                'InknutAntiqua-Regular': require('../assets/fonts/InknutAntiqua-Regular.ttf'),
            });
            setFontLoaded(true);
        }
        loadFont();
    }, []);

    const { setMode, flavorProfiles, activeProfileId, updateActiveProfileInFirebase } = React.useContext(FlavorPreferencesContext);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Map flavorProfiles to the format required by DropDownPicker
        const profileItems = flavorProfiles.map(profile => ({
            label: profile.title,
            value: profile.id
        }));
        setItems(profileItems);

        // Set the active profile ID when it changes
        if (activeProfileId && profileItems.length > 0) {
            setValue(activeProfileId);
        }
    }, [flavorProfiles, activeProfileId]);

    const handleValueChange = (newValue) => {
        console.log("handleValueChange called with:", newValue);
        if (newValue && newValue !== value) { // Ensure it's a new selection
            console.log("Updating active profile to:", newValue);
            setValue(newValue);
            updateActiveProfileInFirebase(newValue);
        } else {
            console.log("No change in profile ID or no profile selected.");
        }
    };

    const handleMode = async (mode) => {
        setMode(mode);
        navigation.navigate('Question');
    }

    const getUserLocation = async () => {
        // Just uses expo-location to grab location and print it as coordinates
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            setErrorMsg('Permission to location not granted')
            console.log('Perms not granted!')
            return;
        }

        // Once permissions are grabbed, get coords but in a tuple
        let { coords } = await Location.getCurrentPositionAsync();

        if (coords) {
            const { latitude, longitude } = coords;
            console.log('lat and long: ', latitude, longitude);
            let location = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });
            console.log('User location is: ', location);
            const idToken = await currentUser.getIdToken();
            const response = await fetch(`https://genielicious-1229a.wl.r.appspot.com/database/get_location`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }, body: JSON.stringify({ latitude: latitude, longitude: longitude })
            });
            if (response.ok) {
                const json = await response.json();
                console.log(json);
            } else {
                const json = await response.text();
                console.log(json);
            }
            
        };
    };
    useFocusEffect(
        useCallback(() => {
            getUserLocation();
        }, [])
    );
    return (
        <SafeAreaView style={styles.background}>
            {/* title */}
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Genielicious</Text>
            </View>

            {/* all the images in the background */}
            <View style={styles.genieContainer}>
                <Image
                    source={require("../assets/sparkle.png")}
                    style={styles.sparkle}
                    resizeMode="contain"
                />
                <Image
                    source={require("../assets/chef_hands_hover.png")}
                    style={styles.genieImage}
                    resizeMode="contain"
                />
                <Image
                    source={require("../assets/crystal_ball.png")}
                    style={styles.crystalBall}
                    resizeMode="contain"
                />
                <Image
                    source={require("../assets/food.png")}
                    style={styles.food}
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
    },
    titleText: {
        fontSize: 33,
        fontWeight: 'bold',
        color: Colors.champagne,
        fontFamily: 'InknutAntiqua-Regular',
    },
    genieContainer: {
        flex: 0.63,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0,
    },
    sparkle: {
        position: 'relative',
        width: '200%',
        height: '200%',
    },
    genieImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    crystalBall: {
        position: 'absolute',
        width: '70%',
        height: '70%',
        bottom: '-28%',
        left: '17%',
    },
    food: {
        position: 'absolute',
        width: '27%',
        height: '27%',
        bottom: '10%',
        left: '38%',
    },
    tasteProfilesContainer: {
        flex: 0.1,
        paddingTop: 100,
        paddingLeft: 20,
        zIndex: 1000,
    },
    tasteProfilesText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.champagne,
    },
    pickerContainer: {
        width: '94%',
        paddingTop: 10,
        zIndex: 10000,
    },
    modeContainer: {
        flex: 0.1,
        paddingTop: 40,
        paddingLeft: 20,
    },
    modeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.champagne,
        marginBottom: 10,
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
        padding: 10,
        width: '30%',
        borderRadius: 10,
        borderColor: Colors.raisin,
        borderWidth: 1
    },
    profileSubtitle: {
        fontSize: 16,
        color: Colors.raisin,
    },
});