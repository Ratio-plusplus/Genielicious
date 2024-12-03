import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Image, SafeAreaView, TouchableOpacity, Text, ScrollView, Linking, Modal } from 'react-native';
import { Colors } from './Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

// array for the different restaurant results
// has the name, taste, address, distance, and image
// map the name, taste, address, and distance (put it into text to show up in results)
const renderRestaurantItem = ({ name, taste, address, distance, url }) => (
    <View style={styles.restaurantDetails}>
        <Text 
            style={styles.restaurantName} 
            onPress={() => openMap(address)} // make the name clickable
        >
            {name}
        </Text>
        <Text style={styles.restaurantTaste}>{taste}</Text>
        <Text 
            style={styles.restaurantAddress} 
            onPress={() => openMap(address)} // make the address clickable
        >
            {address}
        </Text>

        {/* location icon for the distance */} 
        <View style={styles.distanceContainer}>
            <MaterialIcons
                name="location-on"
                size={16}
                color={Colors.champagne}
                style={styles.locationIcon}
            />
            <Text style={styles.restaurantDistance}>{distance} miles away</Text>
        </View>
    </View>
);

// put the address into a URL that will open it in Google Maps
const openMap = (address) => {
    const formattedAddress = encodeURIComponent(address); // format the address for a Google Maps URL
    const url = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
    Linking.openURL(url); // Linking API allows user to open URLs
};

<<<<<<< Updated upstream
const getResults = async (currentUser) => {
    const restaurants = [];
    const idToken = await currentUser.getIdToken();
    //Call to API to retrieve result cache in Realtime Database
    const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/get_result_cache', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    });
    //Turns response into a json
    const json = await response.json();
    //Gets the string stored in info
    const results = json["info"];
    const businessList = JSON.parse(results).businesses;
    for (i = 0; i < businessList.length; i++) {
        const restaurantInfo = businessList[i];
        restaurantInfo.distance = Math.round((restaurantInfo.distance / 1609) * 100) / 100;
        aliases = [];
        console.log(restaurantInfo.url);
        for (x = 0; x < restaurantInfo.categories.length; x++) {
            //console.log(restaurantInfo.categories[x]);
            aliases.push(restaurantInfo.categories[x].alias);
        }
        const push = { name: restaurantInfo.name, taste: aliases.join(', '), address: restaurantInfo.location.display_address.join(', '), distance: restaurantInfo.distance, image: restaurantInfo.image_url, favorite: false, url: restaurantInfo.url };
        restaurants.push(push);
    }
    const restaurant = JSON.stringify(restaurants);
    const response1 = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/add_history', { //https://genielicious-1229a.wl.r.appspot.com
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ "restaurantsInfo": restaurant })
    });
    const json1 = await response1.json();
    return restaurants;
};
=======
const openYelp = (url) => {
    Linking.openURL(url);
};

>>>>>>> Stashed changes
export default function Result({ navigation }) {
    const { currentUser } = useAuth(); // Access currentUser and loading
    const [modalVisible, setModalVisible] = React.useState(false);
    const [ready, setReady] = React.useState(false);
    const [restaurants, setRestaurants] = React.useState([]);
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

    const getResults = async (currentUser) => {
        const restaurants = [];
        const idToken = await currentUser.getIdToken();
        //Call to API to retrieve result cache in Realtime Database
        const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/get_result_cache', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        });
        //Turns response into a json
        const json = await response.json();
        //Gets the string stored in info
        console.log(json);
        const results = json["info"];
        const status = JSON.parse(results).result_status;
        switch (status) {
            case 3:
                console.log("3");
                setTitle("No restauarants were found in your area. Try again with different answers or at different hours.");
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
        const businessList = JSON.parse(results).businesses;
        for (i = 0; i < businessList.length; i++) {
            const restaurantInfo = businessList[i];
            restaurantInfo.distance = Math.round((restaurantInfo.distance / 1609) * 100) / 100;
            aliases = [];
            console.log(restaurantInfo.url);
            for (x = 0; x < restaurantInfo.categories.length; x++) {
                //console.log(restaurantInfo.categories[x]);
                aliases.push(restaurantInfo.categories[x].alias);
            }
            const push = {
                name: restaurantInfo.name, taste: aliases.join(', '), address: restaurantInfo.location.display_address.join(', '), distance: restaurantInfo.distance, image: restaurantInfo.image_url, favorite: false, url: restaurantInfo.url, coordinates: { latitude: restaurantInfo.coordinates.latitude, longitude: restaurantInfo.coordinates.longitude }, id: restaurantInfo.id
            };
            restaurants.push(push);
        }
        const restaurant = JSON.stringify(restaurants);
        const response1 = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/add_history', { //https://genielicious-1229a.wl.r.appspot.com
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ "restaurantsInfo": restaurant })
        });
        const restaurantList = response1["info"]
        console.log(restaurantList);
        return restaurants;
    };

    useEffect(() => {
        if (!ready) {
            setReady(true);
            const fetchResults = async () => {
                const results = await getResults(currentUser);
                setRestaurants(results);
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
                <Text style={styles.title}>{title}</Text>
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
            <View style={styles.restaurantListContainer}>
                <ScrollView contentContainerStyle={styles.restaurantList}>
                    {restaurants.map((item, index) => (
                        <View key={index} style={styles.restaurantItem}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.restaurantImage}
                                resizeMode="cover"
                            />
                            <React.Fragment key={index}>
                                {renderRestaurantItem(item)}
                            </React.Fragment>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.blue,
    },
    header: {
        marginHorizontal: 12,
        marginTop: 12,
        marginBottom: 30,
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
        fontSize: 22,
        color: Colors.champagne,
        paddingRight: '10%',
        paddingTop: '5%',
        fontFamily: 'InknutAntiqua-Regular',
        textAlign: 'center',
        justifyContent: 'center'
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
        marginTop: -70, 
        paddingBottom: 10,
        marginLeft: 0,

    },
    restaurantList: {
        flexGrow: 1,
        alignItems: 'center',

    },
    restaurantItem: {
        flexDirection: 'row',
        backgroundColor: "#425466",
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        borderColor: Colors.raisin,
        borderWidth: 1,
        width: '90%',
        alignItems: 'center',
    },
    restaurantImage: {
        width: '40%',
        height: '100%',
        borderRadius: 10,
        marginRight: 10,
    },
    restaurantDetails: {
        flex: 1,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.gold,
        marginBottom: 5,
    },
    restaurantTaste: {
        fontSize: 15,
        color: Colors.ghost,
        marginBottom: 5,
    },
    restaurantAddress: {
        fontSize: 15,
        color: Colors.gold,
        marginBottom: 5,
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        marginRight: 5,
    },
    restaurantDistance: {
        fontSize: 15,
        color: Colors.champagne,
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
        borderWidth: 1,
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
        fontSize: 22,
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
        backgroundColor: Colors.champagne
    },
    buttonText: {
        color: Colors.raisin,
        fontWeight: '600',
        marginTop: 3,
        fontSize: 19
    },
});