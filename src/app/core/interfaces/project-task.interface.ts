import { Timestamp } from 'firebase/firestore';

export interface ProjectTask {
    id?: string;
    name: string;
    description: string;
    completed: boolean;
    priority: number;
    owner: string;
    completation_date: Timestamp;
    creation_date: Timestamp;
    modification_date: Timestamp;
}
