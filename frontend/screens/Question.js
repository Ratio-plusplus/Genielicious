import * as React from 'react';
import { useState, useCallback, useContext, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Image, SafeAreaView, TouchableOpacity, Text, Modal, ActivityIndicator } from 'react-native';
import { Colors } from './Colors';
import { MaterialIcons } from '@expo/vector-icons';
import {useAuth} from '../contexts/AuthContext';
import { FlavorPreferencesContext } from '../contexts/FlavorPreferencesContext';
import { useFocusEffect } from '@react-navigation/native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import * as Font from 'expo-font';

export default function Question({ navigation }) {
    // load custom font
    const [fontLoaded, setFontLoaded] = useState(false);
    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                'InknutAntiqua-Regular': require('../assets/fonts/InknutAntiqua-Regular.ttf'),
            });
            setFontLoaded(true);
        }
        loadFont();
    }, []);

    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalVisibleAd, setModalVisibleAd] = React.useState(false);
    const { mode } = React.useContext(FlavorPreferencesContext);
    const { currentUser, loading } = useAuth(); // Access currentUser and loading
    const [question, setQuestion] = React.useState("Loading Question...");
    const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);
    const [answers, setAnswers] = React.useState(["Yes", "No"]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const handleQuestionnaire = async () => {
        console.log("Questionnaire");
        const idToken = await currentUser.getIdToken();
        const response = await fetch(`https://genielicious-1229a.wl.r.appspot.com/client/questions/${mode}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        });
        if (response.ok) {
            const json = await response.json();
            const answer = json["answer_choices"];
            setAnswers(answer);
            setQuestion(json["question"]);
        }
        else {
            const json = await response.text();
            console.error(json);
        }
    }

    const handleResults = async (answer) => {
        setIsButtonDisabled(true);
        setQuestion("Loading Question...");
        setSelectedAnswer(answer);      // for assigning each answer's color
        setTimeout(() => {
            setSelectedAnswer(null);
        }, 400);

        const idToken = await currentUser.getIdToken();
        const response = await fetch(`https://genielicious-1229a.wl.r.appspot.com/client/answer/${mode}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }, body: JSON.stringify({ answer: answer })
        });
        if (response.ok) {
            const json = await response.json();
            if (json["results"] == false) {
                if (json["success"] == true) {
                    handleQuestionnaire();
                }
            }
            else if (json["results"] == true) {
                navigation.navigate("Result");
            }
        }
        else {
            const json = await response.text();
            console.error(json);
        }
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
            handleQuestionnaire();
        }, [])
    )
    const handleBackPress = () => {
        setModalVisible(true); //show the modal when pressed
    };

    const handleConfirmYes = () => {
        setModalVisible(false);  // close the modal
        clearSession();
        navigation.navigate('Tab');  // navigate back to the Home page
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

    const renderQuestions = (item) => (
        <View
            style={[{ backgroundColor: selectedAnswer === item ? Colors.gold : Colors.champagne }]}>
            <Text 
                style={styles.answerText}
                numberOfLines={2}
                adjustsFontSizeToFit>{item}</Text>
        </View>
    );
    useEffect(() => {
        if (question === "Loading Question...") {
            setIsLoading(true);
            setIsButtonDisabled(true);
        } else {
            setIsLoading(false);
            setIsButtonDisabled(false);
        }
    }, [question]);

    return (
        <SafeAreaView style={styles.background}>
            {/* Back arrow that opens the confirmation modal */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.arrowButton}>
                    <MaterialIcons name="keyboard-arrow-left" size={33} color={Colors.ghost} />
                </TouchableOpacity>
            </View>

            {/* Confirmation modal for back arrow */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
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

            {/* Images in the background */}
            <View style={styles.genieContainer}>
                <Image
                    source={require("../assets/sparkle.png")}
                    style={styles.sparkle}
                    resizeMode="contain"
                />
                <Image
                    source={require("../assets/chef_content.png")}
                    style={styles.genieImage}
                    resizeMode="contain"
                />
                <Image
                    source={require("../assets/crystal_ball.png")}
                    style={styles.crystalBall}
                    resizeMode="contain"
                />
            </View>

            {/* Render questions and answers after loading */}
            {!isLoading && (
                <>
                    <View style={styles.questionContainer}>
                        <View style={styles.questionButton}>
                            <Text 
                                style={styles.questionText}
                                numberOfLines={3}
                                adjustsFontSizeToFit>{question}</Text>
                        </View>
                    </View>

                    <View style={styles.responsesContainer}>
                        <View style={styles.buttonsContainer}>
                            {answers.map((item, index) => (
                                <TouchableOpacity key={index}
                                    style={styles.button}
                                    onPress={() => handleResults(item)}
                                    disabled={isButtonDisabled}
>
                                    {renderQuestions(item)}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </>
            )}

            {/* Ad area */}
            <View style={styles.adContainer}>
                <BannerAd size="480x100" unitId={TestIds.BANNER} />
            </View>

            {/* Confirmation modal for ad */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisibleAd}
                onRequestClose={() => setModalVisibleAd(false)}
            >
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
            {/* Loading animation */}
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
};

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
        paddingTop: '8%'
    },
    genieContainer: {
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0,
        flexShrink: 0
    },
    sparkle: {
        position: 'absolute',
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
        flexGrow: 0.2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '-43%',
        marginHorizontal: 20,
        marginVertical: 20
    },
    questionButton: {
        backgroundColor: Colors.champagne,
        padding: 15,
        borderRadius: 10,
        borderColor: Colors.raisin,
        borderWidth: 1,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.raisin,
        textAlign: 'center',
        //fontFamily: 'InknutAntiqua-Regular',
    },
    responsesContainer: {
        flex: 0.3,
        alignItems: 'center',
        marginTop: -15
    },
    buttonsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        backgroundColor: Colors.champagne,
        padding: 10,
        width: '62%',
        borderRadius: 10,
        borderColor: Colors.raisin,
        borderWidth: 1,
        marginVertical: 5,
    },
    answerText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.raisin,
        textAlign: 'center'
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
        borderWidth: 2,
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
        fontSize: 19
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