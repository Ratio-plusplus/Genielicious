import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Image, SafeAreaView, TouchableOpacity, Text, Modal } from 'react-native';
import { Colors } from './Colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function Answer({ navigation }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalVisibleAd, setModalVisibleAd] = React.useState(false);

    const handleBackPress = () => {
        setModalVisible(true); //show the modal when pressed
    };

    const handleConfirmYes = () => {
        setModalVisible(false);  // close the modal
        navigation.navigate('Home');  // navigate back to the Home page
    };

    const handleConfirmNo = () => {
        setModalVisible(false);  // close the modal without navigating
    };

    const handleAdPress = () => {
        setModalVisibleAd(true); 
    };

    const handleConfirmYesAd = () => {
        setModalVisibleAd(false);  
        navigation.navigate('History');  // navigate to ad (change when needed)
    };

    const handleConfirmNoAd = () => {
        setModalVisibleAd(false);  
    };

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

            {/* images in the background */}
            <View style={styles.genieContainer}>
                <Image
                    source={require("../../assets/sparkle.png")}
                    style={styles.sparkle}
                    resizeMode="contain"
                />
                <Image
                    source={require("../../assets/chef_hands_hover.png")}
                    style={styles.genieImage}
                    resizeMode="contain"
                />
                <Image
                    source={require("../../assets/crystal_ball.png")}
                    style={styles.crystalBall}
                    resizeMode="contain"
                />
            </View>

            {/* confirmation question before going to results */}
            <View style={styles.questionContainer}>
                <View style={styles.questionButton}>
                    <Text style={styles.questionText}>Are you craving chicken wings?</Text>
                </View>
            </View>

            {/* if yes, then move to result, if not then questions repeat */}
            <View style={styles.responsesContainer}>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Result')}>
                        <Text style={styles.profileSubtitle}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Question')}>
                        <Text style={styles.profileSubtitle}>No</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ad area */}
            <View style={styles.adContainer}>
                <TouchableOpacity style={styles.adButton}
                    onPress={handleAdPress}>
                    <Text style={styles.adTitle}>Ad</Text>
                </TouchableOpacity>
            </View>

            {/* confirmation modal for ad */}
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisibleAd}
                onRequestClose={() => setModalVisibleAd(false)} // Handle hardware back button
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Are you sure you want to exit session?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalYesButton}
                                onPress={handleConfirmYesAd}>
                                <Text style={styles.buttonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalNoButton}
                                onPress={handleConfirmNoAd}>
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.blue,
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-start",
        padding: 12, 
        zIndex: 1000, 
        position: "relative", 
    },
    arrowButton: {
        zIndex: 100000, 
    },
    genieContainer: {
        flex: 0.5,  
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0,
    },
    sparkle: {
        position: 'relative',
        width: '100%',
        height: '100%',
        transform: [{ scale: 1.85 }]
    },
    genieImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        transform: [{ scale: 1.2 }], 
    },
    crystalBall: {
        position: 'absolute',
        width: '215%',
        height: '215%',
        bottom: '-180%',
        right: '-55%'
    },
    questionContainer: {
        flex: 0.15, 
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -50, 
    },
    questionButton: {
        backgroundColor: Colors.champagne,
        padding: 15,
        borderRadius: 10,
        borderColor: Colors.raisin,
        borderWidth: 1,
    },
    questionText: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.raisin,
    },
    responsesContainer: {
        flex: 0.3, 
        paddingLeft: 20,
        paddingTop: 10 
    },
    buttonsContainer: {
        flexDirection: 'column',
        justifyContent: 'center', 
        width: '93%', 
        alignItems: 'center', 
    },
    button: {
        alignItems: 'center',
        backgroundColor: Colors.gold,
        padding: 10,
        width: '40%', 
        borderRadius: 10,
        borderColor: Colors.raisin,
        borderWidth: 1,
        marginVertical: 5,
    },
    profileSubtitle: {
        fontSize: 16, 
        fontWeight: '500',
        color: Colors.raisin, 
    },
    adContainer: {
        position: 'absolute',
        bottom: 0, 
        height: '12%', 
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    adButton: {
        alignItems: 'center',
        justifyContent: 'center', 
        backgroundColor: Colors.ghost, 
        paddingVertical: 30, 
        paddingHorizontal: 50, 
        width: '100%', 
        borderRadius: 15, 
        borderColor: Colors.raisin,
        borderWidth: 1,
    },
    adTitle: {
        fontSize: 25, 
        fontWeight: '600', 
        color: Colors.raisin, 
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
