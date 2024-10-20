import * as React from 'react';
import { StyleSheet, View, Image, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Colors } from './Colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function Question({ navigation }) {
    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.arrowButton}>
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={33}
                        color={Colors.ghost}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.genieContainer}>
                <Image
                    source={require("../../assets/sparkle.png")}
                    style={styles.sparkle}
                    resizeMode="contain"
                />
                <Image
                    source={require("../../assets/chef_content.png")}
                    style={styles.genieImage}
                    resizeMode="contain"
                />
                <Image
                    source={require("../../assets/crystal_ball.png")}
                    style={styles.crystalBall}
                    resizeMode="contain"
                />
            </View>

            {/* Container for the question button */}
            <View style={styles.questionContainer}>
                <TouchableOpacity style={styles.questionButton}>
                    <Text style={styles.questionText}>Are you craving spicy food?</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.modeContainer}>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('History')}>
                        <Text style={styles.profileSubtitle}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('History')}>
                        <Text style={styles.profileSubtitle}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('History')}>
                        <Text style={styles.profileSubtitle}>Maybe</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('History')}>
                        <Text style={styles.profileSubtitle}>Not Sure</Text>
                    </TouchableOpacity>
                </View>
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
        overflow: 'visible'
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
    modeContainer: {
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
});
