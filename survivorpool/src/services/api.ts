import axios from 'axios';
import { initializeApp, getApps } from "firebase/app";
import { EmployeeData, Employee, EmployeeReal } from '../models/Employee';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, query, where, orderBy, limit, updateDoc} from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImageManipulator from 'expo-image-manipulator';

const firebaseConfig = {
  apiKey: "AIzaSyBZM8ZWU3FpQLTL1g_NwlidrBZ9AtmFeBM",
  authDomain: "survivor-epi.firebaseapp.com",
  projectId: "survivor-epi",
  storageBucket: "survivor-epi.appspot.com",
  messagingSenderId: "312781189752",
  appId: "1:312781189752:web:8a77c5b4d40d3a0f66f38d",
  measurementId: "G-YBR6TMPSFF"
};

const app = initializeApp(firebaseConfig);

// Initialisation de Firebase
if (!getApps().length) {
    initializeApp(firebaseConfig);
}

const firestore = getFirestore(app);
const storage = getStorage(app);

// Création d'une instance axios avec une configuration par défaut
const api = axios.create({
    baseURL: 'https://masurao.fr/api/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Group-Authorization': '586b651cd3de7944869a8ca65b685439',
    },
});

// Module simple pour stocker et récupérer le token JWT
export const tokenModule = {
    token: null as string | null,
    setToken: function(newToken: string) {
        this.token = newToken;
    },
    getToken: function() {
        return this.token;
    }
};

// Intercepteur pour ajouter le JWT à chaque requête
api.interceptors.request.use((config) => {
    const token = tokenModule.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getFirebaseImageUrl = async (path: string) => {
    const storage = getStorage();
    const imageRef = ref(storage, path);
    return await getDownloadURL(imageRef);
};


// Fonction pour se connecter
export const loginUser = async (email: string, password: string) => {
    try {
        let response = await api.post('employees/login', {
            email,
            password,
        });
        if (response.data && response.data.access_token) {
            tokenModule.setToken(response.data.access_token);

            // Stocker l'ID de l'utilisateur
            const userMe = await api.get('employees/me');
            if (userMe.data.id) {
                await AsyncStorage.setItem('userId', userMe.data.id.toString());
                console.log('stockage de l\'id: ', userMe.data.id);
            }
        }
        console.log('loginUser response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return error;
    }
};

// liste tout employé
export const getEmployees = async () => {
    try {
        const employeesCollection = collection(firestore, 'employees');
        const snapshot = await getDocs(employeesCollection);
        const employees: any = [];
        snapshot.forEach(docSnapshot => {
            employees.push(docSnapshot.data());
        });
        return employees;
    } catch (error) {
        console.error('Erreur lors de la récupération des employés:', error);
        return [];
    }
};

// recuperer nom et prenom de l'employé connecté
export const getEmployeeName = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            throw new Error('Aucun utilisateur connecté.');
        }
        const employeeDoc = doc(firestore, 'employees', userId);
        const docSnapshot = await getDoc(employeeDoc);
        if (!docSnapshot.exists()) {
            throw new Error(`L'employé avec l'ID ${userId} n'existe pas.`);
        }
        const employeeData = docSnapshot.data();
        return `${employeeData.firstname} ${employeeData.lastname}`;
    } catch (error) {
        console.error('Erreur lors de la récupération du nom de l\'employé:', error);
        return '';
    }
};

// un employé avec son id
export const getEmployee = async (id: number) => {
    try {
        const employeeDoc = doc(firestore, 'employees', id.toString());
        const docSnapshot = await getDoc(employeeDoc);
        if (!docSnapshot.exists()) {
            throw new Error(`L'employé avec l'ID ${id} n'existe pas.`);
        }
        return docSnapshot.data();
    } catch (error) {
        console.error(`Erreur lors de la récupération des détails de l'employé avec l'ID ${id}:`, error);
        return null;
    }
};

export const getEmployeeObject = async (id: number) => {
    try {
        const employeeDoc = doc(firestore, 'employees', id.toString());
        const docSnapshot = await getDoc(employeeDoc);

        let newEmployee: Employee = new Employee(docSnapshot.data() as EmployeeData);
        return new Employee(docSnapshot.data() as EmployeeData);
    } catch (error) {
        console.error(`Erreur lors de la récupération des détails de l'employé avec l'ID ${id}:`, error);
        return null;
    }
};

// recuperer l'image d'un employé
export const getLatestEmployeeImage = async (employeeId: number): Promise<string> => {
    try {
        const firestore = getFirestore();
        const q = query(
            collection(firestore, 'employee_images_metadata'),
            where('employee_id', '==', employeeId),
            where('type', '==', 1), // 1 = image de l'employé trombi
            orderBy('timestamp', 'desc'),
            limit(1)
        );

        console.log(`Récupération de la dernière image de l'employé ${employeeId}...`);
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log(`Aucune image trouvée pour l'employé ${employeeId}`);
            return '';
        }

        console.log(`Image trouvée pour l'employé ${employeeId} !`);
        // Prendre le premier document (le plus récent)
        const latestImageDoc = querySnapshot.docs[0];
        const latestImageData = latestImageDoc.data();

        const storage = getStorage();
        const imageRef = ref(storage, latestImageData.image_url); // Utilisez la référence de l'objet de stockage

        console.log(`Récupération de l'URL de l'image de l'employé ${employeeId}...`);

        const url = await getDownloadURL(imageRef); // Obtenez l'URL de téléchargement à partir de la référence

        console.log(`URL de l'image de l'employé ${employeeId} récupérée avec succès !`);
        return url;
    } catch (error) {
        console.error(`Erreur lors de la récupération de la dernière image de l'employé ${employeeId}:`, error);
        return '';
    }
};

