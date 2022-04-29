import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryFn, QuerySnapshot } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { WhereFilterOp, OrderByDirection } from 'firebase/firestore';
import { FilterOptionValues, SortOptionsValues } from '../enums';
import { Task } from '../interfaces/task.interface';

@Injectable({
    providedIn: 'root'
})
export class TasksService {

    private firstTask: any;
    private firstTaskPage: any;
    private lastTaskPage: any;

    constructor(private firestore: AngularFirestore) { }

    getTasks(filterValue: number, sortValue: number, limit: number) {
        const query = this.getTasksQuery(filterValue, sortValue, limit);

        return this.firestore.collection<Task>('tasks', query).get()
            .pipe(map(snap => {

                if (snap.docs.length > 0) {
                    this.firstTask = snap.docs[0];
                    this.firstTaskPage = snap.docs[0];
                    this.lastTaskPage = snap.docs[snap.docs.length - 1];
                }

                return this.getDataTasks(snap);
            }));
    }

    getTasksPage(filterValue: number, sortValue: number, limit: number, directionPage?: 'next' | 'prev') {
        const query = this.getTasksQuery(filterValue, sortValue, limit, directionPage);

        return this.firestore.collection<Task>('tasks', query).get()
            .pipe(map(snap => {

                if (snap.docs.length === 0) return undefined;

                if (snap.docs.length > 0) {
                    this.firstTaskPage = snap.docs[0];
                    this.lastTaskPage = snap.docs[snap.docs.length - 1];
                }

                const tasks = this.getDataTasks(snap);

                return tasks;
            }));
    }

    private getDataTasks(snapshot: QuerySnapshot<Task>) {
        const values: Task[] = [];

        snapshot.forEach(doc => {
            const data: any = doc.data();

            values.push({
                id: doc.id,
                name: data.name,
                description: data.description,
                completed: data.completed,
                priority: data.priority,
                creation_date: data.creation_date,
                modification_date: data.modification_date,
                tags: data.tags
            });
        });
        return values;
    }

    private getTasksQuery(filterValue: number, sortValue: number, limit: number, directionPage?: 'next' | 'prev'): QueryFn<DocumentData> {
        let filterQueryArgs: { field: string, option: WhereFilterOp, value: any } = {
            field: '',
            option: '!=',
            value: undefined
        };

        let sortQueryArgs: { field: string, option: OrderByDirection } = {
            field: 'creation_date',
            option: 'desc'
        };

        if (filterValue === FilterOptionValues.COMPLETED) {
            filterQueryArgs = { field: 'completed', option: '==', value: true };
        }

        if (filterValue === FilterOptionValues.PENDING) {
            filterQueryArgs = { field: 'completed', option: '==', value: false };
        }

        if (filterValue !== FilterOptionValues.ALL && filterValue !== FilterOptionValues.PENDING && filterValue !== FilterOptionValues.COMPLETED) {
            filterQueryArgs = { field: 'priority', option: '==', value: filterValue };
        }

        if (sortValue === SortOptionsValues.OLDEST) {
            sortQueryArgs = { field: 'creation_date', option: 'asc' };
        }

        if (filterQueryArgs.field !== '') {

            if (directionPage && directionPage === 'next') {
                return (ref) => ref
                    .where(filterQueryArgs.field, filterQueryArgs.option, filterQueryArgs.value)
                    .orderBy(sortQueryArgs.field, sortQueryArgs.option)
                    .startAfter(this.lastTaskPage)
                    .limit(limit);
            }

            if (directionPage && directionPage === 'prev') {
                return (ref) => ref
                    .where(filterQueryArgs.field, filterQueryArgs.option, filterQueryArgs.value)
                    .orderBy(sortQueryArgs.field, sortQueryArgs.option)
                    .endBefore(this.firstTaskPage)
                    .limit(limit);

            }

            return (ref) => ref
                .where(filterQueryArgs.field, filterQueryArgs.option, filterQueryArgs.value)
                .orderBy(sortQueryArgs.field, sortQueryArgs.option)
                .limit(limit);
        }

        if (directionPage && directionPage === 'next') {
            return (ref) => ref
                .orderBy(sortQueryArgs.field, sortQueryArgs.option)
                .startAfter(this.lastTaskPage)
                .limit(limit);
        }

        if (directionPage && directionPage === 'prev') {
            return (ref) => ref
                .orderBy(sortQueryArgs.field, sortQueryArgs.option)
                .endBefore(this.firstTaskPage)
                .limit(limit);

        }

        return (ref) => ref.orderBy(sortQueryArgs.field, sortQueryArgs.option).limit(limit);
    }
}
