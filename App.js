import * as React from 'react';
import { Text, View, AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeContainer from './frontend/WelcomeContainer';
import Profile from './frontend/screens/Profile';
import EditProfile from './frontend/screens/EditProfile';
import { ProfileProvider } from './frontend/contexts/ProfileContext';
import { name as appName } from './app.json';
import { AuthProvider, useAuth } from './frontend/contexts/AuthContext';
import { FlavorPreferencesContext, FlavorPreferencesProvider } from './frontend/contexts/FlavorPreferencesContext';
import AddPref1 from './frontend/screens/AddPref1';
import AddPref2 from './frontend/screens/AddPref2';

function App() {
  return(
    
      <AuthProvider>
        <ProfileProvider>
            <FlavorPreferencesProvider>
                <WelcomeContainer>
                    <AddPref1>
                        <AddPref2 />
                    </AddPref1>
                </WelcomeContainer>
            </FlavorPreferencesProvider>
        </ProfileProvider>
      </AuthProvider>
    
    
    
    
  );
}

function AppContent(){
    const {userLoggedIn, loading} = useAuth();


}

// Register the app component
AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent(appName.toLowerCase(), () => App); // Register lowercase version if needed

export default App;