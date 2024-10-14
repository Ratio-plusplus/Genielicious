import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeContainer from './frontend/WelcomeContainer';
import Profile from './frontend/screens/Profile';
import EditProfile from './frontend/screens/EditProfile';
import { ProfileProvider } from './backend/contexts/ProfileContext';

function App() {
  return(
    <ProfileProvider>
      <WelcomeContainer/>
    </ProfileProvider>
  );
}

export default App;