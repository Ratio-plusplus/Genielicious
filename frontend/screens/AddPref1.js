import React, {useState} from 'react';
import {Text, StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import CheckBox from 'react-native-check-box';
import { Colors } from './Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
//Initializing and connecting to backend + users 
// import { initializeApp } from 'firebase/app';
import { getAuth }  from '@firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { database, auth } from '../../backend/firebase/firebase';

// const database = getDatabase(app);
  
export default function AddPref1 ({ navigation }) {
    //list of flavor preferences 
    const [isChecked, setIsChecked] = useState({
        tastePreferences: {
            savory: false, 
            sweet: false, 
            salty: false, 
            spicy: false,
            bitter: false, 
            sour: false, 
            cool: false, 
            hot: false
        },
        allergies: {
            vegan: false, 
            vegetarian: false, 
            peanut: false, 
            gluten: false, 
            fish: false,
            shellfish: false, 
            eggs: false, 
            soy: false, 
            dairy: false, 
            keto: false
        },
    });

  //pushes flavor preferences to DBs
  const addToProfile = async () => {
    const user = auth.currentUser;
    if (user) {
        console.log(user.uid)
        //Pushing tastePreferences
        await set(ref(database, 'users/' + user.uid + "/flavorProfile/tastePreference"), {
            savory: isChecked.tastePreferences.savory,
            sweet: isChecked.tastePreferences.sweet,
            salty: isChecked.tastePreferences.salty,
            spicy: isChecked.tastePreferences.spicy,
            bitter: isChecked.tastePreferences.bitter,
            sour: isChecked.tastePreferences.sour,
            cool: isChecked.tastePreferences.cool,
            hot: isChecked.tastePreferences.hot,
        });

        await set(ref(database, 'users/' + user.uid + "/flavorProfile/allergies"), {
            vegan: isChecked.allergies.vegan,
            vegetarian: isChecked.allergies.vegetarian,
            peanut: isChecked.allergies.peanut,
            gluten: isChecked.allergies.gluten,
            fish: isChecked.allergies.fish,
            shellfish: isChecked.allergies.shellfish,
            eggs: isChecked.allergies.eggs,
            soy: isChecked.allergies.soy,
            dairy: isChecked.allergies.dairy,
            keto: isChecked.allergies.keto,
        });

        console.log("Preferences saved successfully");
    } else {
        console.log("No user is signed in.");
    }
  };

  return (
    <SafeAreaView style={styles.background}>
        <View style={styles.container}>
                <TouchableOpacity 
                    onPress={()=>navigation.navigate('Profile')}    //navigate to profile page if back arrow is pressed
                    style={styles.arrow}>
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={33}
                        color={Colors.ghost}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>New Preference</Text>
        </View>

        <ScrollView>
            {/* taste preferences section */}
            <View style={styles.checkboxContainer}>
                <Text style={styles.sectionTitle}>
                    Taste Preference:
                </Text>

                {/* row 1: savory and sweet */}
                <View style={styles.checkboxRow}>
                    <View style = {styles.checkboxItem}>
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
                            // rightText='Savory'
                            // rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold}
                        />
                    <Text style = {styles.checkboxText}>Savory</Text>
                    </View>

                    <View style = {styles.checkboxItem}>
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
                            // rightText='Sweet'
                            // rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold}/>
                            <Text style={styles.checkboxText}>Sweet</Text>
                    </View>
                    
                </View>
                        
                {/* row 2: salty and spicy */}
                <View style={styles.checkboxRow}>
                    <View style = {styles.checkboxItem}>
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
                            // rightText='Salty'
                            // rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold}/>
                            <Text style={styles.checkboxText}>Salty</Text>
                    </View>

                    <View style = {styles.checkboxItem}>
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
                        // rightText='Spicy'
                        // rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                        <Text style={styles.checkboxText}>Spicy</Text>
                    </View>
                </View>

                {/* row 3: bitter and sour */}
                <View style={styles.checkboxRow}>

                <View style = {styles.checkboxItem}>
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
                        // rightText='Bitter'
                        // rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                        <Text style={styles.checkboxText}>Bitter</Text>
                    </View>

                    <View style = {styles.checkboxItem}>
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
                            // rightText='Sour'
                            // rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold}/>
                            <Text style={styles.checkboxText}>Sour</Text>
                    </View>
                </View>

                {/* row 4: cool and hot */}
                <View style={styles.checkboxRow}>

                    <View style = {styles.checkboxItem}>
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
                            // rightText='Cool'
                            // rightTextStyle={styles.checkboxText}
                            uncheckedCheckBoxColor={Colors.ghost}
                            checkedCheckBoxColor={Colors.gold}/>
                            <Text style={styles.checkboxText}>Cool</Text>
                    </View>


                    <View style = {styles.checkboxItem}>    
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
                        // rightText='Hot'
                        // rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                        <Text style={styles.checkboxText}>Hot</Text>
                    </View>
                </View>
            </View>

            {/* dietary restrictions/allergies section */}
            <View style={styles.checkboxContainer}>
                <Text style={styles.sectionTitle}>
                    Dietary Restrictions/Allergies:
                </Text>

                {/* row 1: vegan and vegetarian */}
                <View style={styles.checkboxRow}>

                    <View style = {styles.checkboxItem}>
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
                        // rightText='Vegan'
                        // rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                        <Text style={styles.checkboxText}>Vegan</Text>
                    </View>

                    <View style = {styles.checkboxItem}>
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
                        // rightText='Vegetarian'
                        // rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                        <Text style={styles.checkboxText}>Vegetarian</Text>
                    </View>
                </View>

                {/* row 2: peanut/tree nut and wheat/gluten */}
                <View style={styles.checkboxRow}>
                    <View style = {styles.checkboxItem}>
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
                        // rightText='Peanut/Tree Nut'
                        // rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                        <Text style={styles.checkboxText}>Peanut/Tree Nut</Text>
                    </View>

                    <View style = {styles.checkboxItem}>
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
                        // rightText='Wheat/Gluten'
                        // rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                        <Text style={styles.checkboxText}>Wheat/Gluten</Text>
                    </View>
                </View>

                {/* row 3: fish and shellfish */}
                <View style={styles.checkboxRow}>

                    <View style = {styles.checkboxItem}>
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
                        // rightText='Fish'
                        // rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                        <Text style={styles.checkboxText}>Fish</Text>
                    </View>

                    <View style = {styles.checkboxItem}>
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
                        // rightText='Shellfish'
                        // rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                        <Text style={styles.checkboxText}>Shellfish</Text>
                    </View>
                </View>

                {/* row 4: eggs and dairy */}
                <View style={styles.checkboxRow}>

                    <View style = {styles.checkboxItem}>
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
                        // rightText='Eggs'
                        // rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                        <Text style={styles.checkboxText}>Eggs</Text>
                    </View>

                    <View style = {styles.checkboxItem}>
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
                        // rightText='Dairy'
                        // rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                        <Text style={styles.checkboxText}>Dairy</Text>
                    </View>
                </View>

                {/* row 5: soy and keto */}
                <View style={styles.checkboxRow}>

                    <View style = {styles.checkboxItem}>
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
                        // rightText='Soy'
                        // rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                        <Text style={styles.checkboxText}>Soy</Text>
                    </View>

                    <View style = {styles.checkboxItem}>
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
                        // rightText='Keto'
                        // rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                        <Text style={styles.checkboxText}>Keto</Text>
                    </View>
                </View>
            </View>

            {/* continue button and navigate to next page */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.continueButton} 
                    onPress={()=>{
                        try{
                            addToProfile();
                            navigation.navigate('Add Preference 2') ;           
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
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.ghost,
        marginTop: 2,
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
        marginBottom: 20,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 20,
    },
    checkbox: {
        // flex: 1,
        marginRight: 10,
    },
    checkboxText: {
        fontSize: 19, 
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
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.raisin,
    },
});
