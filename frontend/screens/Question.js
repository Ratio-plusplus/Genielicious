import * as React from 'react';
import { useState, useCallback, useContext, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Image, SafeAreaView, TouchableOpacity, Text, Modal } from 'react-native';
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
    const {mode} = React.useContext(FlavorPreferencesContext);
    const { currentUser, loading } = useAuth(); // Access currentUser and loading
    const [question, setQuestion] = React.useState("Loading Question...");
    const [answer1, setAnswer1] = React.useState("Yes");
    const [answer2, setAnswer2] = React.useState("No");
    const [answer3, setAnswer3] = React.useState("Maybe");
    const [answer4, setAnswer4] = React.useState("Not Sure");

    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const handleQuestionnaire = async () => {
        const idToken = await currentUser.getIdToken();
        const response = await fetch(`https://genielicious-1229a.wl.r.appspot.com/client/questions/${mode}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
        });
        if (response.ok) {
            const json = await response.json();
            setQuestion(json["question"]);
            const answer = json["answer_choices"];
            setAnswer1(answer[0]);
            setAnswer2(answer[1]);
            setAnswer3(answer[2]);
            setAnswer4(answer[3]);
            console.log(json);
        }
        else {
            const json = await response.text();
            console.log(json);

        }  
    }

    const handleResults = async (answer) => {
        setSelectedAnswer(answer);      // for assigning each answer's color
        const idToken = await currentUser.getIdToken();
        const response = await fetch(`https://genielicious-1229a.wl.r.appspot.com/client/answer/${mode}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }, body : JSON.stringify({answer: answer})
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
            console.log(json);
        }
    }
            
    const clearSession = async() =>{
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

            {/* question section */}
            <View style={styles.questionContainer}>
                <View style={styles.questionButton}>
                    <Text style={styles.questionText}>{question}</Text>
                </View>
            </View>

            {/* responses section */}
            <View style={styles.responsesContainer}>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[styles.button, selectedAnswer === answer1 && { backgroundColor: Colors.gold }]} 
                        onPress={() => handleResults(answer1)}>
                        <Text style={styles.answerText}>{answer1}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, selectedAnswer === answer2 && { backgroundColor: Colors.gold }]}
                        onPress={() => handleResults(answer2)}>
                        <Text style={styles.answerText}>{answer2}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, selectedAnswer === answer3 && { backgroundColor: Colors.gold }]}
                        onPress={() => handleResults(answer3)}>
                        <Text style={styles.answerText}>{answer3}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, selectedAnswer === answer4 && { backgroundColor: Colors.gold }]}
                        onPress={() => handleResults(answer4)}>
                        <Text style={styles.answerText}>{answer4}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ad area */}
            <View style={styles.adContainer}>
                <View>
                    <BannerAd 
                    size={`480x100`}
                    unitId={TestIds.BANNER} />
                </View>
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
        flexGrow: 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -70,
        marginHorizontal: 20
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
        textAlign: 'center'
        //fontFamily: 'InknutAntiqua-Regular',
    },
    responsesContainer: {
        flex: 0.3,
        alignItems: 'center',
        marginTop: -20
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
        width: '55%',
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