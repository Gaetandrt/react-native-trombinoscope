import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { getInterest } from '../services/api';
import { vw, vh } from 'react-native-expo-viewport-units';
import Icon from 'react-native-vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/InterestCard';
import { setEmployeeInterests } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Interest { navigation: any }

const Interest: React.FC<Interest> = ({ navigation }) => {

    let [interest, setSelectedColors] = useState<number[]>([]);
    const [userId, setUserId] = useState<number>(0);

    const fetchUserId = async () => {
        const userIdString = await AsyncStorage.getItem('userId');
        const user_id = parseInt(userIdString, 10);

        // Vérification pour s'assurer que user_id est un nombre valide
        if (isNaN(user_id)) {
            alert('Erreur lors de la récupération de l\'ID utilisateur.');
            return;
        }
        setUserId(user_id);

        const userInterest = await getInterest(parseInt(userIdString));
        setSelectedColors(userInterest);
    }

    useEffect(() => {
        fetchUserId();
    }, []);

    const handleCardClick = (index: number) => {
        if (interest.includes(index)) {
            const updatedInterest = interest.filter((element) => element !== index);
            setSelectedColors(updatedInterest);
        } else if (interest.length < 3) {
            const updatedInterest = [...interest, index];
            setSelectedColors(updatedInterest);
        } else {
            const updatedInterest = interest.slice(1);
            updatedInterest.push(index);
            setSelectedColors(updatedInterest);
        }
    };

    const nextValidation = () => {
        setEmployeeInterests(userId, interest);
        navigation.navigate("Profil")
    };

    var cardComponents: JSX.Element[] = [];
    for (let i = 0; i < 12; i++)
        cardComponents.push(<Card icon={InterestList[i].icon} text={InterestList[i].name} selected={interest.includes(i)}></Card>);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#b5d3f4', '#b2f4de', '#dbd3dc']} style={{ flex: 1 }} >
                <View style={{ height: 20 }}></View>
                <Text style={styles.text}>{"Quels sont vos centres d'intérêts ?"}</Text>
                <View style={styles.warning}>
                    <Icon name='warning' size={24} color='white'></Icon>
                    <Text style={styles.warningText}>{"Maximum 3 centres d'intérêts"}</Text>
                </View >
                <FlatList
                    data={cardComponents}
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>
                            <TouchableOpacity onPress={() => { handleCardClick(index) }}>
                                {item}
                            </TouchableOpacity>
                        </View>
                    )}
                    numColumns={3}
                />
                <TouchableOpacity onPress={nextValidation}>
                    <View style={styles.next}>
                        <Text style={styles.text}>{"Valider"}</Text>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25
    },
    content: {
        flex: 1,
        padding: 16,
    },
    text: {
        padding: 16,
        fontSize: 26,
        color: "#3B4F7D",
        textAlign: 'center',
    },
    warning: {
        borderRadius: 15,
        marginLeft: vw(15),
        marginRight: vw(15),
        marginBottom: vh(3),
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6D6D',
    },
    warningText: {
        padding: 8,
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
    },
    card: {
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    next: {
        borderRadius: 15,
        marginTop: vh(2),
        marginLeft: vw(20),
        marginRight: vw(20),
        marginBottom: vh(2),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
});

const InterestList = [
    { icon: 'paw', name: 'Animaux' },
    { icon: 'film', name: 'Cinéma' },
    { icon: 'futbol', name: 'Sport' },
    { icon: 'music', name: 'Musique' },
    { icon: 'tools', name: 'Bricolage' },
    { icon: 'utensils', name: 'Cuisine' },
    { icon: 'seedling', name: 'Jardinage' },
    { icon: 'paint-brush', name: 'Dessin' },
    { icon: 'dice', name: 'Jeu de société' },
    { icon: 'camera', name: 'Photographie' },
    { icon: 'theater-masks', name: 'Théatre' },
    { icon: 'map-marked-alt', name: 'Voyage' },
]

export default Interest;
