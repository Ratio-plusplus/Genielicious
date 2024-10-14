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
import { REACT_APP_FIREBASE_DATABASE_URL } from "@env";

//manages state of each checkbox item, changed to global so I can push everything at once on the second screen
const appSettings = {
    databaseURL: REACT_APP_FIREBASE_DATABASE_URL
}
// const app = initializeApp(appSettings);
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
  const addToProfile = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const flavorProfileDB = ref(database, 'users/'+user.uid+"/flavorProfile");
    set(flavorProfileDB, {
        prefPage1: isChecked
    });

  }

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
                    <CheckBox
                        style={styles.checkbox}
                        isChecked={isChecked.savory}    //current state
                        onClick={()=>setIsChecked({...isChecked, savory: !isChecked.savory})}   //toggle state
                        rightText='Savory'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.sweet} 
                        onClick={()=>setIsChecked({...isChecked, sweet: !isChecked.sweet})}
                        rightText='Sweet'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>

                {/* row 2: salty and spicy */}
                <View style={styles.checkboxRow}>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.salty} 
                        onClick={()=>setIsChecked({...isChecked, salty: !isChecked.salty})}
                        rightText='Salty'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.spicy} 
                        onClick={()=>setIsChecked({...isChecked, spicy: !isChecked.spicy})}
                        rightText='Spicy'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>

                {/* row 3: bitter and sour */}
                <View style={styles.checkboxRow}>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.bitter} 
                        onClick={()=>setIsChecked({...isChecked, bitter: !isChecked.bitter})}
                        rightText='Bitter'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.sour} 
                        onClick={()=>setIsChecked({...isChecked, sour: !isChecked.sour})}
                        rightText='Sour'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>

                {/* row 4: cool and hot */}
                <View style={styles.checkboxRow}>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.cool} 
                        onClick={()=>setIsChecked({...isChecked, cool: !isChecked.cool})}
                        rightText='Cool'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.hot} 
                        onClick={()=>setIsChecked({...isChecked, hot: !isChecked.hot})}
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
                        isChecked={isChecked.vegan} 
                        onClick={()=>setIsChecked({...isChecked, vegan: !isChecked.vegan})}
                        rightText='Vegan'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.vegetarian} 
                        onClick={()=>setIsChecked({...isChecked, vegetarian: !isChecked.vegetarian})}
                        rightText='Vegetarian'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>

                {/* row 2: peanut/tree nut and wheat/gluten */}
                <View style={styles.checkboxRow}>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.peanut} 
                        onClick={()=>setIsChecked({...isChecked, peanut: !isChecked.peanut})}
                        rightText='Peanut/Tree Nut'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.gluten} 
                        onClick={()=>setIsChecked({...isChecked, gluten: !isChecked.gluten})}
                        rightText='Wheat/Gluten'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>

                {/* row 3: fish and shellfish */}
                <View style={styles.checkboxRow}>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.fish} 
                        onClick={()=>setIsChecked({...isChecked, fish: !isChecked.fish})}
                        rightText='Fish'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.shellfish} 
                        onClick={()=>setIsChecked({...isChecked, shellfish: !isChecked.shellfish})}
                        rightText='Shellfish'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>

                {/* row 4: eggs and dairy */}
                <View style={styles.checkboxRow}>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.eggs} 
                        onClick={()=>setIsChecked({...isChecked, eggs: !isChecked.eggs})}
                        rightText='Eggs'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.dairy} 
                        onClick={()=>setIsChecked({...isChecked, dairy: !isChecked.dairy})}
                        rightText='Dairy'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                </View>

                {/* row 5: soy and keto */}
                <View style={styles.checkboxRow}>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.soy} 
                        onClick={()=>setIsChecked({...isChecked, soy: !isChecked.soy})}
                        rightText='Soy'
                        rightTextStyle={styles.checkboxText}
                        uncheckedCheckBoxColor={Colors.ghost}
                        checkedCheckBoxColor={Colors.gold}/>
                    <CheckBox 
                        style={styles.checkbox}
                        isChecked={isChecked.keto} 
                        onClick={()=>setIsChecked({...isChecked, keto: !isChecked.keto})}
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
                    onClick={addToProfile}
                    onPress={()=>navigation.navigate('Add Preference 2')}>  
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
        marginBottom: 16,
    },
    checkbox: {
        flex: 1,
        marginRight: 20,
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
