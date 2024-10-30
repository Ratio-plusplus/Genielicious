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
const renderRestaurantItem = ({ name, taste, address, distance }) => (
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
            <Text style={styles.restaurantDistance}>{distance}</Text>
        </View>
    </View>
);

// put the address into a URL that will open it in Google Maps
const openMap = (address) => {
    const formattedAddress = encodeURIComponent(address); // format the address for a Google Maps URL
    const url = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
    Linking.openURL(url); // Linking API allows user to open URLs
};

const getResults = async (currentUser) => {
    const restaurants = [];
    const idToken = await currentUser.getIdToken();
    const response = await fetch('http://10.0.2.2:5000/database/get_result_cache', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    });
    const json = await response.json();
    const results = json["info"];
    const obj = JSON.parse(results);
    const businesses = obj.businesses;
    for (i = 0; i < 4; i++) {
        const testobj = businesses[i];
        const push = { name: testobj.name, taste: testobj.categories[0].title, address: testobj.location.display_address.join(', '), distance: testobj.distance, image: testobj.image_url };
        restaurants.push(push);
    }
    return restaurants;
};
export default function Result({ navigation }) {
    const { currentUser, loading } = useAuth(); // Access currentUser and loading
    const [modalVisible, setModalVisible] = React.useState(false);
    const [ready, setReady] = React.useState(false);
    const [restaurants, setRestaurants] = useState([]);    

    const handleBackPress = () => {
        setModalVisible(true); //show the modal when pressed
    };

    const handleConfirmYes = () => {
        setModalVisible(false);  // close the modal
        navigation.navigate('Tab');  // navigate back to the Home page
    };

    const handleConfirmNo = () => {
        setModalVisible(false);  // close the modal without navigating
    };
    useEffect(() => {
        const fetchResults = async () => {
            const results = await getResults(currentUser);
            setRestaurants(results);

        };

        fetchResults();
    }, [currentUser]);


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
                <Text style={styles.title}>Here are your Results:</Text>
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
    },
    title: {
        fontWeight: "bold",
        fontSize: 25,
        color: Colors.champagne,
        right: 50,
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
    },
    restaurantList: {
        flexGrow: 1,
        paddingHorizontal: 10,
    },
    restaurantItem: {
        flexDirection: 'row',
        backgroundColor: "#425466",
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        borderColor: Colors.raisin,
        borderWidth: 1,
        alignItems: 'center',
        width: '90%',
        left: '3.5%',
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
        alignItems: 'center'
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