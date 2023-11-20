import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Entypo';
import InterestsList from '../components/InterestList';
import MoodIcon from 'react-native-vector-icons/FontAwesome5';
import { getEmployeeObject, getEmployeeReal, getEmployeesReal, getInterest, setEmployeeMood } from '../services/api';
import { EmployeeData, Employee, EmployeeReal } from '../models/Employee';
import { vw, vh } from 'react-native-expo-viewport-units';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import BeRealProfil from '../components/BeRealProfil';
import { parse } from 'react-native-svg';

const UserProfil: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const [backgroundColor, setBackgroundColor] = useState('white');
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [employeeReal, setEmployeeReal] = useState<EmployeeReal>(null);
    const [interestSelected, setInterestSelected] = useState<number[]>([]);
    const [employeeImage, setEmployeeImage] = useState<string | undefined>();
    const [userName, setUserName] = useState<string | undefined>();
    const [work, setWork] = useState<string | undefined>();
    const [mood, setMood] = useState<number>(0);
    const [show, setShow] = useState<boolean>(false);
    const hasFetchedRef = useRef(false);

    const handleElementClick = (color: string, mood: number) => {
        setBackgroundColor(color);
        setEmployeeMood(route.params.userId, mood);
    };

    const fetchEmployee = async () => {
        // console.log(route.params.userId);
        let employeeObj: EmployeeData = await getEmployeeObject(route.params.userId);
        let employeeDetails: Employee = new Employee(employeeObj);
        // console.log(employeeDetails);
        await employeeDetails.fetchDetails();
        await employeeDetails.fetchImage();

        setEmployee(employeeDetails);

        if (employeeDetails) {
            const real = await getEmployeeReal(route.params.userId);
            setEmployeeReal(real);
            setEmployeeImage(employeeDetails.imageUrl);
            setWork(employeeDetails.work);
            setUserName(`${employeeDetails.name} ${employeeDetails.surname}`);
            setMood(employeeDetails.mood);

            if (employeeDetails.mood === 1) setBackgroundColor("#D3FFD5");
            else if (employeeDetails.mood === 2) setBackgroundColor("#F9FFB7");
            else if (employeeDetails.mood === 3) setBackgroundColor("#FFE5BF");
            else if (employeeDetails.mood === 4) setBackgroundColor("#FCD5D5");
        }

        const userIdString = await AsyncStorage.getItem('userId');
        if (userIdString === employeeDetails.id.toString())
            setShow(true);
        else
            setShow(false);
    };

    const updateInterest = async () => {
        let interest: number[] = await getInterest(route.params.userId);

        setInterestSelected(interest);
    };

    useFocusEffect(
        React.useCallback(() => {
            if (!hasFetchedRef.current) {
                fetchEmployee();
                updateInterest();
                hasFetchedRef.current = true;
            }

            return () => {
                // This is the cleanup function
                // Reset the ref when the screen goes out of focus
                hasFetchedRef.current = false;
            };
        }, [route.params.userId]) // Ajoutez cette dépendance ici
    );



    return (
        <View style={styles.container}>
            <ImageBackground source={{ uri: employeeImage }} style={[styles.backgroundImage, { height: vh(50) }]}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={[styles.content, { marginTop: vh(45), backgroundColor }]}>
                        <View style={{ padding: 16 }}>
                            <Text style={styles.userName}>{userName}</Text>
                            <View style={[styles.row,]}>
                                <Feather name="user" size={22} color="#3B4F7D" />
                                <Text style={styles.job}>{work}</Text>
                            </View>
                        </View>
                        <View style={[styles.row, { margin: 10, justifyContent: 'space-between' }]}>
                            <View style={styles.row}>
                                <Feather name="sun" size={24} color="#3B4F7D" />
                                <Text style={styles.textCategorie}>{"Centre d'intérêts"}</Text>
                            </View>
                            {show && (
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => navigation.navigate("Interest")}>
                                        <Feather name="edit-2" size={20} color="#3B4F7D" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        <InterestsList interest={interestSelected}></InterestsList>
                        <View style={[styles.row, { margin: 10 }]}>
                            <Icon name="emoji-happy" size={24} color="#3B4F7D" />
                            <Text style={styles.textCategorie}>{"Humeur"}</Text>
                        </View>
                        <View style={[styles.moodRow, { backgroundColor }]}>
                            <View style={styles.moodCard}>
                                <TouchableOpacity onPress={() => handleElementClick("#D3FFD5", 1)}>
                                    <MoodIcon name="grin-squint" size={44} color="#8ABB8C" />
                                </TouchableOpacity>
                                <Text style={[styles.moodText, { color: '#8ABB8C' }]}>{'Entousiaste'}</Text>
                            </View>
                            <View style={styles.moodCard}>
                                <TouchableOpacity onPress={() => handleElementClick("#F9FFB7", 2)}>
                                    <MoodIcon name="grin-alt" size={44} color="#C8D063" />
                                </TouchableOpacity>
                                <Text style={[styles.moodText, { color: '#C8D063' }]}>{'Concentré'}</Text>
                            </View>
                            <View style={styles.moodCard}>
                                <TouchableOpacity onPress={() => handleElementClick("#FFE5BF", 3)}>
                                    <MoodIcon name="grimace" size={44} color="#E0B574" />
                                </TouchableOpacity>
                                <Text style={[styles.moodText, { color: '#E0B574' }]}>{'Fatigué'}</Text>
                            </View>
                            <View style={styles.moodCard}>
                                <TouchableOpacity onPress={() => handleElementClick("#FCD5D5", 4)}>
                                    <MoodIcon name="sad-tear" size={44} color="#E88C8C" />
                                </TouchableOpacity>
                                <Text style={[styles.moodText, { color: '#E88C8C' }]}>{'Frustré'}</Text>
                            </View>
                        </View>
                        <View style={[styles.row, { margin: 10 }]}>
                            <Icon name="camera" size={24} color="#3B4F7D" />
                            <Text style={styles.textCategorie}>{"Photo du jour"}</Text>
                        </View>

                        <BeRealProfil url={employeeReal?.imageUrl} legend={employeeReal?.caption}></BeRealProfil>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
    },
    content: {
        flex: 1,
        padding: 16,
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    row: {
        paddingTop: 15,
        paddingBottom: 5,
        flexDirection: "row",
        alignItems: 'center',
    },
    userName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: "#3B4F7D"
    },
    textCategorie: {
        paddingLeft: 10,
        fontSize: 22,
        color: "#3B4F7D",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        marginTop: -50,
        paddingTop: 10,
    },
    job: {
        paddingLeft: 10,
        fontSize: 16,
        opacity: 0.7,
        color: "#3B4F7D",
    },
    moodRow: {
        padding: 15,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    moodCard: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
    },
    moodText: { fontSize: 16 },
});

export default UserProfil;
