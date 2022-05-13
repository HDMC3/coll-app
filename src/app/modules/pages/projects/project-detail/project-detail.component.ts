import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, forkJoin, of, take } from 'rxjs';
import { TaskPriorityValues } from 'src/app/core/enums';
import { ModalCloseValue } from 'src/app/core/interfaces/modal-close-value.interface';
import { ProjectTask } from 'src/app/core/interfaces/project-task.interface';
import { Project } from 'src/app/core/interfaces/project.interface';
import { AlertControllerService } from 'src/app/core/services/alert-controller.service';
import { ProjectsService } from 'src/app/core/services/projects.service';

@Component({
    selector: 'app-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

    projectId?: string;
    loading: boolean;
    project?: Project;
    projectTasks: ProjectTask[];
    projectTasksList: { task: ProjectTask, selected: boolean }[];
    membersList: { member: string, selected: boolean }[];

    memberActionButtonsState = {
        disabledEdit: true,
        disabledDelete: true,
        disabledNew: false
    };

    taskActionButtonsState = {
        disabledEdit: true,
        disabledDelete: true,
        disabledNew: false
    };

    generalMembersCheckValue = false;
    generalTasksCheckValue = false;

    showNewMemberModal: boolean;
    showConfirmModal: boolean;
    confirmModalMessage: string;

    constructor(
        private activateRoute: ActivatedRoute,
        private projectService: ProjectsService,
        private alertController: AlertControllerService,
        private containerRef: ViewContainerRef
    ) {
        this.activateRoute.params.pipe(take(1)).subscribe({
            next: (params) => {
                this.projectId = params['project_id'];
            }
        });
        this.loading = true;
        this.projectTasks = [];
        this.projectTasksList = [];
        this.membersList = [];

        this.showNewMemberModal = false;
        this.showConfirmModal = false;
        this.confirmModalMessage = '';
    }

    ngOnInit() {
        if (this.projectId) {
            this.getData(this.projectId);
        }
    }

    getData(projectId: string) {
        this.loading = true;
        forkJoin({
            project: this.getProject$(projectId).pipe(
                catchError(err => of(new Error(err.message)))
            ),
            projectTasks: this.getTasksProject$(projectId).pipe(
                catchError(err => of(new Error(err.message)))
            )
        }).subscribe({
            next: projectData => {
                if (projectData.project instanceof Error) {
                    const err = projectData.project;
                    this.alertController.showAlert(this.containerRef, err.message ? err.message : 'Problema al cargar el proyecto', 'error', 3000);
                    this.loading = false;
                } else if (projectData.projectTasks instanceof Error) {
                    const err = projectData.projectTasks;
                    this.alertController.showAlert(this.containerRef, err.message ? err.message : 'Problema al cargar las tareas', 'error', 3000);
                    this.loading = false;
                } else {
                    this.project = projectData.project;
                    this.membersList = projectData.project.members.map(m => ({ member: m, selected: false }));
                    this.projectTasks = projectData.projectTasks;
                    this.projectTasksList = projectData.projectTasks.map(t => ({ task: t, selected: false }));
                    this.loading = false;
                }
            }
        });
    }

    getProject$(projectId: string) {
        return this.projectService.getProject(projectId)
            .pipe(take(1));
    }

    getTasksProject$(projectId: string) {
        return this.projectService.getProjectTasks(projectId)
            .pipe(take(1));
    }

    getPriorityText(priorityValue: number) {
        if (priorityValue === TaskPriorityValues.HIGH) return 'Alta';
        if (priorityValue === TaskPriorityValues.MEDIUM) return 'Media';
        if (priorityValue === TaskPriorityValues.LOW) return 'Baja';

        return 'Sin prioridad';
    }

    onGeneralMembersCheckChange(enabled: boolean) {
        this.memberActionButtonsState = {
            disabledEdit: !enabled || (enabled && this.membersList.length > 1),
            disabledDelete: !enabled,
            disabledNew: false
        };

        this.membersList.forEach(item => {
            item.selected = enabled;
        });
    }

    onGeneralTasksCheckChange(enabled: boolean) {
        this.taskActionButtonsState = {
            disabledEdit: !enabled || (enabled && this.projectTasksList.length > 1),
            disabledDelete: !enabled,
            disabledNew: false
        };

        this.projectTasksList.forEach(item => {
            item.selected = enabled;
        });
    }

    onMemberCheckChange(enabled:boolean, index: number) {
        const selectedMembers = this.membersList.filter(m => m.selected).length;
        this.memberActionButtonsState = {
            disabledEdit: selectedMembers > 1 || selectedMembers === 0,
            disabledDelete: selectedMembers === 0,
            disabledNew: false
        };
        this.generalMembersCheckValue = selectedMembers === this.membersList.length;
    }

    onProjectTasksCheckChange() {
        const selectedProjectTasks = this.projectTasksList.filter(t => t.selected).length;
        this.taskActionButtonsState = {
            disabledEdit: selectedProjectTasks > 1 || selectedProjectTasks === 0,
            disabledDelete: selectedProjectTasks === 0,
            disabledNew: false
        };
        this.generalTasksCheckValue = selectedProjectTasks === this.projectTasksList.length;
    }

    openNewMemberModal() {
        this.showNewMemberModal = true;
    }

    async onCloseNewMemberModal(modalValue: ModalCloseValue<string>) {
        this.showNewMemberModal = false;
        if (modalValue.action === 'ok' && modalValue.value && this.project && this.project.id) {
            const newMembers = this.membersList.map(item => item.member).concat([modalValue.value]);
            const result = await this.projectService.updateProject({ members: newMembers }, this.project.id);

            if (result instanceof Error) {
                this.alertController.showAlert(this.containerRef, result.message, 'error', 3000);
            } else {
                this.alertController.showAlert(this.containerRef, 'Miembro agregado con exito', 'success', 2000);
                this.membersList.push({ selected: false, member: modalValue.value });
                this.project.members.push(modalValue.value);
            }
        }
    }

    deleteMembers() {
        this.showConfirmModal = true;
        this.confirmModalMessage = 'Se eliminara el miembro, desea continuar?';
    }

    async onCloseDeleteMembersConfirmModal(modalValue: ModalCloseValue<any>) {
        this.showConfirmModal = false;
        const membersSelected = this.membersList.filter(item => item.selected);
        if (modalValue.action !== 'ok' || membersSelected.length === 0 || !this.project || !this.project.id) return;

        const newMembers = this.membersList.filter(item => !item.selected);
        const deletedMembers = this.membersList.filter(item => item.selected);
        const result = await this.projectService.deleteMembers(newMembers.map(item => item.member), deletedMembers.map(item => item.member), this.project.id);
        if (result instanceof Error) {
            this.alertController.showAlert(this.containerRef, result.message, 'error', 3000);
            return;
        }

        this.alertController.showAlert(this.containerRef, 'Miembro eliminado con exito', 'success', 2000);
        this.memberActionButtonsState = {
            disabledEdit: true,
            disabledDelete: true,
            disabledNew: false
        };
        this.membersList.length = 0;
        this.membersList = newMembers;
        this.project.members.length = 0;
        this.project.members = newMembers.map(item => item.member);
    }
}
