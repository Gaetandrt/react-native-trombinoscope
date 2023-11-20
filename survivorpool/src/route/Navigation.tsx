import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../screens/Login';
import Home from '../screens/Home';
import Trombie from '../screens/Trombie';
import Quizz from '../screens/Quizz';
import Profil from '../screens/Profil';
import CameraScreen from '../screens/PhotoScreens/CameraScreen';
import PhotoListScreen from '../screens/PhotoScreens/PhotoListScreen';
import PhotoPreviewScreen from '../screens/PhotoScreens/PhotoPreviewScreen';
import Chat from '../screens/Chat';

const Tab = createBottomTabNavigator();

const PhotoTabs = () => (
    <Tab.Navigator initialRouteName="PhotoList">
        <Tab.Screen name="PhotoList" component={PhotoListScreen} options={{ tabBarLabel: 'Liste' }} />
        <Tab.Screen name="Camera" component={CameraScreen} options={{ tabBarLabel: 'Caméra' }} />
        <Tab.Screen name="PhotoPreview" component={PhotoPreviewScreen} options={{ tabBarLabel: 'Aperçu' }} />
    </Tab.Navigator>
);

const Stack = createNativeStackNavigator();

const HomeScreens: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Trombie" component={Trombie} />
                <Stack.Screen name="Quizz" component={Quizz} />
                <Stack.Screen name="Chat" component={Chat} />
                <Stack.Screen name="Profil" component={Profil} />
                <Stack.Screen name="PhotoTabs" component={PhotoTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({

});

export default HomeScreens;
