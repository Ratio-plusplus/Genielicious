import * as React from 'react';
import {StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput} from 'react-native';

export default function History({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('Edit Profile')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>History Screen</Text>
        </View>
    );
}