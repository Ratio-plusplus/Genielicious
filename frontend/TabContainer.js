import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from './screens/Colors';
import { Image } from 'react-native';

// importing screens
import Home from './screens/Home';
import Profile from './screens/Profile';
import History from './screens/History';

// screens name
const homeName = 'Genie';
const profileName = 'Profile';
const historyName = 'History';
const genieIconBlack = require('../frontend/assets/iconGenieDark.png');
const genieIconChampagne = require('../frontend/assets/iconGenieLight.png');


const Tab = createBottomTabNavigator();

//bottom navigation bar for profile, genie, and history screens
export default function TabContainer() {
    return(
            <Tab.Navigator 
            initialRouteName={homeName}
            screenOptions={({route}) => ({
                tabBarActiveTintColor: Colors.raisin,
                tabBarInactiveTintColor: Colors.champagne,
                tabBarLabelStyle: {fontSize: 12},
                tabBarStyle: { height: '10%',  backgroundColor: Colors.blue, borderTopColor: Colors.champagne},
                tabBarItemStyle: {paddingVertical: 5, borderRadius: 20},
                tabBarActiveBackgroundColor: Colors.gold,
                headerShown: false,
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn == profileName) {
                        iconName = focused ? 'person-outline' : 'person-outline'
                    }

                    else if (rn == homeName) {
                        return (
                            <Image
                                source={focused ? genieIconBlack : genieIconChampagne}
                                style={{ width: size, height: size }}
                                resizeMode="contain"
                            />
                        );
                    }

                    else if (rn == historyName) {
                        iconName = focused ? 'book-outline' : 'book-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>
                }
            })}>
                <Tab.Screen name={profileName} component={Profile}/>
                <Tab.Screen name={homeName} component={Home}/>
                <Tab.Screen name={historyName} component={History}/>
 
            </Tab.Navigator>
    );
}