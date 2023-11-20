import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { sethigthscore, gethigthscore } from '../../services/api';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface ScoreProps {
    navigation: any;
}


const ScorePage : React.FC<ScoreProps> = ({ navigation }) => {
  let score: number = 0;
  const [higthscore, setHigthScore] = useState(0);
  const [myBiggestScore, setMyBiggestScore] = useState(0); // État pour stocker la valeur de my_biggest_score
  const [scoreVisible, setScoreVisible] = useState(false);

  const getId = async () => {
    // Récupération de user_id depuis AsyncStorage
    const userIdString = await AsyncStorage.getItem('userId');
    const user_id = parseInt(userIdString, 10);

    // Vérification pour s'assurer que user_id est un nombre valide
    if (isNaN(user_id)) {
        alert('Erreur lors de la récupération de l\'ID utilisateur.');
        return;
    }
    return user_id;
  }

  useEffect(() => {
    const loadScore = async () => {
      try {
        const storedScore = await AsyncStorage.getItem('score');
        score = parseInt(storedScore, 10);
        setHigthScore(score);
      } catch (error) {
        console.error('Erreur lors du chargement du score :', error);
      }
    };

    // Appeler loadScore dès le chargement initial de la page
    loadScore();
  }, []); // Exécuter une seule fois lors du montage du composant

  // Fonction pour attendre que toutes les opérations AsyncStorage soient terminées
  const waitForAsyncStorage = async () => {
    try {
        console.log('dedans waitForAsyncStorage');
      // Définir ici toutes les opérations AsyncStorage que vous souhaitez attendre
      const promises = [AsyncStorage.getItem('score')];

      // Utiliser Promise.all pour attendre que toutes les promesses se résolvent
      const results = await Promise.all(promises);

      // Traitement des résultats ici si nécessaire
      // results[0] correspond au résultat de la première opération AsyncStorage, results[1] à la deuxième, etc.
      
      // Mettre à jour le score avec le résultat
      score = parseInt(results[0], 10);
      setHigthScore(score);
      
      // Afficher le texte du score
      setScoreVisible(true);

      // Appeler my_biggest_score et stocker le résultat dans l'état myBiggestScore
      const highScore = await my_biggest_score();
      setMyBiggestScore(highScore);
    } catch (error) {
      console.error('Erreur lors de l\'attente des opérations AsyncStorage :', error);
    }
  };

  const my_biggest_score = async () => {
    try {
      // Utiliser Promise.all pour attendre que toutes les promesses se résolvent
      console.log('dedans my_biggest_score');
      const highScore = await gethigthscore(await getId());
      return highScore;
    } catch (error) {
      console.error('Erreur lors du chargement du score :', error);
    }
  };

  const jattend = async () => {
    try {
      console.log('----------dedans j attend-----------');
      waitForAsyncStorage();
      console.log("biggest dick", await my_biggest_score());
    } catch (error) {
      console.error('Erreur lors du chargement du score :', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
        jattend()
    }, [])
  );

  return (
    <View style={styles.container}>
    <ExpoLinearGradient
      colors={['#dce4fb', '#d2f2fc', '#d4f3fa', '#d7f4fa', '#bcf5ec', '#cefcf3']}
      style={{ flex: 1 }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Quizz")} style={{paddingHorizontal: 20}}>
        <Icon name="arrow-left" size={30} color="#3B4F7D" style={{ paddingTop: 45 }} />
      </TouchableOpacity>
      <View style={{alignItems: 'center', marginTop: 200}}>
        <Svg xmlns="http://www.w3.org/2000/svg" width={100} height={100} viewBox="0 0 100 100" fill="none">
          <Path
            d="M8.33334 91.6667C8.33334 85.7709 8.33334 82.825 10.1667 81C11.9958 79.1667 14.9417 79.1667 20.8333 79.1667C26.7292 79.1667 29.675 79.1667 31.5 81C33.3333 82.8292 33.3333 85.775 33.3333 91.6667V54.1667C33.3333 48.2709 33.3333 45.325 35.1667 43.5C36.9958 41.6667 39.9417 41.6667 45.8333 41.6667H54.1667C60.0625 41.6667 63.0083 41.6667 64.8333 43.5C66.6667 45.3292 66.6667 48.275 66.6667 54.1667V91.6667V79.1667C66.6667 73.2709 66.6667 70.325 68.5 68.5C70.3292 66.6667 73.275 66.6667 79.1667 66.6667C85.0625 66.6667 88.0083 66.6667 89.8333 68.5C91.6667 70.3292 91.6667 73.275 91.6667 79.1667"
            stroke="url(#paint0_linear_27_144)"
            strokeOpacity={0.8}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <Path
            d="M46.4417 12.5958C48.025 9.75001 48.8167 8.33334 50 8.33334C51.1833 8.33334 51.975 9.75001 53.5583 12.5958L53.9667 13.3292C54.4167 14.1375 54.6417 14.5375 54.9917 14.8042C55.3458 15.0708 55.7833 15.1708 56.6583 15.3667L57.45 15.55C60.525 16.2458 62.0625 16.5917 62.4292 17.7667C62.7958 18.9458 61.7458 20.1708 59.65 22.6208L59.1083 23.2542C58.5125 23.95 58.2125 24.2958 58.0792 24.7292C57.9458 25.1625 57.9917 25.625 58.0792 26.5542L58.1625 27.4C58.4792 30.6708 58.6375 32.3083 57.6833 33.0333C56.725 33.7625 55.2833 33.0958 52.4042 31.7708L51.6625 31.4292C50.8417 31.0542 50.4333 30.8625 50 30.8625C49.5667 30.8625 49.1583 31.0542 48.3375 31.4292L47.5958 31.7708C44.7167 33.0958 43.275 33.7625 42.3167 33.0333C41.3583 32.3083 41.5208 30.6708 41.8375 27.4L41.9208 26.5542C42.0083 25.625 42.0542 25.1625 41.9208 24.7292C41.7875 24.3 41.4875 23.95 40.8917 23.2542L40.35 22.6208C38.2542 20.1708 37.2042 18.9458 37.5708 17.7667C37.9375 16.5917 39.475 16.2458 42.55 15.55L43.3417 15.3667C44.2167 15.1708 44.6542 15.075 45.0083 14.8042C45.3583 14.5375 45.5833 14.1375 46.0333 13.3292L46.4417 12.5958Z"
            stroke="url(#paint1_linear_27_144)"
            strokeOpacity={0.8}
            strokeWidth={4}
          />
          <Defs>
            <LinearGradient id="paint0_linear_27_144" x1="50" y1="41.6667" x2="50" y2="91.6667" gradientUnits="userSpaceOnUse">
              <Stop offset="0.661458" stopColor="#3B4F7D" />
              <Stop offset="1" stopColor="#3B4F7D" stopOpacity="0" />
            </LinearGradient>
            <LinearGradient id="paint1_linear_27_144" x1="50" y1="8.33334" x2="50" y2="33.3337" gradientUnits="userSpaceOnUse">
              <Stop offset="0.661458" stopColor="#3B4F7D" />
              <Stop offset="1" stopColor="#3B4F7D" stopOpacity="0" />
            </LinearGradient>
          </Defs>
        </Svg>
      </View>
      <View style={styles.button}>
        <Text style={styles.scoreText}>Votre Meilleur Score : {myBiggestScore}</Text>
      </View>
      <View style={styles.button}>
        {scoreVisible && <Text style={styles.scoreText}>Votre Score : {higthscore}</Text>
            }
      </View>
      </ExpoLinearGradient>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scoreText: {
    fontSize: 24,
    fontFamily: 'FredokaOne',
    textAlign: 'center',
    marginTop: 10,
    color: '#3B4F7D',
  },
  button: {
    height: 50,
    width: 310,
    backgroundColor: 'white',
    borderRadius: 50,
    paddingHorizontal: 10,
    color: '#3B4F7D',
    alignSelf: 'center',
    marginTop: 50,
  },
});

export default ScorePage;