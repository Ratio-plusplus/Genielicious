import * as React from 'react';
import useLocation from '../../backend/locationPerms/useLocation';
import {StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput} from 'react-native';

export default function Home({ navigation }) {
    const {latitude, longitude, errorMsg} = useLocation();
    console.log(latitude, longitude, errorMsg);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('Edit Profile')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Home Screen</Text>
        </View>
    );
}