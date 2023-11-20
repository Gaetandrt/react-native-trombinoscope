import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity, ImageBackground, ScrollView, Text } from 'react-native';
import { saveEmployeeReal } from '../../services/api';
import { vw, vh } from 'react-native-expo-viewport-units';
import { LinearGradient } from 'expo-linear-gradient';

const PhotoPreviewScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const { photoUri } = route.params;
    const [caption, setCaption] = useState('');

    const handleValidation = async () => {
        if (caption.length > 256) {
            alert('La légende est trop longue');
            return;
        } else if (caption.length === 0) {
            alert('La légende est obligatoire');
            return;
        }

        // Récupération de user_id depuis AsyncStorage
        const userIdString = await AsyncStorage.getItem('userId');
        const user_id = parseInt(userIdString, 10);

        // Vérification pour s'assurer que user_id est un nombre valide
        if (isNaN(user_id)) {
            alert('Erreur lors de la récupération de l\'ID utilisateur.');
            return;
        }

        saveEmployeeReal(caption, user_id, photoUri);
        navigation.navigate('PhotoList'); // Retour à la liste des photos
    };


    return (
        <SafeAreaView>
            <ScrollView>
            <LinearGradient
                colors={['#dce4fb', '#d2f2fc', '#d4f3fa', '#d7f4fa', '#bcf5ec', '#cefcf3']}
                style={{ flex: 1 }}
            >
                <View style={{ height: vh(90)}}>
                <Image source={{ uri: photoUri }} style={styles.photo} />
                <TextInput value={caption} onChangeText={setCaption} style={styles.legends} placeholder="Ajoutez une légende" />
                <TouchableOpacity onPress={handleValidation}>
                    <View style={{ height: vh(5), width: vw(25), borderWidth: 1, borderColor: '#3B4F7D',borderRadius: 20, marginTop: 20, alignSelf: 'center', marginBottom: 20 }}>
                        <Text style={{ fontSize: 20, color: "#3B4F7D", alignSelf: 'center', marginTop: 5, fontWeight: "500"}}>Valider</Text>
                    </View>
                 </TouchableOpacity>
                </View>
            </LinearGradient>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    photo: {
        width: vw(100),
        height: vh(60),
    },
    legends: {
        paddingHorizontal: 15,
        height: vh(8),
        borderColor: '#ddd',
        borderBottomWidth: 1,
    }
});

export default PhotoPreviewScreen;
