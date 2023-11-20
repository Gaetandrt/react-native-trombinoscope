import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './InterestCard';

interface InterestListProps { interest: number[]; }

const InterestList: React.FC<InterestListProps> = ({ interest }) => {
    if (interest.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Auncun intérêt rentré.</Text>
            </View>
        );
    }
    return (
        <View style={styles.interestRow}>
            {interest.map((item, index) => (
                <Card icon={Interest[item].icon} text={Interest[item].name} key={`${item}-${index}`} />
            ))}

        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    text: {
        marginTop: 8,
        fontSize: 20,
        color: "#3B4F7D",
    },
    interestRow: {
        paddingTop: 15,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});

const Interest = [
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

export default InterestList;

