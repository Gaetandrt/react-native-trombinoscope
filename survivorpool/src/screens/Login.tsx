import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { loginUser } from '../services/api';
import { vw, vh } from 'react-native-expo-viewport-units';
import Logo from './../../assets/logo_dailyWork.png';
import { useFonts } from 'expo-font';

const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [userError, setUserError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        let regex = RegExp('^((?!\\.)[\\w\\-_.]*[^.])(@\\w+)(\\.\\w+(\\.\\w+)?[^.\\W])$');
        setUserError(!user);
        setPasswordError(!password);

        if (!user || !password) {
            setErrorMessage('Veuillez renseigner un email et un mot de passe.');
            return;
        }
        if (regex.test(user) === false) {
            setErrorMessage('Veuillez renseigner un email valide.');
            setUserError(true);
            return;
        }

        setLoading(true);
        try {
            const data = await loginUser(user, password);
            console.log(data.access_token);
            if (axios.isAxiosError(data)) {
                if (data.response.status === 401) {
                    setErrorMessage(data.response.data.detail);
                } else if (data.response.status === 422) {
                    setErrorMessage(data.response.data.detail[0].msg);
                } else {
                    setErrorMessage('Erreur lors de la connexion. Veuillez réessayer.');
                }
            } else {
                navigation.navigate('Home');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('Erreur de données:', error.response.data);
                    console.error('Statut de l\'erreur:', error.response.status);
                    console.error('Headers de l\'erreur:', error.response.headers);

                    if (error.response.status === 401) {
                        setErrorMessage(error.response.data.detail);
                    } else if (error.response.status === 422) {
                        setErrorMessage(error.response.data.detail[0].msg);
                    } else {
                        setErrorMessage('Erreur lors de la connexion. Veuillez réessayer.');
                    }
                } else {
                    console.error('Erreur de requête:', error.request);
                    setErrorMessage('Erreur lors de la connexion. Veuillez réessayer.');
                }
            } else {
                console.error('Erreur:', error);
                setErrorMessage('Erreur lors de la connexion. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#edfcd4', '#bdfce9', '#bceee8', '#dddbdd', '#b9e9d6', '#dff5e8']}
                style={{ flex: 1 }}
            >
            <View style={{paddingHorizontal: 20}}>
            <Image style={styles.logo} source={Logo} />
            <Text style={styles.welcome}>Daily Work</Text>
            <Text style={styles.slogan}>Connectez-vous à vos collègues !</Text>
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            <TextInput
                placeholder="E-mail"
                placeholderTextColor="rgba(59, 79, 125, 1)"
                style={[styles.input, userError ? styles.inputError : null]}
                value={user}
                onChangeText={setUser}
                />
            <TextInput
                placeholder="Mot de passe"
                placeholderTextColor="rgba(59, 79, 125, 1)"
                secureTextEntry
                style={[styles.input, passwordError ? styles.inputError : null]}
                value={password}
                onChangeText={setPassword}
                />
            <TouchableOpacity onPress={handleLogin}>
                    <View style={styles.button}>
                        <Text style={styles.connectText}>Se connecter</Text>
                    </View>
            </TouchableOpacity>
            {loading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
            </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'white',
        flex: 1,
        // justifyContent: 'flex-start',
        // alignItems: 'center',
        // paddingHorizontal: 20,
        // paddingTop: 50,
    },
    input: {
        height: 45,
        borderColor: 'rgba(59, 79, 125, 0.20)',
        borderBottomWidth: 1,
        marginBottom: 30,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
        width: '100%',
    },
    inputError: {
        borderColor: 'red',
    },
    welcome: {
        fontSize: 28,
        color: '#3B4F7D',
        textAlign: 'center',
        marginBottom: 90,
        fontWeight: '800',
    },
    slogan: {
        position: 'relative',
        top: -86,
        fontSize: 15,
        color: '#3B4F7D',
        textAlign: 'center',
        fontWeight: '500',
    },
    button: {
        height: 42,
        width: 240,
        backgroundColor: 'white',
        marginBottom: 30,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: '#3B4F7D',
        alignSelf: 'center',
        marginTop: 50,
    },
    errorText: {
        color: 'red',
        marginBottom: 30,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 170,
        height: 170,
        marginTop: 80,
        alignSelf: 'center',
        resizeMode: 'cover',
    },
    connectText: {
        color: '#3B4F7D',
        alignSelf: 'center',
        marginTop: 8,
        fontSize: 18,
        fontWeight: '500',
    }
});

export default Login;
