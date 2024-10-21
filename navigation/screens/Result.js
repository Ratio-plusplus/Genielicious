import * as React from 'react';
import { StyleSheet, View, Image, SafeAreaView, TouchableOpacity, Text, ScrollView, Linking } from 'react-native';
import { Colors } from './Colors';
import { MaterialIcons } from '@expo/vector-icons';

// array for the different restaurant results
// has the name, taste, address, distance, and image
const restaurants = [
    {
        name: 'Wingstop',
        taste: 'Salty, Savory, Spicy',
        address: '4401 E Pacific Coast Hwy, Long Beach, CA 90804',
        distance: '2.1 miles away',
        image: require('../../assets/restaurant1.png'),
    },
    {
        name: 'Buffalo Wild Wings',
        taste: 'Salty, Savory',
        address: '6314 Pacific Coast Hwy, Long Beach, CA 90803',
        distance: '3.2 miles away',
        image: require('../../assets/restaurant2.png'),
    },
    {
        name: 'Fire Wings',
        taste: 'Spicy, Savory, Hot',
        address: '7565 Long Bch Towne Ctr, Long Beach, CA 90808',
        distance: '4.5 miles away',
        image: require('../../assets/restaurant3.png'),
    },
    {
        name: 'Fire Wings',
        taste: 'Spicy, Savory, Hot',
        address: '7565 Long Bch Towne Ctr, Long Beach, CA 90808',
        distance: '4.5 miles away',
        image: require('../../assets/restaurant3.png'),
    },
];

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

export default function Result({ navigation }) {
    return (
        <SafeAreaView style={styles.background}>
            {/* back arrow to navigate back to Home page if pressed */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    style={styles.arrowButton}>
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={33}
                        color={Colors.ghost}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Here are your Results:</Text>
            </View>

            {/* images for the background */}
            <View style={styles.genieContainer}>
                <Image
                    source={require("../../assets/sparkle.png")}
                    style={styles.sparkle}
                    resizeMode="contain"
                />
                <Image
                    source={require("../../assets/chef_thumbsup.png")}
                    style={styles.genieImage}
                    resizeMode="contain"
                />
                <Image
                    source={require("../../assets/crystal_ball.png")}
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
                                source={item.image}
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
});
