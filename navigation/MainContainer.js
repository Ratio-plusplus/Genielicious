import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// importing screens
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import SettingsScreen from './screens/SettingScreen';

// screens name
const homeName = 'Home';
const detailsName = 'Details';
const settingsName = 'Settings';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
    return(
        <NavigationContainer>
            <Tab.Navigator 
            initialRouteName={homeName}
            screenOptions={({route}) => ({
                tabBarActiveTintColor: '#51aff7',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { paddingBottom: 10, fontSize: 10},
                tabBarStyle: { height: 70, padding: 10 },
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn == homeName) {
                        // icon provided by Ionicons
                        iconName = focused ? 'home' : 'home-outline'
                    }
                    else if (rn == detailsName) {
                        iconName = focused ? 'list' : 'list-outline'
                    }
                    else if (rn == settingsName) {
                        iconName = focused ? 'settings' : 'settings-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>
                }
            })}>
                <Tab.Screen name={homeName} component={HomeScreen}/>
                <Tab.Screen name={detailsName} component={DetailsScreen}/>
                <Tab.Screen name={settingsName} component={SettingsScreen}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}