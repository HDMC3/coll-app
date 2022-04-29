export interface Task {
    id: string;
    name: string;
    description: string;
    completed: boolean;
    priority: number;
    creation_date: Date;
    modification_date: Date;
    tags: string[];
}
