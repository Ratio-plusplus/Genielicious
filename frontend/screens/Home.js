import * as React from 'react';
import useLocation from '../../backend/locationPerms/useLocation';
import { useState } from 'react';
import { Colors } from './Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal} from "react-native";
import { FlavorPreferencesContext } from '../contexts/FlavorPreferencesContext';



export default function Home({ navigation }) {
    const {latitude, longitude, errorMsg} = useLocation();
    console.log(latitude, longitude, errorMsg);
    const {setMode, flavorProfiles} = React.useContext(FlavorPreferencesContext);
    const [open, setOpen] = useState(false);    // boolean if the dropdown is open or not
    const [value, setValue] = useState(null);   // holds the selected value (there is none initially)
    const [items, setItems] = useState([
        { label: 'Vegetarian', value: 'vegetarian' },
        { label: 'Spicy Savory', value: 'spicy savory' },
        { label: 'Spicy Vegan', value: 'spicy vegan' },
        { label: 'Gluten Free Desserts', value: 'gluten free desserts' },
        { label: 'Sweet and Sour', value: 'sweet and sour' },
    ]);     // array for all available options in dropdown
            // label (what user sees)
            // value (value associated with that label) - this will update as user click on other options
    const handleMode = async (mode) => {
        setMode(mode);
        navigation.navigate('Question');

    }
    return (
        <SafeAreaView style={styles.background}>
            {/* title */}
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Genielicious</Text>
            </View>

            {/* all the images in the background */}
            <View style={styles.genieContainer}>
                <Image
                    source={require("../assets/sparkle.png")}
                    style={styles.sparkle}
                    resizeMode="contain"
                />
                <Image
                    source={require("../assets/chef_hands_hover.png")}
                    style={styles.genieImage}
                    resizeMode="contain"
                />
                <Image
                    source={require("../assets/crystal_ball.png")}
                    style={styles.crystalBall}
                    resizeMode="contain"
                />
                <Image
                    source={require("../assets/food.png")}
                    style={styles.food}
                    resizeMode="contain"
                />
            </View>

            {/* taste profile dropdown section */}
            <View style={[styles.tasteProfilesContainer, { zIndex: 1000 }]}>
                <Text style={styles.tasteProfilesText}>Taste Profile:</Text>
                <View style={styles.pickerContainer}>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder={'Select a Taste Profile'}
                        zIndex={10000}
                        style={{ backgroundColor: Colors.ghost }}
                        dropDownContainerStyle={{
                            backgroundColor: Colors.ghost,
                            zIndex: 10000,
                        }}
                        dropDownDirection='TOP'
                    />
                </View>
            </View>

            {/* select a mode section */}
            <View style={styles.modeContainer}>
                <Text style={styles.modeText}>Select a Mode:</Text>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleMode('short')}>
                        <Text style={styles.profileSubtitle}>Short</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleMode('medium')}>
                        <Text style={styles.profileSubtitle}>Medium</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleMode('long')}>
                        <Text style={styles.profileSubtitle}>Long</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.blue,
    },
    titleContainer: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: Colors.champagne,
    },
    genieContainer: {
        flex: 0.63,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0, 
    },
    sparkle: {
        position: 'relative',
        width: '200%',
        height: '200%',
    },
    genieImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    crystalBall: {
        position: 'absolute',
        width: '70%',
        height: '70%',
        bottom: '-28%',
        left: '17%',
    },
    food: {
        position: 'absolute',
        width: '27%',
        height: '27%',
        bottom: '10%',
        left: '38%',
    },
    tasteProfilesContainer: {
        flex: 0.1,
        paddingTop: 100,
        paddingLeft: 20,
        zIndex: 1000,
    },
    tasteProfilesText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.champagne,
    },
    pickerContainer: {
        width: '94%',
        paddingTop: 10,
        zIndex: 10000,
    },
    modeContainer: {
        flex: 0.1,
        paddingTop: 40,
        paddingLeft: 20, 
    },
    modeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.champagne,
        marginBottom: 10, 
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        width: '93%', 
        alignItems: 'center', 
    },
    button: {
        alignItems: 'center',
        backgroundColor: Colors.gold,
        padding: 10,
        width: '30%', 
        borderRadius: 10,
        borderColor: Colors.raisin,
        borderWidth: 1
    },
    profileSubtitle: {
        fontSize: 16, 
        color: Colors.raisin, 
    },
});