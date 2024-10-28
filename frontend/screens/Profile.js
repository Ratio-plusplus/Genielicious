import * as React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './Colors';
import { ProfileContext } from '../contexts/ProfileContext';
import { doSignInWithEmailAndPassword } from '../firebase/auth';
import { FlavorPreferencesContext } from '../contexts/FlavorPreferencesContext';
import { useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';


export default function Profile({ navigation }) {
    //using context to be able to change the variables from the other files
    const { pfp, username, fetchData } = React.useContext(ProfileContext);
    const { resetPreferences, flavorProfiles, fetchProfiles } = React.useContext(FlavorPreferencesContext);
    useFocusEffect(
        useCallback(() => {
            fetchData();
            fetchProfiles();
        }, [])
    );

    const renderProfileItem = ({ item }) => (
        <TouchableOpacity
        style={styles.profileIconContainer}
        onPress={() => navigation.navigate('Add Preference 1', { profileData: item })}>
        <Image
            source={item.photoURL ? {uri: item.photoURL } : Image.resolveAssetSource(require('../assets/pfp.png'))}
            style={styles.profileIconImage}
        />
        <Text style={styles.profileIconText}>
            {item.title || 'Unnamed Profile'}
        </Text>
    </TouchableOpacity>
    );

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
                            size={28}
                            color={Colors.champagne}/>
                    </TouchableOpacity>
                </View>

                {/* profile section */}
                <View style={styles.profile}>
                    <View style={styles.profileTop}>
                        <View style={styles.avatar}>
                            <Image
                            source={pfp ? {uri: pfp} : Image.resolveAssetSource(require('../assets/pfp.png'))} //using pfp from context
                            resizeMode='contain'
                            style={styles.avatarImg}/>
                        </View>

                        {/* name and add preference button */}
                        <View style={styles.profileBody}>
                            <Text style={styles.profileTitle}>{username}</Text>
                            <TouchableOpacity style={styles.button} 
                                onPress={()=> {
                                    resetPreferences();
                                    navigation.navigate('Add Preference 1')
                                }}>  
                                
                                <Text style={styles.profileSubtitle}>Add Preference</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* flavor profiles section */}
            {flavorProfiles.length > 0 ? (
                    <FlatList
                    data={flavorProfiles}
                    renderItem={renderProfileItem}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    contentContainerStyle={styles.grid}
                    style={{ flex: 1  }}
                    />      
            ): (
                <Text style={{color: 'white' }}>No profiles found</Text>
            )}
            
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
        zIndex: 1,
    },
    profile: {
        paddingBottom: 16,
    },
    profileTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
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
        borderRadius: 10,
        zIndex: 1
    }, 
    grid: {
        justifyContent: 'center',
        paddingBottom: 20,
    },
    profileIconContainer: {
        flex: 1,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: "50%",
    },
    profileIconImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
    },
    profileIconText: {
        marginTop: 8,
        fontSize: 14,
        color: Colors.champagne,
    },
});
