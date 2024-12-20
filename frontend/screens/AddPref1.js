import React, {useState, useContext, useEffect} from 'react';
import {Text, StyleSheet, View, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import CheckBox from 'react-native-check-box';
import { Colors } from './Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { FlavorPreferencesContext } from '../contexts/FlavorPreferencesContext';
import { useRoute, route } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function AddPref1 ({ navigation }) {
    const route = useRoute();
    const [Dtitle, setDtitle] = useState("New Preference");

    //list of flavor preferences 
    const { isChecked, setIsChecked, resetPreferences } = useContext(FlavorPreferencesContext);
    //get profile data from navigation params
    const { profileData } = route.params || {}; 

    // if profile data is provided, set inital state from it
    useEffect(() => {
        if (profileData) {
            // Populate the fields with the profileData and if there are pre-existing data we will display Edit instead of New
            setIsChecked(profileData);
            setDtitle("Edit Preference")
        } else if (route.params?.savedPreferences) {
            // If we have saved preferences from AddPref2, use those
            setIsChecked(route.params.savedPreferences);
            // Set title based on whether we're editing or creating new
            setDtitle(route.params?.isEditMode ? "Edit Preference" : "New Preference");
        } else {
            // If we aren't editing a pre-existing data then we go back to default
            resetPreferences();
            setDtitle("New Preference")
        }
    }, [profileData, route.params?.savedPreferences, route.params?.isEditMode]);

    return (
    <SafeAreaView style={styles.background}>
        {/* Navigate ot profile page if Back Arrow is pressed */}
        <View style={styles.container}>
                <TouchableOpacity 
                    onPress={()=>navigation.navigate('Profile')}
                    style={styles.arrow}>
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={33}
                        color={Colors.ghost}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>{Dtitle}</Text>
        </View>

        <ScrollView>
            {/* taste preferences section */}
            <View style={styles.checkboxContainer}>
                <Text style={styles.sectionTitle}>
                    Taste Preference:
                </Text>

                {/* row 1: savory and sweet */}
                <View style={styles.checkboxRow}>
                    
                        <CheckBox
                            style={styles.checkbox}
                            isChecked={isChecked.tastePreferences.savory}    //current state
                            onClick={()=>setIsChecked({
                                ...isChecked, 
                                tastePreferences: {
                                    ...isChecked.tastePreferences,
                                    savory: !isChecked.tastePreferences.savory //update only savory
                                }
                            })}   //toggle state
                            rightText='Savory'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold}
                        />
                    
                        <CheckBox 
                            style={styles.checkbox}
                            isChecked={isChecked.tastePreferences.sweet} 
                            onClick={()=>setIsChecked({
                                ...isChecked,
                                tastePreferences: {
                                    ...isChecked.tastePreferences,
                                    sweet: !isChecked.tastePreferences.sweet 
                                }
                            })}
                            rightText='Sweet'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold}/>
                </View>
                        
                {/* row 2: salty and spicy */}
                <View style={styles.checkboxRow}>
                    
                        <CheckBox 
                            style={styles.checkbox}
                            isChecked={isChecked.tastePreferences.salty} 
                            onClick={()=>setIsChecked({
                                ...isChecked, 
                                tastePreferences: {
                                    ...isChecked.tastePreferences,
                                    salty: !isChecked.tastePreferences.salty
                                }
                            })}
                            rightText='Salty'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold}/>

                    
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.tastePreferences.spicy} 
                        onClick={()=>setIsChecked({
                            ...isChecked, 
                            tastePreferences: {
                                ...isChecked.tastePreferences,
                                spicy: !isChecked.tastePreferences.spicy
                            }
                        })}
                        rightText='Spicy'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>

                {/* row 3: bitter and sour */}
                <View style={styles.checkboxRow}>

                
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.tastePreferences.bitter} 
                        onClick={()=>setIsChecked({
                            ...isChecked,
                            tastePreferences: {
                                ...isChecked.tastePreferences,
                                bitter: !isChecked.tastePreferences.bitter
                            }
                        })}
                        rightText='Bitter'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>

                    
                        <CheckBox 
                            style={styles.checkbox}
                            isChecked={isChecked.tastePreferences.sour} 
                            onClick={()=>setIsChecked({
                                ...isChecked,
                                tastePreferences: {
                                    ...isChecked.tastePreferences,
                                    sour: !isChecked.tastePreferences.sour
                                }
                            })}
                            rightText='Sour'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold}/>
                    </View>

                {/* row 4: cool and hot */}
                <View style={styles.checkboxRow}>

                    
                        <CheckBox 
                            style={styles.checkbox}
                            isChecked={isChecked.tastePreferences.cool} 
                            onClick={()=>setIsChecked({
                                ...isChecked,
                                tastePreferences: {
                                    ...isChecked.tastePreferences,
                                    cool: !isChecked.tastePreferences.cool
                                }
                            })}
                            rightText='Cool'
                            rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold}/>
                        
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.tastePreferences.hot} 
                        onClick={()=>setIsChecked({
                            ...isChecked,
                            tastePreferences: {
                                ...isChecked.tastePreferences,
                                hot: !isChecked.tastePreferences.hot
                            }
                        })}
                        rightText='Hot'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>

                </View>
            </View>

            {/* dietary restrictions/allergies section */}
            <View style={styles.checkboxContainer}>
                <Text style={styles.sectionTitle}>
                    Dietary Restrictions/Allergies:
                </Text>

                {/* row 1: vegan and vegetarian */}
                <View style={styles.checkboxRow}>
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked.allergies.vegan} 
                        onClick={()=>setIsChecked({
                            ...isChecked,
                            allergies: {
                                ...isChecked.allergies,
                                vegan: !isChecked.allergies.vegan
                            }
                        })}
                        rightText='Vegan'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.allergies.vegetarian} 
                        onClick={()=>setIsChecked({
                            ...isChecked,
                            allergies: {
                                ...isChecked.allergies,
                                vegetarian: !isChecked.allergies.vegetarian
                            }
                        })}
                        rightText='Vegetarian'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>

                {/* row 2: peanut/tree nut and wheat/gluten */}
                <View style={styles.checkboxRow}>
                    
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.allergies.peanut} 
                        onClick={()=>setIsChecked({
                            ...isChecked,
                            allergies: {
                                ...isChecked.allergies,
                                peanut: !isChecked.allergies.peanut
                            }
                        })}
                        rightText='Peanut/Tree Nut'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.allergies.gluten} 
                        onClick={()=>setIsChecked({
                            ...isChecked,
                            allergies: {
                                ...isChecked.allergies,
                                gluten: !isChecked.allergies.gluten
                            }
                        })}
                        rightText='Wheat/Gluten'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>

                {/* row 3: fish and shellfish */}
                <View style={styles.checkboxRow}>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.allergies.fish} 
                        onClick={()=>setIsChecked({
                            ...isChecked,
                            allergies: {
                                ...isChecked.allergies,
                                fish: !isChecked.allergies.fish
                            }
                        })}
                        rightText='Fish'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>

                    
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.allergies.shellfish} 
                        onClick={()=>setIsChecked({
                            ...isChecked,
                            allergies: {
                                ...isChecked.allergies,
                                shellfish: !isChecked.allergies.shellfish
                            }
                        })}
                        rightText='Shellfish'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>

                {/* row 4: eggs and dairy */}
                <View style={styles.checkboxRow}>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.allergies.eggs} 
                        onClick={()=>setIsChecked({
                            ...isChecked,
                            allergies: {
                                ...isChecked.allergies,
                                eggs: !isChecked.allergies.eggs
                            }
                        })}
                        rightText='Eggs'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>

                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.allergies.dairy} 
                        onClick={()=>setIsChecked({
                            ...isChecked,
                            allergies: {
                                ...isChecked.allergies,
                                dairy: !isChecked.allergies.dairy
                            }
                        })}
                        rightText='Dairy'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>

                {/* row 5: soy and keto */}
                <View style={styles.checkboxRow}>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.allergies.soy} 
                        onClick={()=>setIsChecked({
                            ...isChecked,
                            allergies: {
                                ...isChecked.allergies,
                                soy: !isChecked.allergies.soy
                            }
                        })}
                        rightText='Soy'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>

                    
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.allergies.keto} 
                        onClick={()=>setIsChecked({
                            ...isChecked,
                            allergies: {
                                ...isChecked.allergies,
                                keto: !isChecked.allergies.keto
                            }
                        })}
                        rightText='Keto'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>
            </View>

            {/* continue button and navigate to next page */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.continueButton} 
                    onPress={()=>{
                        try{
                            navigation.navigate('Add Preference 2', { 
                                existingProfileData: profileData,
                                savedDistance: route.params?.savedDistance,
                                savedBudget: route.params?.savedBudget,
                                savedName: route.params?.savedName,
                                savedImage: route.params?.savedImage,
                                isEditMode: profileData ? true : route.params?.isEditMode
                            });           
                        } catch (error) {
                            console.error("Error during navigation: ", error);
                        }
                    }}>  
                    <Text style={styles.buttonText}>Continue</Text>
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
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: Colors.ghost,
        marginTop: 2,
    },
    checkboxContainer: {
        paddingLeft: 22,
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: width * 0.055, 
        fontWeight: "bold", 
        color: Colors.ghost, 
        marginBottom: 20,
    },
    checkboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 20,
    },
    checkbox: {
        flex: 1,
        marginRight: 10,
    },
    checkboxText: {
        fontSize: width * 0.045, 
        color: Colors.ghost,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    continueButton: {
        backgroundColor: Colors.gold,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: -10
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.raisin,
    },
});
