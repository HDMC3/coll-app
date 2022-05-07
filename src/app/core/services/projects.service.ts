import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryFn } from '@angular/fire/compat/firestore';

import { map, switchMap } from 'rxjs/operators';
import { OrderByDirection } from 'firebase/firestore';
import { ProjectFilterOptionValues, SortOptionsValues } from '../enums';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Project } from '../interfaces/project.interface';

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {

    constructor(private firestore: AngularFirestore, private authService: AuthService) { }

    getOwnerProjects(filterValue: number, sortValue: number, limit: number) {
        return this.getFilterQuery(filterValue, sortValue, limit).pipe(
            switchMap(query => {
                return this.firestore.collection<Project>('projects', query).get().pipe(
                    map(snap => {
                        const values: Project[] = snap.docs.map(doc => {
                            return {
                                id: doc.id,
                                ...doc.data()
                            };
                        });

                        return values;
                    })
                );
            })
        );
    }

    private getFilterQuery(filterValue: number, sortValue: number, limit: number): Observable<QueryFn<DocumentData>> {
        return this.authService.currentUser.pipe(
            map(user => {
                if (!user) throw new Error('No se encontro el usuario');

                let sortQueryArgs: { field: string, option: OrderByDirection } = {
                    field: 'creation_date',
                    option: 'desc'
                };

                if (sortValue === SortOptionsValues.OLDEST) {
                    sortQueryArgs = {
                        field: 'creation_date',
                        option: 'asc'
                    };
                }

                if (filterValue === ProjectFilterOptionValues.OWN_COMPLETED) {
                    return (ref) => ref
                        .where('user_id', '==', user.uid)
                        .where('completed', '==', true)
                        .orderBy(sortQueryArgs.field, sortQueryArgs.option)
                        .limit(limit);
                }

                if (filterValue === ProjectFilterOptionValues.OWN_IN_PROGRESS) {
                    return (ref) => ref
                        .where('user_id', '==', user.uid)
                        .where('completed', '==', false)
                        .orderBy(sortQueryArgs.field, sortQueryArgs.option)
                        .limit(limit);
                }

                if (filterValue === ProjectFilterOptionValues.COLLABORATOR) {
                    return (ref) => ref
                        .where('members_id', 'array-contains', user.uid)
                        .orderBy(sortQueryArgs.field, sortQueryArgs.option)
                        .limit(limit);
                }

                if (filterValue === ProjectFilterOptionValues.COLLAB_COMPLETED) {
                    return (ref) => ref
                        .where('members_id', 'array-contains', user.uid)
                        .where('completed', '==', true)
                        .orderBy(sortQueryArgs.field, sortQueryArgs.option)
                        .limit(limit);
                }

                if (filterValue === ProjectFilterOptionValues.COLLAB_IN_PROGRESS) {
                    return (ref) => ref
                        .where('members_id', 'array-contains', user.uid)
                        .where('completed', '==', false)
                        .orderBy(sortQueryArgs.field, sortQueryArgs.option)
                        .limit(limit);
                }

                return (ref) => ref
                    .where('user_id', '==', user.uid)
                    .orderBy(sortQueryArgs.field, sortQueryArgs.option)
                    .limit(limit);
            })
        );
    }
}
