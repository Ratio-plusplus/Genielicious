import React, { useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from './screens/Colors';

// importing screens
import Home from './screens/Home';
import Profile from './screens/Profile';
import History from './screens/History';

// Screen names and icons
const homeName = 'Genie';
const profileName = 'Profile';
const historyName = 'History';
const genieIconBlack = require('../frontend/assets/iconGenieDark.png');
const genieIconChampagne = require('../frontend/assets/iconGenieLight.png');

const Tab = createBottomTabNavigator();

const AnimatedTabBarButton = ({ label, children, onPress, focused }) => {
    const animation = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(animation, {
            toValue: focused ? 1 : 0,
            duration: 450,
            useNativeDriver: false,
        }).start();
    }, [focused]);

    const backgroundColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.champagne, Colors.gold],
    });

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-17, 0], // Slide the label in from left
    });

    const opacity = animation;

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={1} style={{ flex: 1 }}>
            <Animated.View
                style={[
                    styles.tabButton,
                    { backgroundColor }, // Animated background
                ]}
            >
                <View style={styles.iconWrapper}>{children}</View>
                <Animated.Text
                    style={[
                        styles.label,
                        {
                            opacity,
                            transform: [{ translateX }],
                        },
                    ]}
                >
                    {label}
                </Animated.Text>
            </Animated.View>
        </TouchableOpacity>
    );
};



export default function TabContainer() {
    return (
        <View style={styles.container}>
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarStyle: styles.hiddenTabBar, // Hidden default tab bar
                    headerShown: false,
                }}
                tabBar={({ state, descriptors, navigation }) => (
                    <View style={styles.tabBar}>
                        {state.routes.map((route, index) => {
                            const label = route.name;
                            const isFocused = state.index === index;

                            const onPress = () => {
                                const event = navigation.emit({
                                    type: 'tabPress',
                                    target: route.key,
                                });

                                if (!isFocused && !event.defaultPrevented) {
                                    navigation.navigate(route.name);
                                }
                            };

                            const icon = () => {
                                if (route.name === profileName) {
                                    return (
                                        <Ionicons
                                            name="person-outline"
                                            size={24}
                                            color={Colors.raisin}
                                        />
                                    );
                                } else if (route.name === homeName) {
                                    return (
                                        <Image
                                            source={genieIconBlack}
                                            style={styles.icon}
                                            resizeMode="contain"
                                        />
                                    );
                                } else if (route.name === historyName) {
                                    return (
                                        <Ionicons
                                            name="book-outline"
                                            size={24}
                                            color={Colors.raisin}
                                        />
                                    );
                                }
                            };

                            return (
                                <AnimatedTabBarButton
                                    key={route.name}
                                    label={label}
                                    onPress={onPress}
                                    focused={isFocused}
                                >
                                    {icon()}
                                </AnimatedTabBarButton>
                            );
                        })}
                    </View>
                )}
            >
                <Tab.Screen name={profileName} component={Profile} />
                <Tab.Screen name={homeName} component={Home} />
                <Tab.Screen name={historyName} component={History} />
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.blue,
    },
    hiddenTabBar: {
        display: 'none',
    },
    tabBar: {
        flexDirection: 'row',
        height: 65,
        marginHorizontal: 20,
        marginBottom: 15,
        marginTop: 7,
        backgroundColor: Colors.champagne,
        borderRadius: 40,
        justifyContent: 'space-evenly', 
        alignItems: 'center',
        shadowColor: Colors.yellow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
        borderWidth: 3,
        borderColor: Colors.gold,
        padding: 8
    },
    tabButton: {
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', 
        borderRadius: 40,
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        marginLeft: 8,
        color: Colors.raisin,
        fontSize: 14,
        fontWeight: '600',
    },
    icon: {
        width: 30,
        height: 30,
    },
});

