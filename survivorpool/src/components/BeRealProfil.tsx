import React from 'react';
import { View, Text, StyleSheet, Platform, ImageBackground } from 'react-native';
import { vw, vh } from 'react-native-expo-viewport-units';

interface BeRealProps {
    url: string;
    legend: string;
}

const BeRealProfil: React.FC<BeRealProps> = ({ url, legend }) => {

    if (url === '')
        return (
            <View style={styles.smallCard}>
                <Text style={styles.text}>{'Pas de photo aujourd\'hui'}</Text>
            </View>);
    return (
        <View style={styles.card}>
            <View style={styles.backgroundContainer}>
                <ImageBackground source={{ uri: url }} style={styles.backgroundImage} >
                    <View style={styles.legend}>
                        <Text style={styles.text}>{legend}</Text>
                    </View>
                </ImageBackground>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        borderRadius: 20,
        resizeMode: 'cover',
        justifyContent: 'flex-end',
    },
    backgroundContainer: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },
    smallCard: {
        padding: 20,
        borderRadius: 20,
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
    card: {
        height: vh(40),
        borderRadius: 20,
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
    text: {
        fontSize: 20,
        color: "#3B4F7D",
        textAlign: 'center',
    },
    legend: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 15,
        paddingLeft: 15,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
});

export default BeRealProfil;
