import React, { useState, useEffect } from 'react';
import { getEmployees, getLatestEmployeeImage } from '../services/api';
import { Employee, EmployeeData } from '../models/Employee';
import { View, Text, StyleSheet, SafeAreaView, Image, ImageBackground, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { vw, vh } from 'react-native-expo-viewport-units';
import FondTrombie from '../../assets/Home_page.png';
import Julien from '../../assets/Julien.jpg';
import { LinearGradient } from 'expo-linear-gradient';

const Trombie: React.FC<{ navigation: any }> = ({ navigation }) => {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);

                const employeesData: EmployeeData[] = await getEmployees();

                if (!Array.isArray(employeesData)) {
                    console.error('Erreur : les données des employés ne sont pas un tableau.');
                    return;
                }

                const employeesInstances: Employee[] = employeesData.map(data => new Employee(data));

                const fetchLatestImagePromises = employeesInstances.map(async (employee) => {
                    const imageUrl = await getLatestEmployeeImage(employee.id);
                    if (imageUrl) {
                        employee.imageUrl = imageUrl;
                    }
                });

                // Attendre que toutes les requêtes soient terminées
                await Promise.all(fetchLatestImagePromises);

                setEmployees(employeesInstances);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails des employés:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const renderItem = ({ item }: { item: Employee }) => (
        <TouchableOpacity onPress={() => {
            console.log("Navigating to profile with ID:", item.id);
            navigation.navigate('UserProfil', { userId: item.id });
        }}>
            <View style={styles.carte}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.Photo}
                />
                <View style={styles.carte_superposition}>
                    <Text style={styles.Nom}>{item.name} {item.surname}</Text>
                    <Text style={styles.Poste}>{item.work}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#f0d6dd', '#eff6dc']}
                style={{ flex: 1 }}
            >
            <View height={120} style={{ paddingHorizontal: 20, paddingTop: 50 }}>
            <Text style={styles.titre}>Trombinoscope</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={employees}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 35, paddingVertical: 20 }}
                />
            )}
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
        fontSize: 30,
        color: '#3B4F7D',
        marginBottom: 10,
        fontFamily: 'InterBold'
    },
    carte: {
        height: vh(32),
        width: vw(34),
        backgroundColor: 'white',
        borderRadius: 20,
        marginRight: 20,
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
        height: vh(22),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginBottom: 10,
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
    },
});

export default Trombie;
