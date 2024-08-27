import * as React from 'react';
import {StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput} from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => alert('This is the "Home" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Home Screen</Text>
        </View>
    );
}