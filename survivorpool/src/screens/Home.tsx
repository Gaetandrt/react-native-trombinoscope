import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity, ImageBackground, Button, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { vw, vh } from 'react-native-expo-viewport-units';
import { Employee, EmployeeData } from '../models/Employee';
import { getEmployees, getLatestEmployeeImage, getEmployeeReal } from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DayPicture from '../components/DayPicture';
import QuizzMaster from '../components/QuizzMaster';
import EntrepriseMood from '../components/EntrepriseMood';

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    // Set avec un beReal et le nom du mec qui l'a prise
    const [BeRealURL, setBeRealURL] = useState<string>();
    const [BeRealName, setBeRealName] = useState<string>();

    // Set avec la pp du mec au meilleur score
    const [MasterQuizzPicture, setMasterPicture] = useState<string>();

    // Set avec le mood de l'entreprise
    const [GlobalMood, setGlobalMood] = useState<number>();

    useEffect(() => {
        const fetchFiveEmployees = async () => {
            try {
                setLoading(true);

                const employeesData: EmployeeData[] = await getEmployees();
                let randomEmployees: EmployeeData[] = [];

                if (!Array.isArray(employeesData)) {
                    console.error('Erreur : les données des employés ne sont pas un tableau.');
                    return;
                } else if (employeesData.length < 5) {
                    randomEmployees = employeesData;
                } else {
                    // Mélanger le tableau d'employés
                    employeesData.sort(() => Math.random() - 0.5);
                    // Récupérer les 5 premiers éléments du tableau mélangé
                    randomEmployees = employeesData.slice(0, 5);
                }

                const employeesInstances: Employee[] = randomEmployees.map(data => new Employee(data));

                const fetchLatestImagePromises = employeesInstances.map(async (employee) => {
                    const imageUrl = await getLatestEmployeeImage(employee.id);
                    if (imageUrl) {
                        employee.imageUrl = imageUrl;
                    }
                });

                await Promise.all(fetchLatestImagePromises);

                setEmployees(employeesInstances);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails des employés.', error);
            } finally {
                setLoading(false);
            }

            const userIdString = await AsyncStorage.getItem('userId');
            const real = await getEmployeeReal(parseInt(userIdString));
            setBeRealURL(real.imageUrl);
            setBeRealName(real.caption);
        };

        fetchFiveEmployees();


        // Set avec les bons truc de l'api
        setMasterPicture('https://firebasestorage.googleapis.com/v0/b/survivor-epi.appspot.com/o/employee_images%2F74%2Fapi_1694747486747.png?alt=media&token=dbaeb225-f5c8-4827-9aff-ab6409a100c2');
        setGlobalMood(1);
    }, []);

    const renderItem = ({ item }: { item: Employee }) => (
        <View style={styles.carte}>
            <TouchableOpacity onPress={() => navigation.navigate('Profil', { userId: item.id })}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.Photo}
                />
                <View style={styles.carte_superposition}>
                    <Text style={styles.Nom}>{item.name} {item.surname}</Text>
                    <Text style={styles.Poste}>{item.work}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container} >
            <LinearGradient
                colors={['#f0d6dd', '#eff6dc']}
                style={{ flex: 1 }}
            >
                <ScrollView style={{
                    height: '100%',
                }}>
                    <View style={{ paddingHorizontal: 20, paddingTop: 60 }}>
                        <Text style={styles.titre}>Bonjour</Text>
                        <DayPicture name={BeRealName} url={BeRealURL} navigation={navigation}></DayPicture>
                    </View>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10, paddingLeft: 10 }}>
                        <QuizzMaster url={MasterQuizzPicture}></QuizzMaster>
                        <EntrepriseMood mood={GlobalMood}></EntrepriseMood>
                    </View>
                    <View style={{ paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 20 }}>
                        <Text style={{ fontSize: 20, color: '#3B4F7D', fontFamily: 'InterBold' }}>Trombinoscope</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Trombie")}>
                            <Text style={{ fontSize: 12, color: '#aaa', marginTop: 10 }}>more</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal={true}>
                        <View style={{ height: vh(35), flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30 }}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#0000ff" />
                            ) : (
                                <FlatList
                                    data={employees}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.id.toString()}
                                    numColumns={5}
                                />
                            )}
                        </View>
                    </ScrollView>
                </ScrollView>
            </LinearGradient>
        </View>
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
        marginBottom: 20,
        fontFamily: 'InterBold'
    },
    carte: {
        height: vh(30),
        width: vw(34),
        backgroundColor: 'white',
        borderRadius: 20,
        marginRight: 20
    },
    carte_superposition: {
        position: 'relative',
        top: -20,
        backgroundColor: 'rgba(255, 229, 191, 0.90)',
        height: vh(11.3),
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    Photo: {
        width: vw(34),
        height: vh(20),
        marginBottom: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    Nom: {
        color: '#3B4F7D',
        fontSize: 18,
        paddingHorizontal: 5,
        marginBottom: 5,
        fontFamily: 'InterBold',
    },
    Poste: {
        color: '#3B4F7D',
        fontSize: 12,
        paddingHorizontal: 5,
        fontFamily: 'InterRegular'
    },

});

export default Home;
