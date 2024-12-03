import * as React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './Colors';
import { ProfileContext } from '../contexts/ProfileContext';
import { FlavorPreferencesContext } from '../contexts/FlavorPreferencesContext';
import { useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function Profile({ navigation }) {
    const { pfp, username, fetchData } = React.useContext(ProfileContext);
    const { resetPreferences, flavorProfiles, fetchProfiles, activeProfileId } = React.useContext(FlavorPreferencesContext);

    useFocusEffect(
        useCallback(() => {
            fetchData();
            fetchProfiles();
        }, [])
    );

    const renderProfileItem = ({ item }) => {
        const isActiveProfile = item.id === activeProfileId; // Check if this profile is active

        return (
            <TouchableOpacity
                style={[styles.profileIconContainer, isActiveProfile]}
                onPress={() => navigation.navigate('Preference', { 
                    profileData: item, 
                    activeProfileId,
                    isEditMode: true
                })}
            >
                <Image
                    source={item.photoURL ? { uri: item.photoURL } : Image.resolveAssetSource(require('../assets/pfp.png'))}
                    style={[styles.profileIconImage, isActiveProfile && styles.activeProfileIconImage]}
                />
                <Text style={styles.profileIconText}>
                    {item.title || 'Unnamed Profile'}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Settings')}
                        style={styles.settingsIcon}>
                        <Ionicons
                            name="settings-outline"
                            size={30}
                            color={Colors.champagne}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.profile}>
                    <View style={styles.profileTop}>
                        <View style={styles.avatar}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Edit Profile')}>
                                <Image
                                    source={pfp ? { uri: pfp } : Image.resolveAssetSource(require('../assets/pfp.png'))}
                                    resizeMode='contain'
                                    style={styles.avatarImg} />
                            </TouchableOpacity>  
                        </View>

                        {/* name and add taste profile button */}
                        <View style={styles.profileBody}>
                            <Text style={styles.profileTitle}>{username}</Text>
                            <TouchableOpacity style={styles.button}
                                onPress={() => {
                                    resetPreferences();
                                    navigation.navigate('Add Preference 1', {
                                        isEditMode: false
                                    })
                                }}>  
                                
                                <Text style={styles.profileSubtitle}>Add Taste Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.line}/>

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
                <Text style={styles.noProfileText}>No taste profile found. Add one now!</Text>
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
        color: Colors.champagne,
        marginTop: 8
    },
    profileSubtitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    lineContainer: {
        flex: 1,
        marginTop: 10
    },
    line: {
        backgroundColor: Colors.ghost,
        height: 2,
        width: '100%',
    },
    avatar: {
        position: 'relative',
    },
    avatarImg: {
        width: 110,
        height: 110,
        borderRadius: 9999,
        borderWidth: 5,
        borderColor: Colors.raisin
    },
    button: {
        alignItems: 'center',
        backgroundColor: Colors.gold,
        padding: 13,
        marginTop: 15,
        width: '75%',
        borderRadius: 10,
        zIndex: 1,
        shadowColor: Colors.champagne, // Subtle shadow for depth
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 2,
    },
    grid: {
        justifyContent: 'flex-start',
        paddingBottom: 20,
    },
    profileIconContainer: {
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: "33.33%",
    },
    profileIconImage: {
        width: '100%',
        height: 130,
        borderWidth: 1,
    },
    activeProfileIconImage: {
        borderColor: Colors.gold, // Active profile image border color
        borderWidth: 5,
    },
    profileIconText: {
        marginTop: 8,
        fontSize: 14,
        color: Colors.champagne,
    },
    noProfileText: {
        color: Colors.ghost, 
        fontSize: 20, 
        height: '68%', 
        marginLeft: 20 ,
        fontWeight: 'bold',
        marginTop: 10
    }
});
