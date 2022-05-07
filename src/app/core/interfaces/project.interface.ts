import { Timestamp } from 'firebase/firestore';

export interface Project {
    name: string;
    description: string;
    completed: boolean;
    owner: string;
    user_id: string;
    creation_date: Timestamp;
    modification_date: Timestamp;
    members: string[];
    members_id: string[];
}
