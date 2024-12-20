import React, {useState} from 'react';
import {Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Dimensions} from 'react-native';
import { Colors } from './Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext'

const { width, height } = Dimensions.get('window');

// const database = getDatabase(app);
const handleProblemReport = async (currentUser, title, urgency, description) => {
    const idToken = await currentUser.getIdToken();
    const response = await fetch(`https://genielicious-1229a.wl.r.appspot.com/submit_bug_report`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }, body : JSON.stringify({bugReportTitle: title, urgency: urgency, description: description})
    });
    if (response.ok) {
        const json = await response.json();
        console.log(json);
    } else {
        const json = await response.text();
        console.log(json);
    }
}
  
export default function ProblemReport({ navigation }) {
    const { currentUser } = useAuth(); // Access currentUser and loading

    //Variables to hold each call
    const [title, setTitle] = React.useState();
    const [problemUrgency, setProblemUrgency] = useState(null);
    const [isChecked, setIsChecked] = useState(null);

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
                        style={styles.inputField}
                        placeholder="Title"
                        placeholderTextColor="#555"
                        color={Colors.raisin}
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
                <View>
                    <TextInput
                        style={styles.descContainers}
                        placeholder="Description"
                        placeholderTextColor="#555"
                        color={Colors.raisin}
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
                            handleProblemReport(currentUser, title, problemUrgency, description);
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
        fontSize: width * 0.05,
        fontWeight: "bold",
        marginLeft: 15,
        marginBottom: 5,
        color: Colors.ghost
    },
    inputContainers: {
        height: height * 0.05,
        width: "92%",
        flexDirection: "row",
        borderWidth: 2,
        borderRadius: 15,
        marginLeft: 15,
        alignItems: "center",
        paddingLeft: 8,
        backgroundColor: Colors.champagne,
        borderColor: Colors.gold
    },
    descContainers: {
        height: height * 0.33,
        width: "92%",
        flexDirection: "row",
        borderWidth: 2,
        borderRadius: 15,
        marginVertical: 6,
        marginLeft: 15,
        paddingLeft: 8,
        backgroundColor: Colors.champagne,
        borderColor: Colors.gold,
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
    inputField: {
        backgroundColor: Colors.champagne,
        flex: 1,
        fontSize: 16,
        flexDirection: 'row',
    },
    saveButton: {
        backgroundColor: Colors.gold,
        marginLeft: 60,
        marginTop: 15,
        marginBottom: 35,
        height: height * 0.07,
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
        marginBottom: 10,
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