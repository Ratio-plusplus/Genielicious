import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from './Colors';

export default function Settings({ navigation }) {
    //arrays for setting items that has the icon, text, and navigation action
    const accountItems = [
        {icon: "person-outline", text: "Edit Profile", action: () => navigation.navigate('Edit Profile')},
        {icon: "location-pin", text: "Location Services", action: () => navigation.navigate('Home')},
    ];

    const userDataItems = [
        {icon: "delete-outline", text: "Clear History", action: console.log("Clear")}
    ];

    const actionsItems = [
        {icon: "outlined-flag", text: "Report a Problem", action: console.log("Report")},
        {icon: "logout", text: "Logout", action: console.log("Logout")},
        {icon: "backspace", text: "Delete Account", action: console.log("Delete")}
    ];

    //render each setting item with the corresponding icon, text, and action 
    const renderSettingItem = ({ icon, text, action }) => (
        <TouchableOpacity
            onPress={action}    //this action occurs when the setting item is pressed
            style={styles.settingItems}>
            <MaterialIcons name={icon} size={24} color={Colors.raisin}/>
            <Text style={styles.settingText}>{text}</Text>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.container}>
                    <TouchableOpacity 
                        onPress={()=>navigation.navigate('Profile')}    //navigate back to profile page if back arrow is pressed
                        style={{
                            position: "absolute",
                            left: 0
                        }}>
                        <MaterialIcons
                            name="keyboard-arrow-left"
                            size={33}
                            color={Colors.ghost}
                        />
                    </TouchableOpacity>
                    <Text style={styles.title}>Settings</Text>
            </View>

            <ScrollView style={{marginHorizontal: 15}}>
                {/* account setting section */}
                <View style={{marginBottom: 12}}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.sectionBox}>
                        {
                            accountItems.map((item, index) => (
                                //render each account setting item
                                <React.Fragment key={index}> 
                                    {renderSettingItem(item)}
                                </React.Fragment>
                            ))
                        }
                    </View>
                </View>

                {/* user data setting section */}
                <View style={{marginBottom: 12}}>
                    <Text style={styles.sectionTitle}>User Data</Text>
                    <View style={styles.sectionBox}>
                        {
                            userDataItems.map((item, index) => (
                                //render each user data setting item
                                <React.Fragment key={index}>
                                    {renderSettingItem(item)}
                                </React.Fragment>
                            ))
                        }
                    </View>
                </View>

                {/* actions setting section */}
                <View style={{marginBottom: 12}}>
                    <Text style={styles.sectionTitle}>Actions</Text>
                    <View style={styles.sectionBox}>
                        {
                            actionsItems.map((item, index) => (
                                //render each action setting item
                                <React.Fragment key={index}>
                                    {renderSettingItem(item)}
                                </React.Fragment>
                            ))
                        }
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    settingItems: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingLeft: 12,
    },
    settingText: {
        marginLeft: 36,
        fontWeight: 600,
        fontSize: 16
    },
    background: {
        flex: 1, 
        backgroundColor: Colors.blue
    },
    container: {
        marginHorizontal: 12,
        marginTop: 12,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "center"
    },
    title: {
        marginTop: 2, 
        fontWeight: "bold", 
        fontSize: 22, 
        color: Colors.ghost
    },
    sectionTitle: {
        marginTop: 20, 
        marginVertical: 10, 
        fontWeight: "bold", 
        fontSize: 18, 
        color: Colors.ghost
    },
    sectionBox: {
        borderRadius: 12,
        backgroundColor: Colors.champagne
    },
})