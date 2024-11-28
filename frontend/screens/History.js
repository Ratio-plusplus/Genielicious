import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Image, SafeAreaView, TouchableOpacity, Text, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { Colors } from './Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { ProfileContext } from '../contexts/ProfileContext';

const getHistory = async (currentUser) => {
    const idToken = await currentUser.getIdToken();
    const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/get_history', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    });
    const json = await response.json();
    const info = json["info"];
    if (info) {
        const profilesArray = Object.keys(info).map((key) => ({
            id: key,
            ...info[key]
        })).reverse();
        console.log(profilesArray);
        return profilesArray
    }
    else {

        return [];
    }
};
// put the address into a URL that will open it in Google Maps
const openMap = (address) => {
    const formattedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
    Linking.openURL(url);
};

const openYelp = (url) => {
    Linking.openURL(url);
};

export default function History({ navigation }) {
    // map all restaurant array to be false for heart
    const [restaurants, setRestaurants] = useState([]);
    const { location } = React.useContext(ProfileContext);
    const { currentUser } = useAuth(); // Access currentUser and loading
    const route = useRoute();
    const { filters } = route.params || {}; // Get filters from navigation params
    const [isLoading, setIsLoading] = useState(true);


    const saveFavorites = async (index) => {
        const idToken = await currentUser.getIdToken();
        const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/update_history', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ restaurantsInfo: restaurants[index], restaurantId: restaurants[index].id })
        });
        const json = await response.json();
    };

    // toggle each restaurant's heart
    const toggleFavorite = (index) => {
        const newRestaurants = [...restaurants];
        console.log("Before: ", newRestaurants[index]);
        newRestaurants[index].favorite = !newRestaurants[index].favorite;
        setRestaurants(newRestaurants);
        console.log("After: ", newRestaurants);
        saveFavorites(index);
    };

    // Function to filter restaurants based on selected filters
    const filterRestaurants = (restaurants) => {
        if (!filters) return restaurants; // If no filters, return all restaurants

        return restaurants.filter(restaurant => {
            const split = restaurant.taste.split(", ");
            const tastes = split.map(str =>
                str
                    .toLowerCase()                       // Convert the entire string to lowercase
                    .replace(/[\s,-]+(.)/g, (_, char) => char.toUpperCase())  // Capitalize letters after spaces, commas, and hyphens
                    .replace(/[^a-zA-Z0-9]+/g, '')  // Remove any non-alphanumeric characters (including spaces, commas, hyphens)
            );
            let matchesCuisine;
            for (const i in tastes) {
                matchesCuisine = filters.cuisines.length === 0 || filters.cuisines.includes(tastes[i]);
            }
            const matchesFavorites = !filters.favorites || restaurant.favorite; // Assuming 'favorite' is a boolean in restaurant data
            if (filters.sort) {
                matchesCuisine.sort((a, b) => a.distance - b.distance);
            }
            return matchesCuisine && matchesFavorites;
        });
    };

    const renderRestaurantItem = (item, index) => (
        <View style={styles.restaurantDetails}>
            <View style={styles.restaurantTextContainer}>
                <View style={styles.nameContainer}>
                    <Text
                        style={styles.restaurantName}
                        numberOfLines={2}
                        adjustsFontSizeToFit>{item.name}</Text>
                    <View style={styles.endIcons}>
                        <TouchableOpacity onPress={() => toggleFavorite(index)}>
                            {/* if favorite then pink, if not then white */}
                            <MaterialIcons
                                name={restaurants[index].favorite ? "favorite" : "favorite-border"}
                                size={24}
                                color={restaurants[index].favorite ? "#FCA7BE" : Colors.darkGold}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text
                    style={styles.restaurantAliases}
                    numberOfLines={2}
                    adjustsFontSizeToFit>{item.taste}</Text>
                <View style={styles.nameContainer}>
                    <Text
                        style={styles.restaurantAddress}
                        numberOfLines={3}
                        adjustsFontSizeToFit
                        onPress={() => openMap(item.address)} // make the address clickable
                    >
                        {item.address}
                    </Text>
                </View>

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
                        adjustsFontSizeToFit>{item.distance} miles away</Text>
                </View>
            </View>
        </View>
    );
    const getDistance = (results) => {
        const r = 3963; // km (3,963.1) in mi
        const p = Math.PI / 180;
        const newRestaurant = results.map(item => ({
            ...item, distance: Math.round((2 * r * Math.asin(Math.sqrt(
                (0.5 - Math.cos((location.latitude - item.coordinates.latitude) * p) / 2
                    + Math.cos(item.coordinates.latitude * p) * Math.cos(location.latitude * p) *
                    (1 - Math.cos((location.longitude - item.coordinates.longitude) * p)) / 2)))) * 100) / 100
        }))
        console.log(newRestaurant);
        return newRestaurant;
    };
    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const fetchHistory = async () => {
                const results = await getHistory(currentUser);
                const filteredResults = filterRestaurants(results); // Apply filters
                const distanceAdded = getDistance(results);
                setRestaurants(distanceAdded);
            };
            fetchHistory();
            setIsLoading(false);
        }, [filters]) // Re-fetch when filters change
    );


    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => navigation.navigate('Filter')}>
                    <MaterialIcons
                        name="filter-list"
                        size={33}
                        color={Colors.ghost}
                    />
                </TouchableOpacity>
            </View>
            {!isLoading && (
                <View style={styles.restaurantListContainer}>
                    <ScrollView contentContainerStyle={styles.restaurantList}>
                        {restaurants.length === 0 ? (
                            <Text style={styles.noHistoryText}>No history found. Use our Genie now!</Text>
                        ) : (
                            restaurants.map((item, index) => (
                                <View key={index} style={styles.restaurantItem}>
                                    <View style={styles.imagesContainer}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={styles.restaurantImage}
                                            resizeMode="cover"
                                        />
                                        <TouchableOpacity onPress={() => openYelp(item.url)}>
                                            <Image
                                                source={require('../assets/yelp.png')}
                                                style={styles.yelpLogo}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {renderRestaurantItem(item, index)}
                                </View>
                            ))
                        )}
                    </ScrollView>
                </View>
            )}
            {isLoading && (
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
        marginHorizontal: 12,
        marginTop: 12,
        alignItems: "flex-end",
        zIndex: 1000,
    },
    filterButton: {
        zIndex: 10000,
        padding: 5,
        paddingTop: '8%'
    },
    restaurantListContainer: {
        flex: 1,
        paddingBottom: 10,
        paddingRight: 10,
    },
    restaurantList: {
        flexGrow: 1,
        alignItems: 'center',
    },
    restaurantItem: {
        flexDirection: 'row',
        backgroundColor: Colors.ghost,
        padding: 10,
        marginVertical: 15,
        borderRadius: 10,
        borderColor: Colors.gold,
        borderWidth: 2,
        alignItems: 'flex-start',
        width: '90%',
        height: 170,
        shadowColor: Colors.yellow, // Subtle shadow for depth
        shadowOffset: { width: 7, height: 7 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 1000,
    },
    restaurantImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.gold
    },
    restaurantDetails: {
        flex: 1,
        flexDirection: 'column',
        height: '100%'
    },
    restaurantTextContainer: {
        flex: 1,
        justifyContent: "space-between",
        height: '100%'
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexShrink: 1
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.darkGold,
        marginBottom: 5,
        marginRight: 40,
    },
    endIcons: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1,
    },
    restaurantAliases: {
        fontSize: 15,
        color: Colors.blue,
        marginBottom: 5,
    },
    restaurantAddress: {
        fontSize: 15,
        color: Colors.darkGold,
        marginBottom: 5,
        marginRight: 35,
        textDecorationLine: 'underline',
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
        color: Colors.blue,
    },
    yelpLogo: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        top: -70,
        width: 100,
        height: 100,
    },
    imagesContainer: {
        width: '40%',
        height: '100%',
        position: 'relative',
        marginRight: 10,
    },
    noHistoryText: {
        color: Colors.ghost,
        fontSize: 20,
        height: '68%',
        marginTop: 10,
        fontWeight: 'bold'
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
        marginTop: 10,             // Adds space between the spinner and the text
        fontSize: 16,
        color: "#fff",             // White text for visibility
        textAlign: "center",       // Centers text
    },
});