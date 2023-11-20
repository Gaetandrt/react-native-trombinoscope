import React, { useState, useEffect} from 'react';
import { Employee } from '../../models/Employee';
import { getEmployeesReal, todayBerealExist } from '../../services/api';
import { ActivityIndicator, FlatList, Text, View, Button, StyleSheet, RefreshControl, SafeAreaView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { vw, vh } from 'react-native-expo-viewport-units';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const PhotoListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [hasTodayBereal, setHasTodayBereal] = useState(false);
    const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

    const fetchEmployees = async () => {
        try {
            setLoading(true);

            const employeesReals: Employee[] = await getEmployeesReal();

            if (!Array.isArray(employeesReals)) {
                console.error('Erreur : les données des employés ne sont pas un tableau.');
                return;
            }

            setEmployees(employeesReals);

            // Récupération de user_id depuis AsyncStorage
            const userIdString = await AsyncStorage.getItem('userId');
            const user_id = parseInt(userIdString, 10);

            // Vérification pour s'assurer que user_id est un nombre valide
            if (isNaN(user_id)) {
                alert('Erreur lors de la récupération de l\'ID utilisateur.');
                return;
            }

            setHasTodayBereal(await todayBerealExist(user_id));
        } catch (error) {
            console.error('Erreur lors de la récupération des détails des employés:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchEmployees();
        setRefreshing(false);
    };

    const handleImageLoadStart = (uri: string) => {
        setImageLoading(prevState => ({ ...prevState, [uri]: true }));
    };

    const handleImageLoadEnd = (uri: string) => {
        setImageLoading(prevState => ({ ...prevState, [uri]: false }));
    };

    const renderItem = ({ item }: { item: Employee }) => (
        <TouchableOpacity>
        <View style={styles.carte}>
            {imageLoading[item.realUrl] && <ActivityIndicator size="small" color="#0000ff" />}
            <Image
                source={{ uri: item.realUrl }}
                style={styles.Real}
                onLoadStart={() => handleImageLoadStart(item.realUrl)}
                onLoadEnd={() => handleImageLoadEnd(item.realUrl)}
                onError={() => handleImageLoadEnd(item.realUrl)}
            />
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.Photo}
                onLoadStart={() => handleImageLoadStart(item.imageUrl)}
                onLoadEnd={() => handleImageLoadEnd(item.imageUrl)}
                onError={() => handleImageLoadEnd(item.imageUrl)}
            />
            <Text style={styles.Nom}>{item.name} {item.surname}</Text>
            <Text style={styles.Caption}>{item.realCaption}</Text>
            {/* {imageLoading[item.imageUrl] && <ActivityIndicator size="small" color="#0000ff" />} */}
        </View>
        </TouchableOpacity>
    );

    const handleConfirmation = () => {
        navigation.navigate('Camera');
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#dce4fb', '#d2f2fc', '#d4f3fa', '#d7f4fa', '#bcf5ec', '#cefcf3']}
                style={{ flex: 1 }}
            >

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <FlatList
                    data={employees}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 35, paddingVertical: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    />
                    )}
            {!loading && !hasTodayBereal && <View style={{alignSelf: 'center'}}>
            <TouchableOpacity onPress={handleConfirmation}>
                <View style={{borderWidth: 2, borderRadius: 50, width: vw(19), height: vh(10), borderColor: '#3B4F7D', backgroundColor: 'white',justifyContent: 'center', marginBottom: 5}}>
                    <Icon name="camera" size={25} color="#3B4F7D" style={{alignSelf: 'center'}}></Icon>
                </View>
            </TouchableOpacity>
            </View>}
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    titre: {
        fontSize: 35,
        color: '#3B4F7D',
        marginBottom: 40,
    },
    carte: {
        height: vh(25),
        width: vw(34),
        borderRadius: 20,
        marginRight: 20,
        justifyContent: 'flex-end',
    },
    Photo: {
        width: vw(10),
        height: vh(5),
        borderRadius: 20,
        marginBottom: 10,
        marginLeft: 6,
        position: 'absolute',
        top: 6,
    },
    Real: {
        position: 'absolute',
        width: vw(34),
        height: vh(25),
        borderRadius: 20,
        marginBottom: 10,
    },
    Nom: {
        color: 'white',
        fontSize: 18,
        paddingHorizontal: 5,
        marginBottom: 5,
        fontWeight: '500',

    },
    Poste: {
        color: '#3B4F7D',
        fontSize: 12,
        paddingHorizontal: 5,
    },
    Caption: {
        color: 'white',
        fontSize: 12,
        paddingHorizontal: 5,
        marginBottom: 10,
        fontWeight: '500',
    },
});

export default PhotoListScreen;
