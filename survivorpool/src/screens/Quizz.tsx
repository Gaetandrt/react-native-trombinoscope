import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { vw, vh } from 'react-native-expo-viewport-units';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QuizzProps {
    navigation: any;
}

const Quizz: React.FC<QuizzProps> = ({ navigation }) => {
    const [score, setScore] = useState(0);

    const reset_score = async () => {
        console.log('dedans handleAnswerSelection');
        try {
            await AsyncStorage.setItem('score', '0');
            setScore(0);
            console.log('Score réinitialisé à '+ score + ' !');
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du score :', error);
        }
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#dce4fb', '#d2f2fc', '#d4f3fa', '#d7f4fa', '#bcf5ec', '#cefcf3']}
                style={{ flex: 1 }}
            >
                <View style={{ height: vh(60), paddingHorizontal: 20, paddingTop: 60, alignSelf: 'center' }}>
                    <Image style={{ width: vw(50) }} resizeMode='cover' source={require('../../assets/Logo_Quizz.png')} />
                    <Text style={{ fontSize: 25, color: '#3B4F7D', alignSelf: 'center', marginBottom: 30, fontFamily: 'FredokaOne' }}>Time to play !</Text>

                </View>
                <View style={{ height: vh(15), justifyContent: 'center', paddingHorizontal: 60 }}>
                    <TouchableOpacity onPress={() => {
                        reset_score();
                        navigation.navigate("Game")
                        }}>
                        <Icon name="play-circle" size={120} color="#3B4F7D" style={{alignSelf: 'center'}} />
                    </TouchableOpacity>
                </View>
                <View style={{ height: vh(8), justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20, color: '#3B4F7D', fontFamily: 'FredokaOne', alignSelf: 'center' }}> Play</Text>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
});

export default Quizz;