// Enregistrer l'image d'un employé dans Firebase Storage
export const saveEmployeeImage = async (id: number, localImageUrl: string): Promise<void> => {
    try {
        console.log(`Téléchargement de l'image de l'employé ${id}...`);

        // Redimensionner l'image
        const resizedImage = await ImageManipulator.manipulateAsync(
            localImageUrl,
            [],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        // Convertir l'image redimensionnée en blob
        const response = await fetch(resizedImage.uri);
        const blob = await response.blob();

        // Générer un nom de fichier unique pour chaque nouvelle image
        const timestamp = new Date().getTime();
        const filename = `real_${timestamp}.png`;

        console.log(`Téléchargement de l'image de l'employé ${id} dans Firebase Storage...`);
        const storage = getStorage();
        const fileRef = ref(storage, `employee_images/${id}/${filename}`);
        console.log(`fileRef:`, fileRef);

        // Télécharger le blob dans Firebase Storage
        await uploadBytesResumable(fileRef, blob);
        console.log(`Image de l'employé ${id} upload avec succès !`);

        // (Optionnel) Mettre à jour les métadonnées dans Firestore
        const firestore = getFirestore();
        const employeeImagesCollection = collection(firestore, 'employee_images_metadata');

        const imageMetadata = {
            employee_id: id,
            image_url: `employee_images/${id}/${filename}`,
            timestamp: timestamp,
            type: 2 // Vous pouvez ajuster cette valeur si nécessaire
        };

        await addDoc(employeeImagesCollection, imageMetadata);
        console.log(`Métadonnées de l'image de l'employé ${id} mises à jour avec succès dans Firestore !`);

    } catch (error) {
        console.error(`Erreur lors du téléchargement de l'image de l'employé ${id}:`, error);
    }
};

export function isToday(timestamp: string) {
    const inputDate = new Date(timestamp);
    const today = new Date();

    return inputDate.getDate() === today.getDate() &&
           inputDate.getMonth() === today.getMonth() &&
           inputDate.getFullYear() === today.getFullYear();
}

export const getEmployeesReal = async (): Promise<Employee[]> => {
    try {
        const employeesData: EmployeeData[] = await getEmployees();
        const employees: Employee[] = [];

        // Utilisation de Promise.all pour exécuter toutes les requêtes en parallèle
        const employeePromises = employeesData.map(async (employee) => {
            const q = query(
                collection(firestore, 'bereal_image_data'),
                where('employee_id', '==', employee.id),
                orderBy('timestamp', 'desc'),
                limit(1)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty && isToday(querySnapshot.docs[0].data().timestamp)) {
                let newEmployee = new Employee(employee);
                newEmployee.realUrl = await getFirebaseImageUrl(querySnapshot.docs[0].data().image_url);
                newEmployee.realCaption = querySnapshot.docs[0].data().caption;
                newEmployee.imageUrl = await getLatestEmployeeImage(employee.id);
                console.log('image url: ', newEmployee.realUrl);
                return newEmployee;
            }
            return null;
        });

        const resolvedEmployees = await Promise.all(employeePromises);

        // Filtrer les employés non nuls et les ajouter à la liste des employés
        for (const emp of resolvedEmployees) {
            if (emp) employees.push(emp);
        }

        return employees;
    } catch (error) {
        console.error('Erreur lors de la récupération des reals des employés:', error);
        return [];
    }
};

export const saveEmployeeReal = async (caption: string, id: number, localImageUrl: string): Promise<void> => {
    try {
        console.log(`Téléchargement de l'image: ${localImageUrl}, de l'employé ${id}...`);

        // Redimensionner l'image
        const resizedImage = await ImageManipulator.manipulateAsync(
            localImageUrl,
            [],
            { compress: 0.5, format: ImageManipulator.SaveFormat.PNG }
        );

        // Convertir l'image redimensionnée en blob
        const response = await fetch(resizedImage.uri);
        const blob = await response.blob();

        // Générer un nom de fichier unique pour chaque nouvelle image
        const timestamp = new Date().getTime();
        const filename = `real_${timestamp}.png`;

        console.log(`Téléchargement de l'image de l'employé ${id} dans Firebase Storage...`);
        const storage = getStorage();
        const fileRef = ref(storage, `employee_images/${id}/${filename}`);
        console.log(`fileRef:`, fileRef);

        // Télécharger le blob dans Firebase Storage
        await uploadBytesResumable(fileRef, blob);
        console.log(`Image de l'employé ${id} upload avec succès !`);

        // (Optionnel) Mettre à jour les métadonnées dans Firestore
        const firestore = getFirestore();
        const employeeRealCollection = collection(firestore, 'bereal_image_data');

        const realMetaData = {
            employee_id: id,
            image_url: `employee_images/${id}/${filename}`,
            timestamp: timestamp,
            caption: caption,
        };

        await addDoc(employeeRealCollection, realMetaData);
        console.log(`Métadonnées de l'image de l'employé ${id} mises à jour avec succès dans Firestore !`);

    } catch (error) {
        console.error(`Erreur lors du téléchargement de l'image de l'employé ${id}:`, error);
    }
};

export const todayBerealExist = async (id: number): Promise<boolean> => {
    try {
        const firestore = getFirestore();
        const q = query(
            collection(firestore, 'bereal_image_data'),
            where('employee_id', '==', id),
            orderBy('timestamp', 'desc'),
            limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty && isToday(querySnapshot.docs[0].data().timestamp)) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération de la dernière image de l'employé ${id}:`, error);
        return false;
    }
};

export const setEmployeeMood = async (id: number, mood: number): Promise<void> => {
    try {
        const firestore = getFirestore();
        const employeeDoc = doc(firestore, 'employees', id.toString());

        // Mettre à jour le champ mood de l'employé
        await updateDoc(employeeDoc, {
            mood: mood
        });
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'humeur de l'employé ${id}:`, error);
    }
};

export const sethigthscore = async (id: number, score: number): Promise<void> => {
    try {
        const firestore = getFirestore();
        const employeeDoc = doc(firestore, 'employees', id.toString());

        // Mettre à jour le hight score de l'employé
        const mesBoules: string = await gethigthscore(id);
        console.log('mes boules: ', mesBoules);
        console.log('score: ', score);
        if (score > parseInt(mesBoules)) {
        await updateDoc(employeeDoc, {
            highScore: score
        });
        } else {
            console.log('score trop bas');
        }
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'humeur de l'employé ${id}:`, error);
    }
};

