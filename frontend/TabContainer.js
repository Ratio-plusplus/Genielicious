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
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [focused]);

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-20, 0], // Slide label from left to right
    });

    const opacity = animation;

    return (
        <TouchableOpacity
            style={[
                styles.tabButton,
                focused && { backgroundColor: Colors.gold },
            ]}
            onPress={onPress}
            activeOpacity={1}
        >
            {children}
            {focused && (
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
            )}
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
        display: 'none', // Hide the default tab bar
    },
    tabBar: {
        flexDirection: 'row',
        height: 65,
        position: 'relative',
        bottom: 10,
        marginHorizontal: 20,
        marginVertical: 10,
        backgroundColor: Colors.champagne,
        borderRadius: 40,
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: Colors.yellow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 10,
        borderWidth: 3,
        borderColor: Colors.gold
    },
    tabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 23,
        borderRadius: 40,
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
