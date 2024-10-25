import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput, Modal, FlatList, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, {useState, useContext, useEffect} from 'react';
import { Colors } from './Colors';
import CheckBox from 'react-native-check-box';
import { auth, database } from '../../backend/firebase/firebase';
import { ref, set, push, get } from 'firebase/database';
import { FlavorPreferencesContext } from '../../backend/contexts/FlavorPreferencesContext';
import { useRoute } from '@react-navigation/native';

export default function AddPref2({ navigation }) {
    const initialpfp = Image.resolveAssetSource(require("../assets/pfp.png")).uri;
    const [isModalVisible, setModalVisible] = useState(false)
    const [isPresetModalVisible, setPresetModalVisible] = useState(false)
    const [selectedImage, setSelectedImage] = React.useState(initialpfp);
    const [name, setName] = React.useState();
    const [selectedDistance, setSelectedDistance] = useState(null);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const { isChecked, setIsChecked, addToProfile, updateProfile, fetchProfiles } = useContext(FlavorPreferencesContext) 
    const [showPresetImages, setShowPresetImages] = useState(false)
    const route = useRoute();
    const { existingProfileData } = route.params || {};
    const presetImages = [
        //add in path for any additional preset pictures
        require('../assets/images//Dessert.png'),
        require('../assets/images//Vegetables.png'),
        require('../assets/images//images.jpg'),
        require('../assets/images//images1.jpg'),
        require('../assets/images//images (1).jpg'),
        require('../assets/images//images (2).jpg'),
        require('../assets/images//images (3).jpg'),
        require('../assets/images//images (4).jpg'),
        require('../assets/images//images (5).jpg'),
        require('../assets/images//images (6).jpg'),
        
    ]

    // Allows user to pick an image on their phone
    const handleImageSelection = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,4],
            quality: 1,
        });

        console.log(result);

        setModalVisible(false)

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri)
        }
    };

    const handleCameraCapture = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1
        })
        
        console.log(result)

        if (!result.canceled){
            setSelectedImage(result.assets[0].uri)
        }
    };

    const handleProfilePicturePress = () => {
        setModalVisible(true)
    }

    const selectPresetImage = (image) => {
        setSelectedImage(Image.resolveAssetSource(image).uri)
        setShowPresetImages(false);
        setModalVisible(false) 
        setPresetModalVisible(false)
    }

    //custom radio button component
    const RadioButton = ({ isSelected, onPress, label }) => {
        return (
            <TouchableOpacity onPress={onPress} style={styles.radioButtonContainer}>
                <View style={[styles.circle, isSelected && styles.selectedCircle]} />
                <Text style={styles.radioLabel}>{label}</Text>
            </TouchableOpacity>
        );
    };

    const handleAddPreference = () => {
        const prefName = name;
        const prefImage = selectedImage;
        addToProfile(prefName, prefImage);
    }

    //firebase logic to add or update the profile
    const handleSaveProfile = async () => {
        console.log("handleSaveProfile called"); // Debugging line
        
        const profileData = {
            name: name ?? existingProfileData.name,
            image: selectedImage ?? existingProfileData.image,
            distance: selectedDistance ?? existingProfileData.distance,
            budget: selectedBudget ?? existingProfileData.budget,
            tastePreferences: isChecked.tastePreferences ?? existingProfileData.tastePreferences,
            allergies: isChecked.allergies ?? existingProfileData.allergies,
        };
    
        try {
            if (existingProfileData !== undefined) {
                // If editing an existing profile
                await updateProfile(existingProfileData.id, profileData)
                console.log("Profile updated successfully.");
            } else {
                // If adding a new profile
                await addToProfile(name, selectedImage);
                console.log("Profile added successfully");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
        }

        navigation.navigate('Profile');
    };


    useEffect(() => {
        if(existingProfileData){
            setSelectedImage(existingProfileData.image)
            setName(existingProfileData.name);
            setSelectedBudget(existingProfileData.budget)
            setSelectedDistance(existingProfileData.distance)
        }
    }, [existingProfileData]);

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: Colors.blue,
        }}>
            <View style={{
                marginHorizontal: 12,
                marginTop: 12,
                marginBottom: 12,
                flexDirection: "row",
                justifyContent: "center"}}>
                    <TouchableOpacity 
                        onPress={()=>navigation.navigate('Add Preference 1')}
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
                    <Text style={{marginTop: 2, fontWeight: 600, fontSize: 22, color: Colors.ghost}}>New Preference</Text>
            </View>
            
            {/* button to use the camera */}
            <View style = {{alignItems: 'center', marginBottom: 15, marginTop: 15 }}>
                <TouchableOpacity onPress = {handleCameraCapture} style = {styles.cameraButton}>
                    <Text style = {styles.cameraButtonText}>Take a Picture</Text>
                </TouchableOpacity>
            </View>

            {/* Visual changes for the preference profile picture */}
            <ScrollView>
                <View style={{
                    alignItems: "center",
                    marginTop: 10,
                    marginBottom: 20}}>
                    <TouchableOpacity
                        onPress={handleProfilePicturePress}>
                            {selectedImage ? (
                                <Image 
                                    source={{uri:selectedImage}}
                                    style={{
                                        height: 130,
                                        width: 130,
                                        borderRadius: 85,
                                        borderWidth: 2,
                                        borderColor: "#000"
                                    }}
                                />
                            ) : (
                                <Image 
                                    source={{ uri: initialpfp }} // Fallback image if selectedImage is null
                                    style={{
                                        height: 130,
                                        width: 130,
                                        borderRadius: 85,
                                        borderWidth: 2,
                                        borderColor: "#000",
                                    }}
                                />
                            )}

                        <View style={{
                            position: "absolute",
                            bottom: -5,
                            right: -5,
                            zIndex: 9999
                        }}>
                            <MaterialIcons
                                name="photo-camera"
                                size={32}
                                color={Colors.ghost}/>
                        </View>
                    </TouchableOpacity>
                </View>
                
                {/* Main Modal for selecting images */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Choose an Option</Text>
                            <TouchableOpacity style={styles.modalButton} onPress={handleImageSelection}>
                                <Text style={styles.modalButtonText}>Select from Gallery</Text>
                            </TouchableOpacity>

                            {/* Button to open preset images modal */}
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setPresetModalVisible(true)}>
                                <Text style={styles.modalButtonText}>Select from Preset Images</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Preset Images Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isPresetModalVisible}
                    onRequestClose={() => setPresetModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Preset Images</Text>
                            <FlatList
                                data={presetImages}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => selectPresetImage(item)}>
                                        <Image
                                            source={item}
                                            style={styles.presetImages} // Ensure all images have fixed size
                                        />
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator = {true}
                                numColumns = {3}
                            />
                            <TouchableOpacity onPress={() => setPresetModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                

                {/* Title box */}
                <View>
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
                                onChangeText={setName}
                                value={name || ''}
                                editable={true}/>
                        </View>
                    </View>

                {/* Distance checkbox section */}
                <View style={styles.checkboxContainer}>
                    <Text style={styles.sectionTitle}>Distance:</Text>
                    <RadioButton
                        label="Within 10 miles"
                        isSelected={selectedDistance === "10m"}
                        onPress={() => {
                            setSelectedDistance("10m");
                            setIsChecked((prevState) => ({
                                ...prevState,
                                distance: 10
                            }))
                        }
                    }
                    />
                    <RadioButton
                        label="Within 15 miles"
                        isSelected={selectedDistance === "15m"}
                        onPress={() => {
                            setSelectedDistance("15m");
                            setIsChecked((prevState) => ({
                                ...prevState,
                                distance: 15
                            }))
                        }
                    }
                    />
                    <RadioButton
                        label="Within 20 miles"
                        isSelected={selectedDistance === "20m"}
                        onPress={() => {
                            setSelectedDistance("20m");
                            setIsChecked((prevState) => ({
                                ...prevState,
                                distance: 20
                            }))
                        }
                    }
                    />
                </View>

                {/* Budget Circle Select */}
                <View style={styles.selectContainer}>
                    <Text style={styles.sectionTitle}>Budget:</Text>
                    <RadioButton
                        label="$20"
                        isSelected={selectedBudget === "$20"}
                        onPress={() => {
                            setSelectedBudget("$20");
                            setIsChecked((prevState) => ({
                                ...prevState,
                                budget: 20
                            }))
                        }}       
                    />
                    <RadioButton
                        label="$50"
                        isSelected={selectedBudget === "$50"}
                        onPress={() => {
                            setSelectedBudget("$50");
                            setIsChecked((prevState) => ({
                                ...prevState,
                                budget: 50
                            }))
                        }}
                    />
                </View>
                    <TouchableOpacity style={styles.saveButton}
                        onPress={() => {
                            handleSaveProfile();
                            fetchProfiles();
                            // handleAddPreference();
                            // navigation.navigate('Profile');
                        }}>
                        <Text style={styles.saveText}>Add Preference</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

// Styles
const styles = StyleSheet.create({
    sectionText: {
        fontSize: 22,
        fontWeight: "bold",
        marginLeft: 15,
        marginBottom: 10,
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
    checkboxContainer: {
        paddingLeft: 22,
        paddingTop: 10,
    },
    selectContainer: {
        paddingLeft: 22,
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 22, 
        fontWeight: "bold", 
        color: Colors.ghost, 
        marginBottom: 15,
    },
    checkbox: {
        flex: 1,
        marginRight: 20,
        marginBottom: 16,
    },
    checkboxText: {
        fontSize: 19, 
        color: Colors.ghost,
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
    cameraButton: {
        backgroundColor: Colors.gold,
        padding: 10,
        borderRadius: 6,
    },
    cameraButtonText: {
        color: Colors.raisin,
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: Colors.blue,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: Colors.ghost,
    },
    modalButton: {
        backgroundColor: Colors.gold,
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: Colors.raisin,
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 15,
    },
    cancelButtonText: {
        color: Colors.ghost,
        fontSize: 16,
    },
    presetImages: {
        width: 90,  // Adjust width for 3 images per row
        height: 90, // Keep height consistent
        margin: 5,   // Ensure spacing between images
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ddd',
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
    },
});