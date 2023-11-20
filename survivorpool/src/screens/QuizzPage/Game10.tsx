import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSleep from './useSleep';

const NextPage = "Score";
const Question = "Quel est le nom de famille de Emily ?";
const Answer1 = "Brown";
const Answer2 = "Davis";
const Answer3 = "Jones";
const Answer4 = "Clark";


const Game: React.FC<{ navigation: any }> = ({ navigation }) => {
    
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
      );

    const incrementScore = async () => {
        try {
          const currentScore = await AsyncStorage.getItem('score');
          if (currentScore !== null) {
            const newScore = parseInt(currentScore, 10) + 1;
            await AsyncStorage.setItem('score', newScore.toString());
            console.log('score' + newScore);
          }
        } catch (error) {
          console.error('Erreur lors de l\'incrémentation du score :', error);
        }
      }

      const [buttonColor, setButtonColor] = useState('white');
      const [buttonColor2, setButtonColor2] = useState('white');
      const [buttonColor3, setButtonColor3] = useState('white');
      const [buttonColor4, setButtonColor4] = useState('white');
  
      const handleButtonPress = () => {
          setButtonColor('red'); // Change la couleur du bouton en vert
  
          // Définissez un délai pour réinitialiser la couleur après un certain temps (par exemple, 500 ms)
          setTimeout(() => {
              setButtonColor('white'); // Réinitialisez la couleur à la couleur d'origine
              navigation.navigate(NextPage); // Navigation retardée
          }, 500);
      };
  
      const handleButtonPress2 = () => {
          setButtonColor2('red'); // Change la couleur du bouton en vert
  
          // Définissez un délai pour réinitialiser la couleur après un certain temps (par exemple, 500 ms)
          setTimeout(() => {
              setButtonColor2('white'); // Réinitialisez la couleur à la couleur d'origine
              navigation.navigate(NextPage); // Navigation retardée
          }, 500);
      };
  
      const handleButtonPress3 = () => {
          setButtonColor3('green'); // Change la couleur du bouton en vert
  
          // Définissez un délai pour réinitialiser la couleur après un certain temps (par exemple, 500 ms)
          setTimeout(() => {
              setButtonColor3('white'); // Réinitialisez la couleur à la couleur d'origine
              navigation.navigate(NextPage); // Navigation retardée
          }, 500);
      };
  
      const handleButtonPress4 = () => {
          setButtonColor4('red'); // Change la couleur du bouton en vert
  
          // Définissez un délai pour réinitialiser la couleur après un certain temps (par exemple, 500 ms)
          setTimeout(() => {
              setButtonColor4('white'); // Réinitialisez la couleur à la couleur d'origine
              navigation.navigate(NextPage); // Navigation retardée
          }, 500);
      };


    return (

        <View style={styles.container}>
            <LinearGradient
                colors={['#dce4fb', '#d2f2fc', '#d4f3fa', '#d7f4fa', '#bcf5ec', '#cefcf3']}
                style={{ flex: 1 }}
            >
                <View style={{paddingHorizontal: 20}}>
                    <Ionicons name="arrow-back" size={30} color="#3B4F7D" style={{ paddingTop: 45}} onPress={() => navigation.navigate("Quizz")} />
                    <Text style={{fontSize: 30, alignSelf: 'center', color: "#3B4F7D", fontFamily: "FredokaOne"}}>Daily Quest</Text>
                    <View style={{height: vh(20), marginTop: 20, borderRadius: 20, justifyContent: 'center', marginBottom: 10}}>
                        <LinearGradient
                            colors={['#fff', '#fff', '#fff','rgba(255, 255, 255, 0.2)']}
                            style={{ flex: 1, borderRadius: 20, justifyContent: 'center'}}
                        >
                        <Text style={{fontSize: 25, alignSelf: 'center', color: "#3B4F7D", fontFamily: "FredokaOne", textAlign: 'center'}}>{Question}</Text>
                    </LinearGradient>
                    </View>
                    {/* Question 1 */}
                    <TouchableOpacity onPress={() => {
                                    handleButtonPress(),
                                    console.log('incrementScore');
                                    setTimeout(() => {
                                        navigation.navigate(NextPage); // Navigation retardée
                                    }, 300);
                                }} style = {[styles.shadow_1, {backgroundColor: buttonColor}]}>
                            <Text style={styles.Style_text}>{Answer1}</Text>
                    </TouchableOpacity>
                    {/* Question 2 */}
                    <TouchableOpacity onPress={() => {
                                    handleButtonPress2(),
                                    setTimeout(() => {
                                        navigation.navigate(NextPage); // Navigation retardée
                                    }, 300)
                                }} style = {[styles.shadow_2, {backgroundColor: buttonColor2}]}>
                            <Text style={styles.Style_text}>{Answer2}</Text>
                    </TouchableOpacity>
                    {/* Question 3 */}
                    <TouchableOpacity onPress={() => {
                                    handleButtonPress3(),
                                    incrementScore();
                                    setTimeout(() => {
                                        navigation.navigate(NextPage); // Navigation retardée
                                    }, 300)
                                }} style = {[styles.shadow_3, {backgroundColor: buttonColor3}]}>
                            <Text style={styles.Style_text}>{Answer3}</Text>
                    </TouchableOpacity>
                    {/* Question 4 */}
                    <TouchableOpacity onPress={() => {
                                    handleButtonPress4(),
                                    setTimeout(() => {
                                        navigation.navigate(NextPage); // Navigation retardée
                                    }, 300)
                                }} style = {[styles.shadow_4, {backgroundColor: buttonColor4}]}>
                            <Text style={styles.Style_text}>{Answer4}</Text>
                    </TouchableOpacity>
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
    Style_text: {
        fontSize: 25,
        alignSelf: 'center',
        color: "#3B4F7D",
        fontFamily: "FredokaOne"
    },
    shadow: {
        shadowColor: '#000',
        elevation: 5,
        height: vh(10),
        width: vw(90),
        backgroundColor: "white",
        borderRadius: 20, marginTop: 20,
        justifyContent: 'center'
    },
    shadow_1: {
        shadowColor: '#000',
        elevation: 5,
        height: vh(10),
        width: vw(90),
        backgroundColor: "white",
        borderRadius: 20, marginTop: 20,
        justifyContent: 'center'
    },
    shadow_2: {
        shadowColor: '#000',
        elevation: 5,
        height: vh(10),
        width: vw(90),
        backgroundColor: "white",
        borderRadius: 20, marginTop: 20,
        justifyContent: 'center',
    },
    shadow_3: {
        shadowColor: '#000',
        elevation: 5,
        height: vh(10),
        width: vw(90),
        backgroundColor: "white",
        borderRadius: 20, marginTop: 20,
        justifyContent: 'center'
    },
    shadow_4: {
        shadowColor: '#000',
        elevation: 5,
        height: vh(10),
        width: vw(90),
        backgroundColor: "white",
        borderRadius: 20, marginTop: 20,
        justifyContent: 'center'
    },
    Good_Answer : {
        shadowColor: '#000',
        elevation: 5,
        height: vh(10),
        width: vw(90),
        backgroundColor: "green",
        borderRadius: 20, marginTop: 20,
        justifyContent: 'center'
    }

});

export default Game;
