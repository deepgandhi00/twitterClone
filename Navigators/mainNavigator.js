import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import TweetDetails from '../screens/TweetDetails/TweetDetails';

const MainNavigator = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName="main">
            <Stack.Screen
                name="main"
                component={HomeScreen} />
            <Stack.Screen
                name="details"
                component={TweetDetails}/>
        </Stack.Navigator>
    );
}

export default MainNavigator;