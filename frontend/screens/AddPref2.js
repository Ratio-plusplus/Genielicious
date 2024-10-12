import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Colors } from './Colors';
import CheckBox from 'react-native-check-box';

export default function AddPref2({ navigation }) {
    const pfp = require("../assets/pfp.png");
    const [selectedImage, setSelectedImage] = React.useState(pfp);
    const [name, setName] = React.useState("");
    const [isChecked, setIsChecked] = useState({
        distance: {
            ten: false,
            fifteen: false,
            twenty: false,
        },
        budget: {
            $: false,
            $$: false,
            $$$: false,
        },
    });

    // Handle image selection
    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    // Update selected option for Distance, ensuring only one is selected
    const handleDistanceSelection = (selectedDistance) => {
        setIsChecked({
            ...isChecked,
            distance: {
                ten: selectedDistance === 'ten',
                fifteen: selectedDistance === 'fifteen',
                twenty: selectedDistance === 'twenty',
            },
        });
    };

    // Update selected option for Budget, ensuring only one is selected
    const handleBudgetSelection = (selectedBudget) => {
        setIsChecked({
            ...isChecked,
            budget: {
                $: selectedBudget === '$',
                $$: selectedBudget === '$$',
                $$$: selectedBudget === '$$$',
            },
        });
    };

    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.container}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Add Preference 1')}
                    style={{
                        position: "absolute",
                        left: 0,
                    }}>
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={33}
                        color={Colors.ghost}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>New Preference</Text>
            </View>

            <ScrollView>
                <View style={styles.scrollContainer}>
                    <TouchableOpacity onPress={handleImageSelection}>
                        <Image 
                            source={{ uri: selectedImage }}
                            style={styles.pfpLook} />

                        <View style={styles.cameraLook}>
                            <MaterialIcons
                                name="photo-camera"
                                size={32}
                                color={Colors.ghost}/>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Title input field */}
                <View style={styles.titleContainer}>
                    <Text style={styles.sectionText}>Title:</Text>
                    <View style={styles.inputContainers}>
                        <TextInput
                            placeholder="Title"
                            placeholderTextColor="#7C808D"
                            color={Colors.ghost}
                            onChangeText={setName}
                            value={name}
                            editable={true}/>
                    </View>
                </View>

                {/* Distance checkbox section */}
                <View style={styles.checkboxContainer}>
                    <Text style={styles.sectionTitle}>Distance:</Text>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked.distance.ten}
                        onClick={() => handleDistanceSelection('ten')}
                        rightText='Within 10 miles'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked.distance.fifteen}
                        onClick={() => handleDistanceSelection('fifteen')}
                        rightText='Within 15 miles'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked.distance.twenty}
                        onClick={() => handleDistanceSelection('twenty')}
                        rightText='Within 20 miles'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>

                {/* Budget checkbox section */}
                <View style={styles.checkboxContainer}>
                    <Text style={styles.sectionTitle}>Budget:</Text>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked.budget['$']}
                        onClick={() => handleBudgetSelection('$')}
                        rightText='$'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked.budget['$$']}
                        onClick={() => handleBudgetSelection('$$')}
                        rightText='$$'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked.budget['$$$']}
                        onClick={() => handleBudgetSelection('$$$')}
                        rightText='$$$'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>

                {/* Add preference button */}
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addText}>Add Preference</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.blue,
    },
    container: {
        marginHorizontal: 12,
        marginTop: 12,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "center"
    },
    title: {
        marginTop: 2, 
        fontWeight: 'bold', 
        fontSize: 22, 
        color: Colors.ghost
    },
    pfpLook: {
        height: 100,
        width: 100,
        borderRadius: 85,
        borderWidth: 2,
        borderColor: "#000"
    },
    cameraLook: {
        position: "absolute",
        bottom: -5,
        right: -5,
        zIndex: 9999
    },
    titleContainer: {
        flexDirection: "column",
        marginBottom: 10
    },
    scrollContainer: {
        alignItems: "center",
        marginBottom: 10
    },
    sectionText: {
        fontSize: 22,
        fontWeight: "bold",
        marginLeft: 20,
        marginBottom: 10,
        color: Colors.ghost
    },
    inputContainers: {
        height: 44,
        width: "89%",
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 4,
        marginLeft: 20,
        alignItems: "center",
        paddingLeft: 8
    },
    checkboxContainer: {
        paddingLeft: 22,
        paddingTop: 5,
    },
    sectionTitle: {
        fontSize: 22, 
        fontWeight: "bold", 
        color: Colors.ghost, 
        marginBottom: 10,
    },
    checkbox: {
        flex: 1,
        marginRight: 20,
        marginBottom: 10,
    },
    checkboxText: {
        fontSize: 19, 
        color: Colors.ghost,
    },
    addButton: {
        backgroundColor: Colors.gold,
        marginLeft: 60,
        marginTop: 20,
        marginBottom: 35,
        height: 50,
        width: "67%",
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    },
    addText: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.raisin
    }
});
