import React, { useState } from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import CheckBox from 'react-native-check-box';
import { Colors } from './Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
//import { FlavorPreferencesContext } from '../../backend/contexts/FlavorPreferencesContext';

export default function Filter({ navigation }) {
    //const { isChecked, setIsChecked, resetPreferences } = useContext(FlavorPreferencesContext);
    const [isChecked, setIsChecked] = useState({
        african: false, breakfast: false, comfortFood: false, desserts: false,
        eastAsian: false, european: false, fingerFood: false, healthConscious: false,
        latinAmerican: false, lightMeals: false, meatCentric: false, middleEastern: false, northAmerican: false,
        quickEats: false, southAsian: false, specialty: false, vegan: false
    });

    const [selectedFavorites, setSelectedFavorites] = useState(false);

    const RadioButton = ({ onPress, label }) => {
        return (
            <TouchableOpacity onPress={onPress} style={styles.radioButtonContainer}>
                <View style={[styles.circle, selectedFavorites && styles.selectedCircle]} />
                <Text style={styles.radioLabel}>{label}</Text>
            </TouchableOpacity>
        );
    };

    const resetCheckbox = () => {
        // lines 30-34 can possibly be replaced with "resetPreferences()" from FlavorPreferencesContext
        // if you wanna try it out, get rid of the comments and delete lines 11-16
        // update: since aliases are now added, you would need to add it in FlavorPreferencesContext
        setIsChecked(prevState => {
            const newState = { ...prevState };
            Object.keys(newState).forEach(key => newState[key] = false);
            return newState;
        });
        setSelectedFavorites(false);
    };

    // once applied, it'll go back to history with the filters 
    const applyFilter = () => {
        // Create an object to hold the selected filters
        const selectedFilters = {
            favorites: selectedFavorites,
            cuisines: Object.keys(isChecked).filter(key => isChecked[key]),
        };
        // Navigate back to History and pass the selected filters
        navigation.navigate('History', { filters: selectedFilters });
    };

    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('History')}
                    style={styles.arrow}>
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={33}
                        color={Colors.ghost}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Filter</Text>
            </View>

            <ScrollView>
                <RadioButton
                    label="Favorites"
                    onPress={() => setSelectedFavorites(!selectedFavorites)}/>
                
                <View style={styles.checkboxContainer}>
                    <Text style={styles.sectionTitle}>
                        Cuisine:
                    </Text>

                    {/* Row 1 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.african}
                            onClick={() => setIsChecked({ ...isChecked, african: !isChecked.african })}
                            rightText='African'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.middleEastern}
                            onClick={() => setIsChecked({ ...isChecked, middleEastern: !isChecked.middleEastern })}
                            rightText='Middle Eastern'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>

                    {/* Row 2 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.eastAsian}
                            onClick={() => setIsChecked({ ...isChecked, eastAsian: !isChecked.eastAsian })}
                            rightText='East Asian'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.southAsian}
                            onClick={() => setIsChecked({ ...isChecked, southAsian: !isChecked.southAsian })}
                            rightText='South Asian'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>

                    {/* Row 3 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.latinAmerican}
                            onClick={() => setIsChecked({ ...isChecked, latinAmerican: !isChecked.latinAmerican })}
                            rightText='Latin American'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.northAmerican}
                            onClick={() => setIsChecked({ ...isChecked, northAmerican: !isChecked.northAmerican })}
                            rightText='North American'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>

                    {/* Row 4 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.european}
                            onClick={() => setIsChecked({ ...isChecked, european: !isChecked.european })}
                            rightText='European'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>
                </View>

                <View style={styles.checkboxContainer}>
                    <Text style={styles.sectionTitle}>
                        Restrictions:
                    </Text>

                    {/* Row 1 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.vegan}
                            onClick={() => setIsChecked({ ...isChecked, vegan: !isChecked.vegan })}
                            rightText='Vegan'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.healthConscious}
                            onClick={() => setIsChecked({ ...isChecked, healthConscious: !isChecked.healthConscious })}
                            rightText='Health-Conscious'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>
                </View>

                <View style={styles.checkboxContainer}>
                    <Text style={styles.sectionTitle}>
                        Meal Time:
                    </Text>

                    {/* Row 1 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.breakfast}
                            onClick={() => setIsChecked({ ...isChecked, breakfast: !isChecked.breakfast })}
                            rightText='Breakfast'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.desserts}
                            onClick={() => setIsChecked({ ...isChecked, desserts: !isChecked.desserts })}
                            rightText='Desserts'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>

                    {/* Row 2 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.lightMeals}
                            onClick={() => setIsChecked({ ...isChecked, lightMeals: !isChecked.lightMeals })}
                            rightText='Light Meals'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.quickEats}
                            onClick={() => setIsChecked({ ...isChecked, quickEats: !isChecked.quickEats })}
                            rightText='Quick Eats'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>

                    {/* Row 3 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.comfortFood}
                            onClick={() => setIsChecked({ ...isChecked, comfortFood: !isChecked.comfortFood })}
                            rightText='Comfort Food'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.specialty}
                            onClick={() => setIsChecked({ ...isChecked, specialty: !isChecked.specialty })}
                            rightText='Specialty'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>

                    {/* Row 4 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.fingerFood}
                            onClick={() => setIsChecked({ ...isChecked, fingerFood: !isChecked.fingerFood })}
                            rightText='Finger Food'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.meatCentric}
                            onClick={() => setIsChecked({ ...isChecked, meatCentric: !isChecked.meatCentric })}
                            rightText='Meat-Centric'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>
                </View>

                {/* Continue Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={resetCheckbox}>  
                        <Text style={styles.buttonText}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={applyFilter}>
                        <Text style={styles.buttonText}>Apply Filter</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.blue
    },
    container: {
        marginHorizontal: 12,
        marginTop: 12,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "center"
    },
    arrow: {
        position: "absolute",
        left: 0
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.ghost,
        marginTop: 2,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 22,
        paddingTop: 20,
        marginBottom: 15
    },
    circle: {
        height: 21,
        width: 21,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.ghost,
        marginRight: 12,
    },
    selectedCircle: {
        backgroundColor: Colors.gold,
    },
    radioLabel: {
        fontSize: 20,
        color: Colors.ghost,
    },
    checkboxContainer: {
        paddingLeft: 22,
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: Colors.ghost,
        marginBottom: 15,
    },
    checkboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    checkbox: {
        flex: 1,
        marginRight: 20,
    },
    checkboxText: {
        fontSize: 20,
        color: Colors.ghost,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
    resetButton: {
        backgroundColor: Colors.ghost,
        width: "40%",
        height: "38%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.raisin,
        alignItems: "center",
        justifyContent: "center"
    },
    applyButton: {
        backgroundColor: Colors.gold,
        width: "40%",
        height: "38%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.raisin,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.raisin,
    },
});