import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from './screens/Colors';

// importing screens
import Home from './screens/Home';
import Profile from './screens/Profile';
import History from './screens/History';

// screens name
const homeName = 'Home';
const profileName = 'Profile';
const historyName = 'History';

const Tab = createBottomTabNavigator();

export default function TabContainer() {
    return(
            <Tab.Navigator 
            initialRouteName={homeName}
            screenOptions={({route}) => ({
                tabBarActiveTintColor: Colors.raisin,
                tabBarInactiveTintColor: Colors.champagne,
                tabBarLabelStyle: {fontSize: 12},
                tabBarStyle: { height: 70,  backgroundColor: Colors.blue, borderTopColor: Colors.champagne},
                tabBarItemStyle: {paddingVertical: 10, borderRadius: 20},
                tabBarActiveBackgroundColor: Colors.gold,
                headerShown: false,
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn == profileName) {
                        iconName = focused ? 'person-outline' : 'person-outline'
                    }

                    else if (rn == homeName) {
                        // icon provided by Ionicons
                        iconName = focused ? 'home-outline' : 'home-outline'
                    }

                    else if (rn == historyName) {
                        // icon provided by Ionicons
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