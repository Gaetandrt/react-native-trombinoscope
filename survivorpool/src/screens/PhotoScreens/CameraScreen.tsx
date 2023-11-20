import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import { saveEmployeeImage } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vw, vh } from 'react-native-expo-viewport-units';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const CameraScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.Back);
    const [photoUri, setPhotoUri] = useState(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');

            // Demander la permission d'accéder à la bibliothèque multimédia
            const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
            if (mediaLibraryStatus.status !== 'granted') {
                console.error('La permission MEDIA_LIBRARY a été refusée.');
                return;
            }
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            console.log('Photo captured:', photo);
            setPhotoUri(photo.uri); // Enregistrez l'URI de la photo capturée
            navigation.navigate('PhotoPreview', { photoUri: photo.uri });
        }
    };

    const flipCamera = () => {
        setType(
            type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    };

    const saveToCameraRoll = async () => {
        if (photoUri) {
            const userIdString = await AsyncStorage.getItem('userId');
            if (userIdString) {
                const userId = parseInt(userIdString, 10);
                saveEmployeeImage(userId, photoUri);
            } else {
                console.error("Erreur : userId non trouvé dans le stockage local.");
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Camera style={styles.camera} type={type} ref={cameraRef}/>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.captureButton}
                        onPress={takePicture}
                    >
                        <Icon name="genderless" size={80} color="white"></Icon>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.flipButton}
                        onPress={flipCamera}
                    >
                        <Icon name="refresh" size={50} color="white"></Icon>
                    </TouchableOpacity>
                </View>
            {/* </Camera> */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        // flex: 1,
        position: 'relative',
        height: vh(10),
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        flexDirection: 'row',
        justifyContent: 'center',
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
    },
    captureButton: {
        // backgroundColor: 'white',
        borderRadius: 50,
        // padding: 15,
        paddingHorizontal: 30,
        alignSelf: 'center',
        // margin: 20,
    },
    captureText: {
        fontSize: 18,
        color: 'black',
    },
    flipButton: {
        // backgroundColor: 'white',
        borderRadius: 50,
        // padding: 15,
        paddingHorizontal: 30,
        alignSelf: 'center',
        // margin: 20,
    },
    flipText: {
        fontSize: 18,
        color: 'black',
    },
    saveButton: {
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 15,
        paddingHorizontal: 30,
        alignSelf: 'center',
        margin: 20,
    },
    saveText: {
        fontSize: 18,
        color: 'black',
    },
});

export default CameraScreen;