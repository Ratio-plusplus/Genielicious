import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Image, SafeAreaView, TouchableOpacity, Text, ScrollView, Linking, Modal, ActivityIndicator, Dimensions, PixelRatio } from 'react-native';
import { Colors } from './Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;

// array for the different restaurant results
// has the name, taste, address, distance, and image
// map the name, taste, address, and distance (put it into text to show up in results)
const renderRestaurantItem = ({ name, taste, address, distance, url }) => (
    <View style={styles.restaurantDetails}>
        <Text 
            style={styles.restaurantName} 
            numberOfLines={2}
            adjustsFontSizeToFit
            onPress={() => openMap(address)} // make the name clickable
        >
            {name}
        </Text>
        <Text 
            style={styles.restaurantTaste}
            numberOfLines={1}
            adjustsFontSizeToFit>{taste}</Text>
        <Text 
            style={styles.restaurantAddress} 
            numberOfLines={2}
            adjustsFontSizeToFit
            onPress={() => openMap(address)} // make the address clickable
        >
            {address}
        </Text>

        {/* location icon for the distance */} 
        <View style={styles.distanceContainer}>
            <MaterialIcons
                name="location-on"
                size={16}
                color={Colors.blue}
                style={styles.locationIcon}
            />
            <Text 
                style={styles.restaurantDistance}
                numberOfLines={1}
                adjustsFontSizeToFit>{distance} miles away</Text>
        </View>
    </View>
);

// put the address into a URL that will open it in Google Maps
const openMap = (address) => {
    const formattedAddress = encodeURIComponent(address); // format the address for a Google Maps URL
    const url = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
    Linking.openURL(url); // Linking API allows user to open URLs
};

const openYelp = (url) => {
    Linking.openURL(url);
};