export const gethigthscore = async (id: number): Promise<string> => {
    try {
        const employeeDoc = doc(firestore, 'employees', id.toString());
        const docSnapshot = await getDoc(employeeDoc);
        if (!docSnapshot.exists()) {
            throw new Error(`L'employé avec l'ID ${id} n'existe pas.`);
        }
        return docSnapshot.data().highScore;
    } catch (error) {
        console.error(`Erreur lors de la récupération de la dernière image de l'employé ${id}:`, error);
        return '';
    }
};


export const setEmployeeInterests = async (id: number, interests: number[]): Promise<void> => {
    try {
        const firestore = getFirestore();
        const employeeDoc = doc(firestore, 'employees', id.toString());

        // Mettre à jour le champ mood de l'employé
        await updateDoc(employeeDoc, {
            interests: interests
        });
    } catch (error) {
        console.error(`Erreur lors de la mise à jour des centres d'intérêts de l'employé ${id}:`, error);
    }
}

export const getInterest = async (id: number) => {
    try {
        const employeeDoc = doc(firestore, 'employees', id.toString());
        const docSnapshot = await getDoc(employeeDoc);

        if (!docSnapshot.exists()) {
            throw new Error(`L'employé avec l'ID ${id} n'existe pas.`);
        }
        return docSnapshot.data().interests;
    } catch (error) {
        console.error(`Erreur lors de la récupération des détails de l'employé avec l'ID ${id}:`, error);
        return null;
    }
};

export const getMood = async (id: number) => {
    try {
        const employeeDoc = doc(firestore, 'employees', id.toString());
        const docSnapshot = await getDoc(employeeDoc);

        if (!docSnapshot.exists()) {
            throw new Error(`L'employé avec l'ID ${id} n'existe pas.`);
        }
        return docSnapshot.data().mood;
    } catch (error) {
        console.error(`Erreur lors de la récupération des détails de l'employé avec l'ID ${id}:`, error);
        return null;
    }
}

export const getEmployeeReal = async (id: number): Promise<EmployeeReal> => {
    let employeeReal: EmployeeReal = {
        imageUrl: '',
        caption: '',
    };

    try {
        const q = query(
            collection(firestore, 'bereal_image_data'),
            where('employee_id', '==', id),
            orderBy('timestamp', 'desc'),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty && isToday(querySnapshot.docs[0].data().timestamp)) {
            employeeReal.imageUrl = await getFirebaseImageUrl(querySnapshot.docs[0].data().image_url);
            employeeReal.caption = querySnapshot.docs[0].data().caption || ''; // Utilisez l'opérateur || pour définir une valeur par défaut
        }

    } catch (error) {
        console.error('Erreur lors de la récupération du real de l\'employee:', error);
        // Vous pouvez choisir de gérer l'erreur ici ou de simplement retourner l'objet employeeReal avec des champs vides
    }

    return employeeReal;
};

export const getQuizzHighestScore = async (): Promise<number> => {
    try {
        const q = query(
            collection(firestore, 'employees'),
            orderBy('highScore', 'desc'),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data().highScore;
        }

    } catch (error) {
        console.error('Erreur lors de la récupération du meilleur score du quizz:', error);
        return 0;
    }
};