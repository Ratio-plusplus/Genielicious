import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeContainer from './navigation/WelcomeContainer';
import { initializeApp } from 'firebase/app';


function App() {
    const app = initializeApp(firebaseConfig);
  return(
    <WelcomeContainer/>
  );
}

export default App;