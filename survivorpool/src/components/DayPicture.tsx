import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { vw, vh } from 'react-native-expo-viewport-units';

interface DayPictureProps {
    url: string;
    name: string;
    navigation: any
}

const DayPicture: React.FC<DayPictureProps> = ({ url, name, navigation }) => {
    return (
        <View style={styles.content}>
            <TouchableOpacity onPress={() => navigation.navigate('PhotoTabs')}>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={[styles.text, { fontSize: 24 }]}>Photo{'\n'}du jour</Text>
                        <Text style={[styles.text, { fontSize: 18, color: 'rgba(59,79,125,0.8)' }]}>{name}</Text>
                    </View>
                    <Image source={{ uri: url }} style={styles.picture} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    column: {
        paddingLeft: 50,
        paddingVertical: 25,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    text: {
        color: '#3B4F7D',
        textAlign: 'center',
        fontWeight: '800',
    },
    picture: {
        width: vw(45),
        height: vh(24),
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
});

export default DayPicture;
