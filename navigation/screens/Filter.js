import React, { useState } from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import CheckBox from 'react-native-check-box';
import { Colors } from './Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
//import { FlavorPreferencesContext } from '../../backend/contexts/FlavorPreferencesContext';

export default function Filter({ navigation }) {
    //const { isChecked, setIsChecked, resetPreferences } = useContext(FlavorPreferencesContext);
    const [isChecked, setIsChecked] = useState({
        savory: false, sweet: false, salty: false, spicy: false,
        bitter: false, sour: false, cool: false, hot: false,
        vegan: false, vegetarian: false, peanut: false, gluten: false, fish: false,
        shellfish: false, eggs: false, soy: false, dairy: false, keto: false
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
        // (test it out bc i cannot test it on my end, but it should work regardless)
        // if you wanna try it out, get rid of the comments and delete lines 11-16
        setIsChecked(prevState => {
            const newState = { ...prevState };
            Object.keys(newState).forEach(key => newState[key] = false);
            return newState;
        });
        setSelectedFavorites(false);
    };

    const applyFilter = () => {
        navigation.navigate('History'); 
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
                        Taste Preference:
                    </Text>

                    {/* Row 1 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.savory}
                            onClick={() => setIsChecked({ ...isChecked, savory: !isChecked.savory })}
                            rightText='Savory'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.sweet}
                            onClick={() => setIsChecked({ ...isChecked, sweet: !isChecked.sweet })}
                            rightText='Sweet'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>

                    {/* Row 2 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.salty}
                            onClick={() => setIsChecked({ ...isChecked, salty: !isChecked.salty })}
                            rightText='Salty'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.spicy}
                            onClick={() => setIsChecked({ ...isChecked, spicy: !isChecked.spicy })}
                            rightText='Spicy'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>

                    {/* Row 3 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.bitter}
                            onClick={() => setIsChecked({ ...isChecked, bitter: !isChecked.bitter })}
                            rightText='Bitter'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.sour}
                            onClick={() => setIsChecked({ ...isChecked, sour: !isChecked.sour })}
                            rightText='Sour'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>

                    {/* Row 4 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.cool}
                            onClick={() => setIsChecked({ ...isChecked, cool: !isChecked.cool })}
                            rightText='Cool'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.hot}
                            onClick={() => setIsChecked({ ...isChecked, hot: !isChecked.hot })}
                            rightText='Hot'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>
                </View>

                <View style={styles.checkboxContainer}>
                    <Text style={styles.sectionTitle}>
                        Dietary Restrictions/Allergies:
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
                            isChecked={isChecked.vegetarian}
                            onClick={() => setIsChecked({ ...isChecked, vegetarian: !isChecked.vegetarian })}
                            rightText='Vegetarian'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>

                    {/* Row 2 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.peanut}
                            onClick={() => setIsChecked({ ...isChecked, peanut: !isChecked.peanut })}
                            rightText='Peanut/Tree Nut'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.gluten}
                            onClick={() => setIsChecked({ ...isChecked, gluten: !isChecked.gluten })}
                            rightText='Wheat/Gluten'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>

                    {/* Row 3 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.fish}
                            onClick={() => setIsChecked({ ...isChecked, fish: !isChecked.fish })}
                            rightText='Fish'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.shellfish}
                            onClick={() => setIsChecked({ ...isChecked, shellfish: !isChecked.shellfish })}
                            rightText='Shellfish'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>

                    {/* Row 4 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.eggs}
                            onClick={() => setIsChecked({ ...isChecked, eggs: !isChecked.eggs })}
                            rightText='Eggs'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.dairy}
                            onClick={() => setIsChecked({ ...isChecked, dairy: !isChecked.dairy })}
                            rightText='Dairy'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                    </View>

                    {/* Row 5 */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.soy}
                            onClick={() => setIsChecked({ ...isChecked, soy: !isChecked.soy })}
                            rightText='Soy'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold} />
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.keto}
                            onClick={() => setIsChecked({ ...isChecked, keto: !isChecked.keto })}
                            rightText='Keto'
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
        marginBottom: 16
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
        marginBottom: 20,
    },
    checkboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
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
        height: "44%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.raisin,
        alignItems: "center",
        justifyContent: "center"
    },
    applyButton: {
        backgroundColor: Colors.gold,
        width: "40%",
        height: "44%",
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
