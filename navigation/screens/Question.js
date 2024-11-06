import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Image, SafeAreaView, TouchableOpacity, Text, Modal, ActivityIndicator } from 'react-native';
import { Colors } from './Colors';
import * as Font from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

export default function Question({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleAd, setModalVisibleAd] = useState(false);
    const [pressedButton, setPressedButton] = useState(null);

    const handleBackPress = () => setModalVisible(true);

    const handleConfirmYes = () => {
        setModalVisible(false);
        navigation.navigate('Home');
    };

    const handleAdPress = () => setModalVisibleAd(true);

    const handleConfirmYesAd = () => {
        setModalVisibleAd(false);
        navigation.navigate('History');
    };

    const handleConfirmNo = () => setModalVisible(false);
    const handleConfirmNoAd = () => setModalVisibleAd(false);

    // button turns gold when you press on it
    // id makes sure that each button is unique
    // label is what the button says
    const renderButton = (label, id) => (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: pressedButton == id ? Colors.gold : Colors.champagne }]}
            activeOpacity={1}
            onPress={() => navigation.navigate('Answer')}
            onPressIn={() => setPressedButton(id)}
            onPressOut={() => setPressedButton(null)}>
            <Text style={styles.profileSubtitle}>{label}</Text>
        </TouchableOpacity>
    );

    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                'InknutAntiqua-Regular': require('../../assets/fonts/InknutAntiqua-Regular.ttf'),
            });
            setFontLoaded(true);
        }
        loadFont();
    }, []);

    if (!fontLoaded) {
        return <ActivityIndicator size="large" color={Colors.raisin} />;
    }

    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.arrowButton}>
                    <MaterialIcons name="keyboard-arrow-left" size={33} color={Colors.ghost} />
                </TouchableOpacity>
            </View>

            <Modal animationType='fade' transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Are you sure you want to exit session?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalYesButton} onPress={handleConfirmYes}>
                                <Text style={styles.buttonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalNoButton} onPress={handleConfirmNo}>
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.genieContainer}>
                <Image source={require("../../assets/sparkle.png")} style={styles.sparkle} resizeMode="contain" />
                <Image source={require("../../assets/chef_content.png")} style={styles.genieImage} resizeMode="contain" />
                <Image source={require("../../assets/crystal_ball.png")} style={styles.crystalBall} resizeMode="contain" />
            </View>

            <View style={styles.questionContainer}>
                <View style={styles.questionButton}>
                    <Text style={styles.questionText}>Are you craving spicy ajdkjdhor sweet food?</Text>
                </View>
            </View>

            <View style={styles.responsesContainer}>
                <View style={styles.buttonsContainer}>
                    {renderButton("Yes", 1)}
                    {renderButton("No", 2)}
                    {renderButton("Maybe", 3)}
                    {renderButton("Not Sure", 4)}
                </View>
            </View>

            <View style={styles.adContainer}>
                <TouchableOpacity style={styles.adButton} onPress={handleAdPress}>
                    <Text style={styles.adTitle}>Ad</Text>
                </TouchableOpacity>
            </View>

            <Modal 
                animationType='fade' 
                transparent={true} 
                visible={modalVisibleAd} 
                onRequestClose={() => setModalVisibleAd(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Are you sure you want to exit session?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalYesButton} onPress={handleConfirmYesAd}>
                                <Text style={styles.buttonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalNoButton} onPress={handleConfirmNoAd}>
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
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -50,
        paddingHorizontal: 10, // Ensure there’s horizontal padding to avoid clipping
    },
    questionButton: {
        backgroundColor: Colors.champagne,
        padding: 15,
        borderRadius: 10,
        borderColor: Colors.raisin,
        borderWidth: 1,
        width: '90%', // Limit the width to ensure it doesn’t stretch beyond the screen
    },
    questionText: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.raisin,
        fontFamily: 'InknutAntiqua-Regular',
        textAlign: 'center',
        flexWrap: 'wrap', // Allow text to wrap to the next line
        lineHeight: 21, // Adjust line height for readability if the text spans multiple lines
        paddingHorizontal: 10, // Optional padding to add spacing inside the container
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
