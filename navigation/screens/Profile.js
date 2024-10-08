import * as React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './Colors';
import { ProfileContext } from './ProfileContext';

export default function Profile({ navigation }) {
    //using context to be able to change the variables from the other files
    const { pfp } = React.useContext(ProfileContext)
    const { username } = React.useContext(ProfileContext)

    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        onPress={()=>navigation.navigate('Settings')}
                        style={styles.settingsIcon}>
                        <Ionicons 
                            name="settings-outline"
                            size={28}
                            color={Colors.champagne}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.profile}>
                    <View style={styles.profileTop}>
                        <View style={styles.avatar}>
                            <Image
                            source={{uri: pfp}} //using pfp from context
                            resizeMode='contain'
                            style={styles.avatarImg}/>
                        </View>
                        <View style={styles.profileBody}>
                            <Text style={styles.profileTitle}>{username}</Text>
                            <TouchableOpacity style={styles.button} 
                                onPress={()=>navigation.navigate('Add Preference 1')}>
                                <Text style={styles.profileSubtitle}>Add Preference</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
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
        paddingLeft: 20,
        paddingRight: 10,
        paddingVertical: 7,
        flex: 1
    },
    lineContainer: {
        flex: 1,
        marginTop: -240
    },
    line: {
        backgroundColor: Colors.champagne,
        marginTop: 12,
        height: 1.5,
        width: 400,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    settingsIcon: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    profile: {
        paddingBottom: 16,
    },
    profileTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    profileBody: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        paddingLeft: 16,
    },
    profileTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        lineHeight: 32,
        color: Colors.champagne,
        marginTop: 8
    },
    profileSubtitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    avatar: {
        position: 'relative',
    },
    avatarImg: {
        width: 110,
        height: 110,
        borderRadius: 9999,
        borderWidth: 1
    },
    button: {
        alignItems: 'center',
        backgroundColor: Colors.gold,
        padding: 10,
        marginTop: 20,
        width: 150,
        borderRadius: 10
    }
});
