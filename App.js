import * as React from 'react';
import { Text, View, AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeContainer from './frontend/WelcomeContainer';
import Profile from './frontend/screens/Profile';
import EditProfile from './frontend/screens/EditProfile';
import { ProfileProvider } from './backend/contexts/ProfileContext';
import { name as appName } from './app.json';
import { AuthProvider } from './backend/contexts/authContext/index';

function App() {
  return(
    <AuthProvider>
      <ProfileProvider>
          <WelcomeContainer/>
      </ProfileProvider>
    </AuthProvider>
    
  );
}

// Register the app component
AppRegistry.registerComponent(appName, () => App);
console.log(appName);
// AppRegistry.registerComponent(appName.toLowerCase(), () => App); // Register lowercase version if needed

export default App;