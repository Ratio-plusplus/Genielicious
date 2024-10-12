import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, Dimensions } from 'react-native';
import { Colors } from './screens/Colors';
import { width, height, size, fontSize } from "react-native-responsive-sizes";
//const { width, height } = Dimensions.get('window');

// importing screens
import Home from './screens/Home';
import Profile from './screens/Profile';
import History from './screens/History';

// screens name
const homeName = 'Genie';
const profileName = 'Profile';
const historyName = 'History';

const Tab = createBottomTabNavigator();

// Bottom navigation bar for profile, home, and history screens
export default function TabContainer() {
    const genieIconBlack = require('../frontend/assets/iconGenieDark.png');
    const genieIconChampagne = require('../frontend/assets/iconGenieLight.png');

    return (
        <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: Colors.raisin,
                tabBarInactiveTintColor: Colors.champagne,
                tabBarLabelStyle: { fontSize: size(15) },
                tabBarStyle: {
                    height: height(11),
                    backgroundColor: Colors.blue,
                    borderTopColor: Colors.champagne,
                },
                tabBarItemStyle: { paddingVertical: size(10), borderRadius: size(20) },
                tabBarActiveBackgroundColor: Colors.gold,
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === profileName) {
                        iconName = focused ? 'person-outline' : 'person-outline';
                    }

                    else if (rn === homeName) {
                        return (
                            <Image
                                source={focused ? genieIconBlack : genieIconChampagne}
                                style={{ width: width(7.5), height: height(7.5) }}
                                resizeMode="contain"
                            />
                        );
                    }

                    else if (rn === historyName) {
                        iconName = focused ? 'book-outline' : 'book-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name={profileName} component={Profile} />
            <Tab.Screen name={homeName} component={Home} />
            <Tab.Screen name={historyName} component={History} />
        </Tab.Navigator>
    );
}
