import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Welcome from './screens/Welcome';
import Login from './screens/Login'; 
import Signup from './screens/Signup';
import TabContainer from './TabContainer';

const welcomeName = 'Welcome';
const loginName = 'Login';
const signupName = 'Signup';
const tabName = 'Tab';

const Stack = createNativeStackNavigator();

export default function WelcomeContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={welcomeName} screenOptions={{headerShown: false}}>
        <Stack.Screen name={welcomeName} component={Welcome} />
        <Stack.Screen name={loginName} component={Login} />
        <Stack.Screen name={signupName} component={Signup} />
        <Stack.Screen name={tabName} component={TabContainer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}