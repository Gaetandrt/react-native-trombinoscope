import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { vw, vh } from 'react-native-expo-viewport-units';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface QuizzMasterProps {
    url: string;
}

const QuizzMaster: React.FC<QuizzMasterProps> = ({ url }) => {
    return (
        <View style={styles.content}>
            <View style={styles.row}>
                <Icon name="crown" size={24} color="#FFD233"></Icon>
                <Text style={{ color: '#3B4F7D', fontWeight: '800', fontSize: 18, marginTop: 8 }}>Maître</Text>
                <View></View>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>Q{"\n"}U{"\n"}I{"\n"}Z</Text>
                <View style={{ width: vw(5) }}></View>
                <Image
                    source={{ uri: url }}
                    style={{ width: vw(30), height: vh(15), borderTopLeftRadius: 15, borderBottomRightRadius: 15 }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        height: vh(20),
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 10,
        paddingTop: 5,
        paddingLeft: 8,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        color: '#3B4F7D',
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 22,
    },
    picture: {
        width: vw(30),
        height: vh(15),
        borderTopLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
});

export default QuizzMaster;