export default function Result({ navigation }) {
    const { currentUser } = useAuth(); // Access currentUser and loading
    const [modalVisible, setModalVisible] = React.useState(false);
    const [errorModalVisible, setErrorModalVisible] = React.useState(false);
    const [ready, setReady] = React.useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const [title, setTitle] = React.useState("Placeholder");

    const handleBackPress = () => {
        setModalVisible(true); //show the modal when pressed
    };
    const handleConfirmYes = () => {
        setModalVisible(false);
        setReady(false);// close the modal
        navigation.navigate('Tab');  // navigate back to the Home page
    };

    const handleConfirmNo = () => {
        setModalVisible(false);  // close the modal without navigating
    };

    const handleErrorConfirm = () => {
        setErrorModalVisible(false);
        navigation.navigate('Tab');  // navigate back to the Home page
    };

    const getResults = async (currentUser) => {
        const restaurants = [];
        const idToken = await currentUser.getIdToken();
        //Call to API to retrieve result cache in Realtime Database
        let response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/get_result_cache', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        });
        //Turns response into a json
        let json = await response.json();
        //Gets the string stored in info
        let info = json["info"];
        const status = JSON.parse(info).result_status;
        console.log(status);
        switch (status) {
            case 4:
                console.log("3");
                setTitle("No restaurants were found in your area. Try again with different answers or at different hours.");
                break;
            case 3:
                console.log("3");
                setTitle("No restaurants were found in your area. Try again with different answers or at different hours.");
                break;
            case 2:
                console.log("2");
                setTitle("These restaurants have similar food items to the one you were recommended. Check them out:");
                break;
            default:
                console.log("1");
                setTitle("Here are your Results: ");
                break;
        };
        const businessList = JSON.parse(info).businesses;
        for (i = 0; i < businessList.length; i++) {
            const restaurantInfo = businessList[i];
            restaurantInfo.distance = Math.round((restaurantInfo.distance / 1609) * 100) / 100;
            aliases = [];
            let length = 2;
            if (restaurantInfo.categories.length < 2) {
                length = restaurantInfo.categories.length
            }
            for (x = 0; x < length; x++) {
                console.log(restaurantInfo.categories[x]);
                aliases.push(restaurantInfo.categories[x].alias);
            }
            const push = {
                name: restaurantInfo.name, taste: aliases.join(', '), address: restaurantInfo.location.display_address.join(', '), distance: restaurantInfo.distance, image: restaurantInfo.image_url, favorite: false, url: restaurantInfo.url, coordinates: { latitude: restaurantInfo.coordinates.latitude, longitude: restaurantInfo.coordinates.longitude }, id: restaurantInfo.id
            };
            restaurants.push(push);
        }
        const restaurant = JSON.stringify(restaurants);
        response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/add_history', { //https://genielicious-1229a.wl.r.appspot.com
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ "restaurantsInfo": restaurant })
        });
        json = await response.json();
        info = json["info"];
        const profilesArray = Object.keys(info).map((key) => ({
            id: key,
            ...info[key]
        }));
        return profilesArray;
    };

    useEffect(() => {
        if (!ready) {
            const fetchResults = async () => {
                    const results = await getResults(currentUser);
                    setRestaurants(results);
                    setReady(true);
    
            }
        fetchResults();
        }
    }, [ready]);
    


    return (
        <SafeAreaView style={styles.background}>
            {/* back arrow that opens the confirmation modal */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleBackPress}
                    style={styles.arrowButton}>
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={33}
                        color={Colors.ghost}
                    />
                </TouchableOpacity>
                <Text 
                    style={styles.title}
                    adjustsFontSizeToFit
                    numberOfLines={3}>{title}</Text>
            </View>

            {/* confirmation modal for back arrow */}
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)} // handle hardware back button
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Are you sure you want to exit session?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalYesButton}
                                onPress={handleConfirmYes}>
                                <Text style={styles.buttonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalNoButton}
                                onPress={handleConfirmNo}>
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Error Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={errorModalVisible}
                onRequestClose={() => setErrorModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>An error has occurred. Please try again later.</Text>
                        <TouchableOpacity
                            style={styles.modalYesButton}
                            onPress={handleErrorConfirm}>
                            <Text style={styles.buttonText}>Go Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* images for the background */}
            <View style={styles.genieContainer}>
                <Image
                    source={require("../assets/sparkle.png")}
                    style={styles.sparkle}
                    resizeMode="contain"
                />
                <Image
                    source={require("../assets/chef_thumbsup.png")}
                    style={styles.genieImage}
                    resizeMode="contain"
                />
                <Image
                    source={require("../assets/crystal_ball.png")}
                    style={styles.crystalBall}
                    resizeMode="contain"
                />
            </View>
            
            {/* restaurant list that is scrollable */}
            {ready && (
            <View style={styles.restaurantListContainer}>
                <ScrollView contentContainerStyle={styles.restaurantList}>
                    {restaurants.map((item, index) => (
                        <View key={index} style={styles.restaurantItem}>
                            <View style={styles.imagesContainer}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.restaurantImage}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity onPress={() => openYelp(item.url)}>
                                    <Image
                                        source={require('../assets/yelp.png')} // Add Yelp logo image
                                        style={styles.yelpLogo}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                            <React.Fragment key={index}>
                                {renderRestaurantItem(item)}
                            </React.Fragment>
                        </View>
                    ))}
                </ScrollView>
            </View>
            )}
            {!ready && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingContent}>
                        <ActivityIndicator size="large" color="#007bff" />
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.blue,
    },
    header: {
        marginHorizontal: scale(12),
        marginTop: scale(12),
        marginBottom: scale(30),
        flexDirection: "row",
        justifyContent: "space-between",
        zIndex: 1000
    },
    arrowButton: {
        zIndex: 100000,
        paddingTop: '8%'
    },
    title: {
        fontWeight: "bold",
        fontSize: scale(23),
        color: Colors.champagne,
        textAlign: 'center',
        paddingRight: '13%',
        paddingTop: '8%'
    },
    genieContainer: {
        height: '48%',  
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0,
    },
    sparkle: {
        position: 'relative',
        width: '100%',
        height: '100%',
        transform: [{ scale: 1.85 }],
    },
    genieImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        transform: [{ scale: 1.2 }],
    },
    crystalBall: {
        position: 'absolute',
        width: '219%',
        height: '219%',
        bottom: '-180%',
        right: '-57%',
    },
    restaurantListContainer: {
        flex: 1,
        marginTop: '-43%', 
        paddingBottom: scale(10),
        marginLeft: 0,
    },
    restaurantList: {
        flexGrow: 1,
        alignItems: 'center',
    },
    restaurantItem: {
        flexDirection: 'row',
        backgroundColor: Colors.ghost,
        padding: scale(10),
        marginVertical: scale(10),
        borderRadius: scale(10),
        borderColor: Colors.gold,
        borderWidth: 2,
        alignItems: 'flex-start',
        width: '90%',
        height: scale(150),
        shadowColor: Colors.yellow, // Subtle shadow for depth
        shadowOffset: { width: scale(7), height: scale(7) },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    restaurantImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    restaurantDetails: {
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-evenly'
    },
    restaurantName: {
        fontSize: scale(18),
        fontWeight: 'bold',
        color: Colors.darkGold,
        marginBottom: scale(5),
    },
    restaurantTaste: {
        fontSize: scale(15),
        color: Colors.blue,
        marginBottom: scale(5),
    },
    restaurantAddress: {
        fontSize: scale(15),
        color: Colors.darkGold,
        marginBottom: scale(5),
        textDecorationLine: 'underline',
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        marginRight: scale(5),
    },
    restaurantDistance: {
        fontSize: scale(15),
        color: Colors.blue,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  
    },
    modalContainer: {
        width: '80%',
        backgroundColor: Colors.blue,
        borderRadius: scale(10),
        borderWidth: scale(2),
        borderColor: Colors.ghost,
        padding: scale(20),
        marginHorizontal: 0,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: scale(2),
        },
        shadowOpacity: 0.25,
        shadowRadius: scale(4),
        elevation: 5,
    },
    modalText: {
        fontSize: scale(22),
        fontWeight: '600',
        marginBottom: scale(20),
        color: Colors.ghost,
        alignItems: 'center',
        textAlign: 'center'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    modalYesButton: {
        padding: scale(10),
        borderRadius: scale(5),
        minWidth: scale(100),
        alignItems: 'center',
        backgroundColor: Colors.gold
    },
    modalNoButton: {
        padding: scale(10),
        borderRadius: scale(5),
        minWidth: scale(100),
        alignItems: 'center',
        backgroundColor: Colors.champagne
    },
    buttonText: {
        color: Colors.raisin,
        fontWeight: '600',
        fontSize: scale(19),
    },
    imagesContainer: {
        width: '40%',
        height: '100%',
        position: 'relative',
        marginRight: scale(10),
    },
    yelpLogo: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        top: -70,
        width: scale(100),
        height: scale(100),
    },
    loadingOverlay: {
        position: "absolute",       // Full-screen overlay
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,                 // Covers entire screen
        justifyContent: "center",  // Centers children vertically
        alignItems: "center",      // Centers children horizontally
        backgroundColor: "rgba(0, 0, 0, 0.25)", // Semi-transparent black
        zIndex: 1000,              // Ensures it appears above everything else
    },
    loadingContent: {
        justifyContent: "center",  // Centers content vertically inside this container
        alignItems: "center",      // Centers content horizontally
    },
    loadingText: {
        marginTop: scale(10),             // Adds space between the spinner and the text
        fontSize: scale(16),
        color: "#fff",             // White text for visibility
        textAlign: "center",       // Centers text
    },
});