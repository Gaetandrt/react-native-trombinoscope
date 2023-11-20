import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { vw, vh } from 'react-native-expo-viewport-units';

interface InterestCardProps {
    icon: string;
    text: string;
    selected?: boolean;
}

const InterestCard: React.FC<InterestCardProps> = ({ icon, text, selected = false }) => {
    return (
        <View style={[styles.card, selected ? styles.selectedCard : null]}>
            <Icon name={icon} size={40} color="#3B4F7D" />
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 10,
        width: vw(27),
        height: vh(17),
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',

        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    selectedCard: {
        backgroundColor: '#FFF2C6',
    },
    text: {
        marginTop: 8,
        fontSize: 18,
        color: "#3B4F7D",
        textAlign: 'center',
    },
});

export default InterestCard;
