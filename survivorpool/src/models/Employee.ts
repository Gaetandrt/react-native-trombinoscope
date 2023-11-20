import { getEmployee, getLatestEmployeeImage } from '../services/api';

export interface EmployeeData {
    id: number;
    email: string;
    name: string;
    surname: string;
    birth_date: string;
    gender: string;
    work: string;
    subordinates: number[];
}

export interface EmployeeReal {
    imageUrl: string;
    caption?: string;
}

export class Employee {
    id: number;
    email: string;
    name: string;
    surname: string;
    birth_date: string;
    gender: string;
    work: string;
    subordinates: number[];
    imageUrl: string; // URI de l'image
    realUrl: string; // URI du real
    realCaption: string; // Caption du real
    interests: number[]; // Liste des ID des centres d'intérêts
    mood: number; // Mood de l'employé

    constructor(data: EmployeeData) {
        this.id = data.id;
        this.email = data.email;
        this.name = data.name;
        this.surname = data.surname;
        this.birth_date = data.birth_date;
        this.gender = data.gender;
        this.work = data.work;
        this.subordinates = data.subordinates;
        this.imageUrl = '';
        this.realUrl = '';
        this.realCaption = '';
        this.interests = [];
        this.mood = 0;
    }

    async fetchDetails() {
        const details = await getEmployee(this.id);
        Object.assign(this, details);
    }

    async fetchImage() {
        try {
            const imageUrl = await getLatestEmployeeImage(this.id);
            this.imageUrl = imageUrl;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'image de l'employé avec l'ID ${this.id}:`, error);
            this.imageUrl = ''; // Remplacez par l'URL de votre image par défaut
        }
    }
}
