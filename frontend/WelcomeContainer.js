import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './screens/Login'; 
import Signup from './screens/Signup';
import TabContainer from './TabContainer';
import Settings from './screens/Settings';
import EditProfile from './screens/EditProfile';
import ProblemReport from './screens/ProblemReport';
import AddPref1 from './screens/AddPref1';
import AddPref2 from './screens/AddPref2';
import Question from './screens/Question';
import Answer from './screens/Answer';
import Result from './screens/Result';
import DevicePermissions from './screens/DevicePermissions';
import Preference from './screens/Preference';

const loginName = 'Login';
const signupName = 'Signup';
const tabName = 'Tab';
const settingsName = 'Settings';
const editName = 'Edit Profile';
const problemReport = 'Report a Problem'
const add1Name = "Add Preference 1";
const add2Name = "Add Preference 2";
const questionName = "Question";
const answerName = "Answer";
const resultName = "Result";
const devicePerms = "DevicePermissions";
const prefName = "Preference";

const Stack = createNativeStackNavigator();

//navigation between every screens
export default function WelcomeContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={loginName} screenOptions={{headerShown: false}}>
        <Stack.Screen name={loginName} component={Login} />
        <Stack.Screen name={signupName} component={Signup} />
        <Stack.Screen name={tabName} component={TabContainer} />
        <Stack.Screen name={settingsName} component={Settings}/>
        <Stack.Screen name={editName} component={EditProfile}/>
        <Stack.Screen name={problemReport} component={ProblemReport}/>
        <Stack.Screen name={add1Name} component={AddPref1}/>
        <Stack.Screen name={add2Name} component={AddPref2}/>
        <Stack.Screen name={questionName} component={Question}/>
        <Stack.Screen name={answerName} component={Answer}/>
        <Stack.Screen name={resultName} component={Result}/>
        <Stack.Screen name={devicePerms} component={DevicePermissions}/>
        <Stack.Screen name={prefName} component={Preference}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}