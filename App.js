import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeContainer from './navigation/WelcomeContainer';
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';






function App() {
  return(
    <WelcomeContainer/>
  );
}

export default App;