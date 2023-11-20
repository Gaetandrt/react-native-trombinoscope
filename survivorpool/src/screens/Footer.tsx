import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './Home';
import Quizz from './Quizz';
import Chat from './Chat';
import Profil from './Profil';
import Interest from './Interest';
import Login from './Login';
import Trombie from './Trombie';
import UserProfil from './UserProfil';
import Game from './QuizzPage/Game1';
import Game2 from './QuizzPage/Game2';
import Game3 from './QuizzPage/Game3';
import Game4 from './QuizzPage/Game4';
import Game5 from './QuizzPage/Game5';
import Game6 from './QuizzPage/Game6';
import Game7 from './QuizzPage/Game7';
import Game8 from './QuizzPage/Game8';
import Game9 from './QuizzPage/Game9';
import Game10 from './QuizzPage/Game10';
import Score from './QuizzPage/Score';
import CameraScreen from './PhotoScreens/CameraScreen';
import PhotoListScreen from './PhotoScreens/PhotoListScreen';
import PhotoPreviewScreen from './PhotoScreens/PhotoPreviewScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NavigationBar: React.FC = () => {
    const Tab = createBottomTabNavigator();
    const PhotoStackNavigator = createNativeStackNavigator();
    const [userId, setUserId] = useState<number>(0);

    const getUserId = () => {
        // Récupération de user_id depuis AsyncStorage
        const userIdString = AsyncStorage.getItem('userId');

        Promise.resolve(userIdString).then((value) => {
            if (value) {
                const user_id = parseInt(value, 10);
                setUserId(user_id);
            }
        });
        console.log('user_id : ' + userId);
    }

    const PhotoTab = () => (
        <PhotoStackNavigator.Navigator initialRouteName="PhotoList">
            <PhotoStackNavigator.Screen name="PhotoList" component={PhotoListScreen} />
            <PhotoStackNavigator.Screen name="Camera" component={CameraScreen} />
            <PhotoStackNavigator.Screen name="PhotoPreview" component={PhotoPreviewScreen} />
        </PhotoStackNavigator.Navigator>
    );

    useEffect(() => {
        getUserId();
    });

    return (
        <Tab.Navigator key={userId}  screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Home') {
                    iconName = "home";
                } else if (route.name === 'PhotoTabs') {
                    iconName = 'images';
                } else if (route.name === 'Quizz') {
                    iconName = 'game-controller';
                } else if (route.name === 'Chat') {
                    iconName = 'chatbubble';
                } else if (route.name === 'Profil') {
                    iconName = 'person';
                }
                return <Ionicons name={iconName} size={20} color={'#3B4F7D'} />;
            },
            headerShown: false,
        })} >
            <Tab.Screen name="Login" component={Login} options={{ tabBarButton: () => null, tabBarStyle: { display: "none" } }} />
            <Tab.Screen name="Trombie" component={Trombie} options={{ tabBarButton: () => null, tabBarStyle: {} }} />
            <Tab.Screen name="Game" component={Game} options={{ tabBarButton: () => null, tabBarStyle: {} }} />
            <Tab.Screen name="Game2" component={Game2} options={{ tabBarButton: () => null, tabBarStyle: {} }} />
            <Tab.Screen name="Game3" component={Game3} options={{ tabBarButton: () => null, tabBarStyle: {} }} />
            <Tab.Screen name="Game4" component={Game4} options={{ tabBarButton: () => null, tabBarStyle: {} }} />
            <Tab.Screen name="Game5" component={Game5} options={{ tabBarButton: () => null, tabBarStyle: {} }} />
            <Tab.Screen name="Game6" component={Game6} options={{ tabBarButton: () => null, tabBarStyle: {} }} />
            <Tab.Screen name="Game7" component={Game7} options={{ tabBarButton: () => null, tabBarStyle: {} }} />
            <Tab.Screen name="Game8" component={Game8} options={{ tabBarButton: () => null, tabBarStyle: {} }} />
            <Tab.Screen name="Game9" component={Game9} options={{ tabBarButton: () => null, tabBarStyle: {} }} />
            <Tab.Screen name="Game10" component={Game10} options={{ tabBarButton: () => null, tabBarStyle: {} }} />
            <Tab.Screen name="Score" component={Score} options={{ tabBarButton: () => null, tabBarStyle: {} }} />
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="PhotoTabs" component={PhotoTab} />
            <Tab.Screen name="Quizz" component={Quizz} />
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="Profil" component={Profil} initialParams={{ userId: userId }} />
            <Tab.Screen name="Interest" component={Interest} options={{ tabBarButton: () => null }} />
            <Tab.Screen name="UserProfil" component={UserProfil} initialParams={{ userId: userId }} options={{ tabBarButton: () => null }} />

        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({

});

export default NavigationBar;
