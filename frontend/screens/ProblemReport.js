import React, {useState} from 'react';
import {Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import CheckBox from 'react-native-check-box';
import { Colors } from './Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

// const database = getDatabase(app);
  
    export default function ProblemReport ({ navigation }) {
    //Variables to hold each call
    const [title, setTitle] = React.useState();
    const [problemUrgency, setProblemUrgency] = useState(null);
    const [isChecked, setIsChecked] = useState({
        urgencyLevel: {
            low: false,
            med: false,
            high: false,
        }
    });
    const [description, problemDescription] = useState();

    //custom radio button component
    const RadioButton = ({ isSelected, onPress, label }) => {
        return (
            <TouchableOpacity onPress={onPress} style={styles.radioButtonContainer}>
                <View style={[styles.circle, isSelected && styles.selectedCircle]} />
                <Text style={styles.radioLabel}>{label}</Text>
            </TouchableOpacity>
        );
    };

    
    return (
        <SafeAreaView style={styles.background}>
            {/* Back button and title screen */}
            <View style={styles.container}>
                    <TouchableOpacity 
                        onPress={()=>navigation.navigate('Settings')}    //navigate back to profile page if back arrow is pressed
                        style={{
                            position: "absolute",
                            left: 0
                        }}>
                        <MaterialIcons
                            name="keyboard-arrow-left"
                            size={33}
                            color={Colors.ghost}
                        />
                    </TouchableOpacity>
                    <Text style={styles.title}>Report a Problem</Text>
            </View>

             {/* Title box */}
            <View style={{
                flexDirection: "column",
                marginBottom: 10
            }}>
            <Text style={styles.sectionText}>Title:</Text>
                <View style={styles.inputContainers}>
                    <TextInput
                        placeholder="Title"
                        placeholderTextColor="#7C808D"
                        color={Colors.ghost}
                        onChangeText={setTitle}
                        value={title}
                        editable={true}/>
                    </View>
             </View>


             {/* Urgency Level */}
             <View>
                {/* Distance checkbox section */}
                <View style={styles.selectContainer}>
                    <Text style={styles.sectionTitle}>Urgency Level:</Text>
                    <RadioButton
                        label="Low"
                        isSelected={problemUrgency === 'low'}
                        onPress={() => {
                            setProblemUrgency("low");
                            setIsChecked({
                            ...isChecked,
                            urgencyLevel: {
                                low: true,
                                med: false,
                                high: false,
                            }})
                        }
                    }
                    />
                    <RadioButton
                        label="Med"
                        isSelected={problemUrgency === 'med'}
                        onPress={() => {
                            setProblemUrgency("med");
                            setIsChecked({
                            ...isChecked,
                            urgencyLevel: {
                                low: false,
                                med: true,
                                high: false,
                            }})
                        }
                    }
                    />
                    <RadioButton
                        label="High"
                        isSelected={problemUrgency === 'high'}
                        onPress={() => {
                            setProblemUrgency("high");
                            setIsChecked({
                            ...isChecked,
                            urgencyLevel: {
                                low: false,
                                med: false,
                                high: true,
                            }})
                        }
                    }
                    />
                </View>
            </View>
            

            {/*Description for problem*/}
            <View>
                <View style={styles.selectContainer}>
                    <Text style={styles.sectionTitle}>Problem Description:</Text>
                </View>
                <View style={styles.descContainers}>
                    <TextInput
                        placeholder="Description"
                        placeholderTextColor="#7C808D"
                        color={Colors.ghost}
                        onChangeText={problemDescription}
                        value={description}
                        editable={true}
                        multiline={true}    />
                </View>
            </View>

            {/* Submit button */}
            <View>
                <TouchableOpacity style={styles.saveButton}
                        onPress={() =>{ 
                            addToProfile();
                            navigation.navigate('Profile');
                        }}>
                    <Text style={styles.saveText}>Submit</Text>
                </TouchableOpacity>
            </View>  
        </SafeAreaView>
    )
    
}; 


const styles = StyleSheet.create({
    sectionText: {
        fontSize: 22,
        fontWeight: "bold",
        marginLeft: 15,
        marginBottom: 5,
        color: Colors.ghost
    },
    inputContainers: {
        height: 44,
        width: "92%",
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 4,
        marginVertical: 6,
        marginLeft: 15,
        alignItems: "center",
        paddingLeft: 8
    },
    descContainers: {
        height: 300,
        width: "92%",
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 4,
        marginVertical: 6,
        marginLeft: 15,
        alignItems: "center",
        paddingLeft: 8
    },
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
    saveButton: {
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
    saveText: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.raisin
    },
    sectionTitle: {
        fontSize: 22, 
        fontWeight: "bold", 
        color: Colors.ghost, 
        marginBottom: 20,
    },
    selectContainer: {
        paddingLeft: 22,
        paddingTop: 10,
    },
    checkbox: {
        // flex: 1,
        marginRight: 10,
    },
    checkboxText: {
        fontSize: 19, 
        color: Colors.ghost,
    },
    radioButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    circle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.ghost,
        marginRight: 12,
    },
    selectedCircle: {
        backgroundColor: Colors.gold,
    },
    radioLabel: {
        fontSize: 19,
        color: Colors.ghost,
    }
});