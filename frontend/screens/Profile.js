import * as React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './Colors';
import { horizontalScale, verticalScale, moderateScale } from './Metrics';
import { width, height, size, fontSize } from "react-native-responsive-sizes";
//const { width, height } = Dimensions.get('window');

export default function Profile({ navigation }) {
    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.container}>
                {/* header section for settings icon */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        onPress={()=>navigation.navigate('Settings')}   //navigate to settings screen if button is pressed
                        style={styles.settingsIcon}>
                        <Ionicons 
                            name="settings-outline"
                            size={size(30)}
                            color={Colors.champagne}/>
                    </TouchableOpacity>
                </View>

                {/* profile section */}
                <View style={styles.profile}>
                    <View style={styles.profileTop}>
                        <View style={styles.avatar}>
                            <Image
                                source={require("../assets/pfp.png")}
                            resizeMode='contain'
                            style={styles.avatarImg}/>
                        </View>

                        {/* name and add preference button */}
                        <View style={styles.profileBody}>
                            <Text style={styles.profileTitle}>Ratio++</Text>
                            <TouchableOpacity style={styles.button} 
                                onPress={()=>navigation.navigate('Add Preference 1')}>  
                                <Text style={styles.profileSubtitle}>Add Preference</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* separator line below the profile section */}
            <View style={styles.lineContainer}>
                <View style={styles.line}/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.blue,
    },
    container: {
        paddingLeft: size(30),
        paddingRight: size(10),
        paddingVertical: size(7),
        flex: 1,
    },
    lineContainer: {
        flex: 1,
        marginTop: height(-38)
    },
    line: {
        backgroundColor: Colors.champagne,
        marginTop: size(12),
        height: height(0.25),
        width: width(400),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: size(8),
        paddingHorizontal: size(12),
    },
    settingsIcon: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    profile: {
        paddingBottom: height(16),
    },
    profileTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: height(16),
    },
    profileBody: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        paddingLeft: width(8),
    },
    profileTitle: {
        fontSize: size(30),
        fontWeight: 'bold',
        lineHeight: size(32),
        color: Colors.champagne,
        marginTop: size(10)
    },
    profileSubtitle: {
        fontSize: size(20),
        fontWeight: '600',
    },
    avatar: {
        position: 'relative',
    },
    avatarImg: {
        width: size(130),
        height: size(130),
        borderRadius: size(9999),
        borderWidth: size(1)
    },
    button: {
        alignItems: 'center',
        backgroundColor: Colors.gold,
        padding: size(10),
        marginTop: size(20),
        width: width(40),
        borderRadius: size(10)
    }
});
