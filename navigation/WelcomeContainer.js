import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './screens/Login'; 
import Signup from './screens/Signup';
import TabContainer from './TabContainer';
import Settings from './screens/Settings';
import EditProfile from './screens/EditProfile';
import AddPref1 from './screens/AddPref1';
import AddPref2 from './screens/AddPref2';

const loginName = 'Login';
const signupName = 'Signup';
const tabName = 'Tab';
const settingsName = 'Settings';
const editName = 'Edit Profile';
const add1Name = "Add Preference 1";
const add2Name = "Add Preference 2";

const Stack = createNativeStackNavigator();

export default function WelcomeContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={loginName} screenOptions={{headerShown: false}}>
        <Stack.Screen name={loginName} component={Login} />
        <Stack.Screen name={signupName} component={Signup} />
        <Stack.Screen name={tabName} component={TabContainer} />
        <Stack.Screen name={settingsName} component={Settings}/>
        <Stack.Screen name={editName} component={EditProfile}/>
        <Stack.Screen name={add1Name} component={AddPref1}/>
        <Stack.Screen name={add2Name} component={AddPref2}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}