import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import CheckBox from 'react-native-check-box';
import { Colors } from './Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
//import { FlavorPreferencesContext } from '../../backend/contexts/FlavorPreferencesContext';

const { width, height } = Dimensions.get('window');

export default function Filter({ navigation }) {
    const route = useRoute();
    const { currentFilters } = route.params || {};

    const [isChecked, setIsChecked] = useState(() => {
        const initialState = {
            'Middle Eastern': false,
            'East Asian': false,
            'South Asian': false,
            'Latin American': false,
            'North American': false,
            'European': false,
            'Vegan': false,
            'Health-Conscious': false,
            'Breakfast': false,
            'Desserts': false,
            'Light Meals': false,
            'Quick Eats': false,
            'Comfort Food': false,
            'Specialty': false,
            'Finger Food': false,
            'Meat-Centric': false,
            'French': false
        };

        if (currentFilters?.cuisines) {
            currentFilters.cuisines.forEach(cuisine => {
                initialState[cuisine] = true;
            });
        }
        return initialState;
    });

    const [selectedFavorites, setSelectedFavorites] = useState(currentFilters?.favorites || false);
    const [selectedSort, setSelectedSort] = useState(currentFilters?.sort || false);

    const RadioButton = ({ onPress, label, isSelected }) => {
        return (
            <TouchableOpacity onPress={onPress} style={styles.radioButtonContainer}>
                <View style={[styles.circle, isSelected && styles.selectedCircle]} />
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
        setSelectedSort(false);
    };

    // once applied, it'll go back to history with the filters 
    const applyFilter = () => {
        const selectedFilters = {
            favorites: selectedFavorites,
            // Only include checked cuisines
            cuisines: Object.entries(isChecked)
                .filter(([_, value]) => value)
                .map(([key, _]) => key),
            sort: selectedSort
        };
        console.log("Applied filters:", selectedFilters);
        navigation.navigate('History', { filters: selectedFilters });
    };

    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('History', { 
                        filters: currentFilters || {  // Keep the previous filters
                            favorites: false,
                            cuisines: [],
                            sort: false
                        }
                    })}
                    style={styles.arrow}>
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={33}
                        color={Colors.ghost}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Filter</Text>
            </View>

            <View style={styles.radioButtonsRow}>
                <RadioButton
                    label="Favorites"
                    isSelected={selectedFavorites}
                    onPress={() => setSelectedFavorites(!selectedFavorites)} />

                <RadioButton
                    label="Sort by Distance"
                    isSelected={selectedSort}
                    onPress={() => setSelectedSort(!selectedSort)} />
            </View>

            <View style={styles.checkboxContainer}>
                <Text style={styles.sectionTitle}>
                    Cuisine:
                </Text>

                {/* Row 1 */}
                <View style={styles.checkboxRow}>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['East Asian']}
                        onClick={() => setIsChecked({ ...isChecked, 'East Asian': !isChecked['East Asian'] })}
                        rightText='East Asian'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['South Asian']}
                        onClick={() => setIsChecked({ ...isChecked, 'South Asian': !isChecked['South Asian'] })}
                        rightText='South Asian'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                </View>

                {/* Row 2 */}
                <View style={styles.checkboxRow}>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['North American']}
                        onClick={() => setIsChecked({ ...isChecked, 'North American': !isChecked['North American'] })}
                        rightText='North American'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['Latin American']}
                        onClick={() => setIsChecked({ ...isChecked, 'Latin American': !isChecked['Latin American'] })}
                        rightText='Latin American'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                </View>

                {/* Row 3 */}
                <View style={styles.checkboxRow}>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['French']}
                        onClick={() => setIsChecked({ ...isChecked, 'French': !isChecked['French'] })}
                        rightText='French'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['European']}
                        onClick={() => setIsChecked({ ...isChecked, 'European': !isChecked['European'] })}
                        rightText='European'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                </View>

                {/* Row 4 */}
                <View style={styles.checkboxRow}>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['Middle Eastern']}
                        onClick={() => setIsChecked({ ...isChecked, 'Middle Eastern': !isChecked['Middle Eastern'] })}
                        rightText='Middle Eastern'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['Specialty']}
                        onClick={() => setIsChecked({ ...isChecked, 'Specialty': !isChecked['Specialty'] })}
                        rightText='Specialty'
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
                        isChecked={isChecked['Vegan']}
                        onClick={() => setIsChecked({ ...isChecked, 'Vegan': !isChecked['Vegan'] })}
                        rightText='Vegan'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['Meat-Centric']}
                        onClick={() => setIsChecked({ ...isChecked, 'Meat-Centric': !isChecked['Meat-Centric'] })}
                        rightText='Meat Centric'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                </View>

                {/* Row 2 */}
                <View style={styles.checkboxRow}>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['Health-Conscious']}
                        onClick={() => setIsChecked({ ...isChecked, 'Health-Conscious': !isChecked['Health-Conscious'] })}
                        rightText='Health Conscious'
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
                        isChecked={isChecked['Breakfast']}
                        onClick={() => setIsChecked({ ...isChecked, 'Breakfast': !isChecked['Breakfast'] })}
                        rightText='Breakfast'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['Desserts']}
                        onClick={() => setIsChecked({ ...isChecked, 'Desserts': !isChecked['Desserts'] })}
                        rightText='Desserts'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                </View>

                {/* Row 2 */}
                <View style={styles.checkboxRow}>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['Light Meals']}
                        onClick={() => setIsChecked({ ...isChecked, 'Light Meals': !isChecked['Light Meals'] })}
                        rightText='Light Meals'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['Quick Eats']}
                        onClick={() => setIsChecked({ ...isChecked, 'Quick Eats': !isChecked['Quick Eats'] })}
                        rightText='Quick Eats'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                </View>

                {/* Row 3 */}
                <View style={styles.checkboxRow}>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['Comfort Food']}
                        onClick={() => setIsChecked({ ...isChecked, 'Comfort Food': !isChecked['Comfort Food'] })}
                        rightText='Comfort Food'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked['Finger Food']}
                        onClick={() => setIsChecked({ ...isChecked, 'Finger Food': !isChecked['Finger Food'] })}
                        rightText='Finger Food'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold} />
                </View>
            </View>

            {/* Reset and Apply Filter Buttons */}
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.blue
    },
    container: {
        marginHorizontal: '5%',
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
    },
    arrow: {
        position: "absolute",
        left: 0
    },
    title: {
        fontSize: width * 0.055,
        fontWeight: 'bold',
        color: Colors.ghost,
        marginTop: 2,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circle: {
        height: width * 0.05,
        width: width * 0.05,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.ghost,
        marginRight: 12,
    },
    selectedCircle: {
        backgroundColor: Colors.gold,
    },
    radioLabel: {
        fontSize: width * 0.045,
        color: Colors.ghost,
    },
    checkboxContainer: {
        paddingLeft: 22,
        paddingTop: '3%',
    },
    sectionTitle: {
        fontSize: width * 0.05,
        fontWeight: "bold",
        color: Colors.ghost,
        marginBottom: 15,
    },
    checkboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '3%',
    },
    checkbox: {
        flex: 1,
        marginRight: '5%',
    },
    checkboxText: {
        fontSize: width * 0.045,
        color: Colors.ghost,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: '3%',
    },
    resetButton: {
        backgroundColor: Colors.ghost,
        width: "35%",
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.raisin,
        alignItems: "center",
        justifyContent: "center"
    },
    applyButton: {
        backgroundColor: Colors.gold,
        width: "35%",
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.raisin,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: Colors.raisin,
    },
    radioButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 22,
        paddingTop: 20,
        marginBottom: 15
    },
});