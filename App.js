import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeContainer from './navigation/WelcomeContainer';
import Profile from './navigation/screens/Profile';
import EditProfile from './navigation/screens/EditProfile';
import { ProfileProvider } from './navigation/screens/ProfileContext';

function App() {
  return(
    <ProfileProvider>
      <WelcomeContainer/>
    </ProfileProvider>
  );
}

export default App;