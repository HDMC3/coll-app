import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, forkJoin, of, take } from 'rxjs';
import { TaskPriorityValues } from 'src/app/core/enums';
import { ModalCloseValue } from 'src/app/core/interfaces/modal-close-value.interface';
import { ProjectTask } from 'src/app/core/interfaces/project-task.interface';
import { Project } from 'src/app/core/interfaces/project.interface';
import { AlertControllerService } from 'src/app/core/services/alert-controller.service';
import { ProjectTasksService } from 'src/app/core/services/project-tasks.service';
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

    taskActionButtonsState = {
        disabledEdit: true,
        disabledDelete: true,
        disabledNew: false
    };

    generalTasksCheckValue = false;

    confirmModalMessage: string;
    editMemberSelected?: string;
    showNewProjectTaskModal: boolean;
    showConfirmModalDeleteProjectTasks: boolean;
    showEditProjectTaskModal: boolean;
    projectTaskSelectedToEdit?: ProjectTask;
    showEditProjectModal: boolean;

    constructor(
        private activateRoute: ActivatedRoute,
        private projectService: ProjectsService,
        private projectTasksService: ProjectTasksService,
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

        this.confirmModalMessage = '';
        this.showNewProjectTaskModal = false;
        this.showConfirmModalDeleteProjectTasks = false;
        this.showEditProjectTaskModal = false;
        this.showEditProjectModal = false;
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
                    this.projectTasksList = projectData.projectTasks.map((t: any) => ({ task: t, selected: false }));
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
        return this.projectTasksService.getProjectTasks(projectId)
            .pipe(take(1));
    }

    getPriorityText(priorityValue: number) {
        if (priorityValue === TaskPriorityValues.HIGH) return 'Alta';
        if (priorityValue === TaskPriorityValues.MEDIUM) return 'Media';
        if (priorityValue === TaskPriorityValues.LOW) return 'Baja';

        return 'Sin prioridad';
    }

    getPriorityBageColor(priorityValue: number) {
        if (priorityValue === TaskPriorityValues.HIGH) return 'badge-error';
        if (priorityValue === TaskPriorityValues.MEDIUM) return 'badge-warning';
        if (priorityValue === TaskPriorityValues.LOW) return 'badge-success';

        return '';
    }

    onGeneralTasksCheckChange(enabled: boolean) {
        this.taskActionButtonsState = {
            disabledEdit: !enabled || (enabled && this.projectTasksList.length > 1) || (enabled && this.projectTasksList.length === 0),
            disabledDelete: !enabled || (enabled && this.projectTasksList.length === 0),
            disabledNew: false
        };

        this.projectTasksList.forEach(item => {
            item.selected = enabled;
        });
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

    openNewProjectTaskModal() {
        this.showNewProjectTaskModal = true;
    }

    async onCloseNewProjectTaskModal(modalValue: ModalCloseValue<ProjectTask>) {
        this.showNewProjectTaskModal = false;
        if (modalValue.action !== 'ok' || !modalValue.value || !this.project || !this.project.id) return;
        modalValue.value.project_id = this.project.id;
        const result = await this.projectTasksService.saveNewProjectTask(modalValue.value, this.project.id);

        if (result instanceof Error) {
            this.alertController.showAlert(this.containerRef, result.message, 'error', 3000);
            return;
        }

        this.alertController.showAlert(this.containerRef, 'Tarea guardad exitosamente', 'success', 2000);
        modalValue.value.id = result.id;
        this.projectTasks.unshift(modalValue.value);
        this.projectTasksList.unshift({ selected: false, task: modalValue.value });
    }

    deleteProjectTasks() {
        this.showConfirmModalDeleteProjectTasks = true;
        this.confirmModalMessage = 'Se eliminaran las tareas seleccionadas, desea continuar?';
    }

    async onCloseDeleteProjectTasksConfirmModal(modalValue: ModalCloseValue<any>) {
        this.showConfirmModalDeleteProjectTasks = false;
        const projectTasksSelected = this.projectTasksList.filter(item => item.selected);
        if (modalValue.action !== 'ok' || projectTasksSelected.length === 0 || !this.project || !this.project.id) return;

        const projectTaskIds: string[] = [];
        for (const item of projectTasksSelected) {
            if (item.task.id) projectTaskIds.push(item.task.id);
        }
        const result = await this.projectTasksService.deleteProjectTasks(projectTaskIds, this.project.id);

        if (result instanceof Error) {
            this.alertController.showAlert(this.containerRef, result.message, 'error', 3000); return;
        }

        this.alertController.showAlert(this.containerRef, 'Tareas eliminadas con exito', 'success', 2000);
        this.taskActionButtonsState = {
            disabledEdit: true,
            disabledDelete: true,
            disabledNew: false
        };
        this.generalTasksCheckValue = false;
        const newProjectTasksList = this.projectTasksList.filter(item => !item.selected);
        this.projectTasksList.length = 0;
        this.projectTasksList = newProjectTasksList;
        this.projectTasks.length = 0;
        this.projectTasks = newProjectTasksList.map(item => item.task);
    }

    openEditProjectTaskModal() {
        const projectTasksSelected = this.projectTasksList.filter(item => item.selected);
        if (projectTasksSelected.length !== 1) return;
        this.showEditProjectTaskModal = true;
        this.projectTaskSelectedToEdit = projectTasksSelected[0].task;
    }

    async onCloseEditProjectTaskModal(modalValue: ModalCloseValue<Partial<ProjectTask>>) {
        this.showEditProjectTaskModal = false;
        const projectTasksSelected = this.projectTasksList.filter(item => item.selected);
        if (modalValue.action !== 'ok' || !modalValue.value || projectTasksSelected.length !== 1 || !this.project || !this.project.id) return;

        const result = await this.projectTasksService.updateProjectTask(modalValue.value, this.project.id);
        if (result instanceof Error) {
            this.alertController.showAlert(this.containerRef, result.message, 'error', 3000);
            return;
        }

        this.alertController.showAlert(this.containerRef, 'Cambios guardados con exito', 'success', 2000);
        for (const item of this.projectTasksList) {
            if (item.selected) {
                item.task = {
                    ...item.task,
                    ...modalValue.value
                };
                break;
            }
        }
    }

    openEditProjectModal() {
        this.showEditProjectModal = true;
    }

    onCloseEditProjectModal(modalValue: ModalCloseValue<Partial<Project>>) {
        this.showEditProjectModal = false;
        if (modalValue.action === 'cancel' || !modalValue.value || !this.project || !this.project.id) return;

        const result = this.projectService.updateProject(modalValue.value, this.project.id);

        if (result instanceof Error) {
            this.alertController.showAlert(this.containerRef, result.message, 'error', 3000);
            return;
        }

        this.alertController.showAlert(this.containerRef, 'Cambios guardados con exito', 'success', 2000);
        this.project.name = modalValue.value.name ?? this.project.name;
        this.project.description = modalValue.value.description ?? this.project.description;
        this.project.completed = modalValue.value.completed ?? this.project.completed;
    }
}
