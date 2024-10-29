import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Image, SafeAreaView, TouchableOpacity, Text, ScrollView, Linking } from 'react-native';
import { Colors } from './Colors';
import { MaterialIcons } from '@expo/vector-icons';

// array for the different restaurant results
const restaurants = [
    {
        name: 'Wingstop',
        taste: 'Salty, Savory, Spicy',
        address: '4401 E Pacific Coast Hwy, Long Beach, CA 90804',
        image: require('../../assets/restaurant1.png'),
    },
    {
        name: 'Buffalo Wild Wings',
        taste: 'Salty, Savory',
        address: '6314 Pacific Coast Hwy, Long Beach, CA 90803',
        image: require('../../assets/restaurant2.png'),
    },
    {
        name: 'Fire Wings',
        taste: 'Spicy, Savory, Hot',
        address: '7565 Long Bch Towne Ctr, Long Beach, CA 90808',
        image: require('../../assets/restaurant3.png'),
    },
];

// put the address into a URL that will open it in Google Maps
const openMap = (address) => {
    const formattedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
    Linking.openURL(url);
};

export default function History({ navigation }) {
    // map all restaurant array to be false for heart
    const [favorites, setFavorites] = useState(restaurants.map(() => false));

    // toggle each restaurant's heart
    const toggleFavorite = (index) => {
        const newFavorites = [...favorites];
        newFavorites[index] = !newFavorites[index];
        setFavorites(newFavorites);
    };

    const renderRestaurantItem = (item, index) => (
        <View style={styles.restaurantDetails}>
            <View style={styles.restaurantTextContainer}>
                <View style={styles.nameContainer}>
                    <Text style={styles.restaurantName}>{item.name}</Text>
                    <TouchableOpacity onPress={() => toggleFavorite(index)}>
                        {/* if favorite then pink, if not then white */}
                        <MaterialIcons
                            name={favorites[index] ? "favorite" : "favorite-border"}
                            size={24}
                            color={favorites[index] ? "pink" : "white"}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.restaurantTaste}>{item.taste}</Text>
                <Text
                    style={styles.restaurantAddress}
                    onPress={() => openMap(item.address)} // make the address clickable
                >
                    {item.address}
                </Text>
            </View>
        </View>
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

            <View style={styles.restaurantListContainer}>
                <ScrollView contentContainerStyle={styles.restaurantList}>
                    {restaurants.map((item, index) => (
                        <View key={index} style={styles.restaurantItem}>
                            <Image
                                source={item.image}
                                style={styles.restaurantImage}
                                resizeMode="cover"
                            />
                            {renderRestaurantItem(item, index)}
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
        alignItems: "flex-end",
        zIndex: 1000,
    },
    filterButton: {
        zIndex: 10000,
        padding: 5
    },
    restaurantListContainer: {
        flex: 1,
        paddingBottom: 10,
    },
    restaurantList: {
        flexGrow: 1,
        paddingHorizontal: 10,
    },
    restaurantItem: {
        flexDirection: 'row',
        backgroundColor: Colors.blue,
        padding: 10,
        marginVertical: 15,
        borderRadius: 10,
        borderColor: Colors.ghost,
        borderWidth: 1,
        alignItems: 'center',
        width: '90%',
        left: '3%',
    },
    restaurantImage: {
        width: '40%',
        height: '100%',
        borderRadius: 10,
        marginRight: 10,
    },
    restaurantDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    restaurantTextContainer: {
        flex: 1,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    restaurantName: {
        fontSize: 16,
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
});
