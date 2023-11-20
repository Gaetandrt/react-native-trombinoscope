import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { vw, vh } from 'react-native-expo-viewport-units';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface EntrepriseMoodProps {
    mood: number;
}

const EntrepriseMood: React.FC<EntrepriseMoodProps> = ({ mood }) => {
    let color = 'grey';
    let text = 'Indéterminé';
    let icon = 'grin-beam-sweat';

    switch (mood) {
        case 1:
            color = '#8ABB8C';
            text = 'Enthousiaste';
            icon = 'grin-squint';
            break;
        case 2:
            color = '#C8D063';
            text = 'Concentré';
            icon = 'grin-alt';
            break;
        case 3:
            color = '#E0B574';
            text = 'Fatigué';
            icon = 'grimace';
            break;
        case 4:
            color = '#FCD5D5';
            text = 'Frustré';
            icon = 'sad-tear';
            break;
        default:
            break;
    }
    return (
        <View style={styles.content}>
            <Text style={styles.text}>Humeur de{"\n"}l'entreprise</Text>
            <View style={{ alignItems: 'center', marginBottom: 10, marginTop: 10 }}>
                <Icon name={icon} size={44} color={color} />
                <Text style={{ color: color }}>{text}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        width: vh(20),
        height: vh(20),
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        justifyContent: 'center',
        margin: 10,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: 22,
        color: '#3B4F7D',
        fontWeight: '800',
        textAlign: 'center',
    },
});

export default EntrepriseMood;
