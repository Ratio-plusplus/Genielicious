import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput, Modal, FlatList, Dimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useContext, useEffect } from 'react';
import { Colors } from './Colors';
import CheckBox from 'react-native-check-box';
import { FlavorPreferencesContext } from '../contexts/FlavorPreferencesContext';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

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
    const [pageTitle, setPageTitle] = useState("Add New Preference");
    const [buttonTitle, setButtonTitle] = useState("Add Taste Profile");
    const presetImages = [
        //add in path for any additional preset pictures
        require('../assets/images/image 69.png'),
        require('../assets/images/image 78.png'),
        require('../assets/images/image 55.png'),
        require('../assets/images/image 60.png'),
        require('../assets/images/images (1).jpg'),
        require('../assets/images/images (2).jpg'),
        require('../assets/images/images (3).jpg'),
        require('../assets/images/images (4).jpg'),
        require('../assets/images/images (5).jpg'),
        require('../assets/images/images (6).jpg'),
        require('../assets/images/image 11.png'),
        require('../assets/images/image 12.png'),
        require('../assets/images/image 66.png'),
        require('../assets/images/image 68.png'),
        require('../assets/images/image 79.png'),
    ]

    // Allows user to pick an image on their phone
    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        console.log(result);

        setModalVisible(false)

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri)
        }
    };

    const handleProfilePicturePress = () => {
        setModalVisible(true)
    }

    const selectPresetImage = (image) => {
        const resolvedUri = Image.resolveAssetSource(image).uri;
        setSelectedImage(resolvedUri)
        setShowPresetImages(false);
        setModalVisible(false)
        setPresetModalVisible(false)
    }

    //custom radio button component for the budget and distance
    const RadioButton = ({ isSelected, onPress, label }) => {
        return (
            <TouchableOpacity onPress={onPress} style={styles.radioButtonContainer}>
                <View style={[styles.circle, isSelected && styles.selectedCircle]} />
                <Text style={styles.radioLabel}>{label}</Text>
            </TouchableOpacity>
        );
    };

    //firebase logic to add or update the profile
    const handleSaveProfile = async () => {
        console.log("handleSaveProfile called"); // Debugging line

        // We first check to see if there is any pre=existing data and store those values
        const profileData = {
            title: name ?? existingProfileData.name,
            photoURL: selectedImage ?? existingProfileData.image,
            distance: selectedDistance ?? existingProfileData.distance,
            budget: selectedBudget ?? existingProfileData.budget,
            tastePreferences: isChecked.tastePreferences ?? existingProfileData.tastePreferences,
            allergies: isChecked.allergies ?? existingProfileData.allergies,
        };

        // If there is pre-existing data then we edit/update, if not we add a new profile
        try {
            if (existingProfileData && existingProfileData.id) {
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

    // Modify the combined useEffect
    useEffect(() => {
        if (existingProfileData) {
            setSelectedImage(existingProfileData.image)
            setName(existingProfileData.title);
            setSelectedBudget(existingProfileData.budget)
            setSelectedDistance(existingProfileData.distance)
            setPageTitle("Edit Preference")
            setButtonTitle("Update Taste Profile")
        } else if (route.params?.isEditMode) {
            // If we're in edit mode from navigation
            setPageTitle("Edit Preference")
            setButtonTitle("Update Taste Profile")
        } else {
            setPageTitle("Add New Preference")
            setButtonTitle("Add Taste Profile")
        }

        // Add the saved states logic here
        if (route.params?.savedDistance) {
            setSelectedDistance(route.params.savedDistance);
        }
        if (route.params?.savedBudget) {
            setSelectedBudget(route.params.savedBudget);
        }
        if (route.params?.savedName) {
            setName(route.params.savedName);
        }
        if (route.params?.savedImage) {
            setSelectedImage(route.params.savedImage);
        }
    }, [existingProfileData, route.params?.savedDistance, route.params?.savedBudget, 
        route.params?.savedName, route.params?.savedImage, route.params?.isEditMode]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Back button */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Add Preference 1', {
                        savedPreferences: isChecked,
                        savedDistance: selectedDistance,
                        savedBudget: selectedBudget,
                        savedName: name,
                        savedImage: selectedImage,
                        isEditMode: existingProfileData ? true : route.params?.isEditMode
                    })}
                    style={styles.backButton}>
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={33}
                        color={Colors.ghost}
                    />
                </TouchableOpacity>
                <Text style={styles.pageTitle}>{pageTitle}</Text>
            </View>

            {/* Profile Picture Section */}
            <View style={styles.profilePictureContainer}>
                <TouchableOpacity onPress={handleProfilePicturePress}>
                    {selectedImage ? (
                        <Image source={{ uri: selectedImage }} style={styles.profileImage} />
                    ) : (
                        <Image source={{ uri: initialpfp }} style={styles.profileImage} />
                    )}
                    <View style={styles.cameraIconContainer}>
                        <MaterialIcons name="photo-camera" size={28} color={Colors.ghost} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Modals for Image Selection */}
            <Modal animationType="fade" transparent={true} visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Choose an Option</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={handleImageSelection}>
                            <Text style={styles.modalButtonText}>Select from Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => { setModalVisible(false); setPresetModalVisible(true); }}>
                            <Text style={styles.modalButtonText}>Select from Preset Images</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal animationType="fade" transparent={true} visible={isPresetModalVisible} onRequestClose={() => setPresetModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={[styles.modalTitle, { marginBottom: 15 }]}>Preset Images</Text>
                        <FlatList
                            data={presetImages}
                            renderItem={({ item }) => {
                                const resolvedUri = Image.resolveAssetSource(item).uri;
                                const isSelected = resolvedUri === selectedImage;
                                return (
                                    <TouchableOpacity onPress={() => selectPresetImage(item)}>
                                        <Image
                                            source={item}
                                            style={[styles.presetImages, isSelected && { borderWidth: 6, borderColor: "#0989FF" }]}
                                        />
                                    </TouchableOpacity>
                                );
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={true}
                            numColumns={3}
                        />
                        <TouchableOpacity onPress={() => setPresetModalVisible(false)} style={styles.cancelButton}>
                            <Text style={styles.cancelButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Title and other form inputs */}
            <View style={styles.formContainer}>
                <Text style={styles.sectionText}>Title:</Text>
                <TextInput
                    style={styles.inputContainers}
                    placeholder="Title"
                    placeholderTextColor="#7C808D"
                    color={Colors.ghost}
                    onChangeText={setName}
                    value={name || ''}
                    editable={true}
                />
                 {/* Distance checkbox section */}
                 <View style={styles.checkboxContainer}>
                    <Text style={styles.sectionTitle}>Distance:</Text>
                    <RadioButton
                        label="Within 10 miles"
                        isSelected={selectedDistance === 16093}
                        onPress={() => {
                            setSelectedDistance(16093);
                            setIsChecked((prevState) => ({
                                ...prevState,
                                distance: 16093
                            }))
                        }
                        }
                    />
                    <RadioButton
                        label="Within 15 miles"
                        isSelected={selectedDistance === 24140}
                        onPress={() => {
                            setSelectedDistance(24140);
                            setIsChecked((prevState) => ({
                                ...prevState,
                                distance: 24140
                            }))
                        }
                        }
                    />
                    <RadioButton
                        label="Within 20 miles"
                        isSelected={selectedDistance === 32187}
                        onPress={() => {
                            setSelectedDistance(32187);
                            setIsChecked((prevState) => ({
                                ...prevState,
                                distance: 32187
                            }))
                        }
                        }
                    />
                    <RadioButton
                        label="Within 25 miles"
                        isSelected={selectedDistance === 40000}
                        onPress={() => {
                            setSelectedDistance(40000);
                            setIsChecked((prevState) => ({
                                ...prevState,
                                distance: 40000
                            }))
                        }
                        }
                    />
                </View>

                {/* Budget Circle Select */}
                <View style={styles.checkboxContainer}>
                    <Text style={styles.sectionTitle}>Budget:</Text>
                    <RadioButton
                        label="$10 or less"
                        isSelected={selectedBudget === 1}
                        onPress={() => {
                            setSelectedBudget(1);
                            setIsChecked((prevState) => ({
                                ...prevState,
                                budget: 1
                            }))
                        }}
                    />
                    <RadioButton
                        label="$30 or less"
                        isSelected={selectedBudget === 2}
                        onPress={() => {
                            setSelectedBudget(2);
                            setIsChecked((prevState) => ({
                                ...prevState,
                                budget: 2
                            }))
                        }}
                    />
                    <RadioButton
                        label="$60 or less"
                        isSelected={selectedBudget === 3}
                        onPress={() => {
                            setSelectedBudget(3);
                            setIsChecked((prevState) => ({
                                ...prevState,
                                budget: 3
                            }))
                        }}
                    />
                    <RadioButton
                        label="More than $60"
                        isSelected={selectedBudget === 4}
                        onPress={() => {
                            setSelectedBudget(4);
                            setIsChecked((prevState) => ({
                                ...prevState,
                                budget: 4
                            }))
                        }}
                    />
                </View>

                <TouchableOpacity 
                    style={styles.saveButton} 
                    onPress={() => {
                        handleSaveProfile();
                        fetchProfiles();
                    }}>
                    <Text style={styles.saveText}>{buttonTitle}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.blue,
    },
    header: {
        marginHorizontal: width * 0.05,
        marginVertical: height * 0.02,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 0,
    },
    pageTitle: {
        marginTop: 2,
        fontWeight: '600',
        fontSize: width * 0.055, // Scalable font size
        color: Colors.ghost,
    },
    profilePictureContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    profileImage: {
        height: width * 0.3,
        width: width * 0.3,
        borderRadius: 85,
        borderWidth: 3,
        borderColor: Colors.raisin,
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        zIndex: 9999,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: Colors.blue,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: width * 0.8, // Modal width relative to screen size
        borderWidth: 3,
        borderColor: Colors.ghost
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.ghost,
        marginBottom: 10
    },
    modalButton: {
        backgroundColor: Colors.gold,
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: Colors.raisin,
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 10,
        borderRadius: 10,
        marginBottom: -10
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
    formContainer: {
        marginHorizontal: width * 0.05,
    },
    sectionText: {
        color: Colors.ghost,
        fontSize: 16,
        marginBottom: 10,
    },
    inputContainers: {
        borderWidth: 1,
        borderColor: '#fff',
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
        color: Colors.ghost,
        borderRadius: 10
    },
    checkboxContainer: {
        marginBottom: 10,
    },
    sectionTitle: {
        color: Colors.ghost,
        fontSize: 16,
        marginBottom: 5,
    },
    saveButton: {
        backgroundColor: Colors.gold,
        marginLeft: 60,
        height: '9%',
        width: "67%",
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    saveText: {
        color: Colors.raisin,
        fontSize: 16,
        fontWeight: 'bold'
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    circle: {
        height: 18,
        width: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: Colors.ghost,
        marginRight: 10,
    },
    selectedCircle: {
        backgroundColor: Colors.gold,
    },
    radioLabel: {
        fontSize: 16,
        color: Colors.ghost,
    },
    presetImages: {
        width: width * 0.22,  // Adjust width for 3 images per row
        height: width * 0.22, // Keep height consistent
        //margin: 5,   // Ensure spacing between images
        //borderRadius: 15,
        borderWidth: 2,
        borderColor: Colors.ghost,
    },

});
