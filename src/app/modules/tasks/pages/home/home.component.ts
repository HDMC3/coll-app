import { Component, HostBinding, OnInit, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs';
import { filterTasksOptions, filterTasksPriorityOptions } from 'src/app/core/constants';
import { FilterOption } from 'src/app/core/interfaces/filter-option.interface';
import { ModalCloseValue } from 'src/app/core/interfaces/modal-close-value.interface';
import { SelectOption } from 'src/app/core/interfaces/select-option.interface';
import { Task } from 'src/app/core/interfaces/task.interface';
import { AlertControllerService } from 'src/app/core/services/alert-controller.service';
import { TasksService } from 'src/app/core/services/tasks.service';
import { NewTaskModalComponent } from '../../components/new-task-modal/new-task-modal.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @HostBinding('id') homePageId = 'home-page-container';

    tasks: Task[];
    filterOptions: FilterOption[];
    filterPriorityOptions: FilterOption[];

    filterOptionSelected: FilterOption;
    sortOptionSelected: SelectOption;

    searchedValue: string;

    limitTasks: number;

    loadingTasks: boolean;
    disableNextButton: boolean;
    disablePrevButton: boolean;

    lastFilterValue: number;
    lastSortValue: number;

    showNewTaskModal: boolean;

    newTaskModal?: NewTaskModalComponent;

    constructor(private tasksService: TasksService, private alertControllerService: AlertControllerService, private containerRef: ViewContainerRef) {
        this.tasks = [];

        this.filterOptions = filterTasksOptions;

        this.filterPriorityOptions = filterTasksPriorityOptions;

        this.filterOptionSelected = this.filterOptions[0];
        this.lastFilterValue = this.filterOptionSelected.value;
        this.sortOptionSelected = this.filterOptionSelected.sortOptions[0];
        this.lastSortValue = this.sortOptionSelected.value;

        this.searchedValue = '';

        this.limitTasks = 10;

        this.loadingTasks = false;
        this.disablePrevButton = true;
        this.disableNextButton = false;

        this.showNewTaskModal = false;
    }

    ngOnInit(): void {
        this.getTasks();
    }

    onFilterOptionChange(value: FilterOption) {
        const currentSortOption = value.sortOptions.find(opt => opt.value === this.sortOptionSelected.value);
        if (currentSortOption) {
            this.sortOptionSelected = currentSortOption;
        } else {
            this.sortOptionSelected = value.sortOptions[0];
        }
    }

    getTasks() {
        this.loadingTasks = true;
        this.disablePrevButton = true;
        this.disableNextButton = false;
        this.tasksService.getTasks(this.filterOptionSelected.value, this.sortOptionSelected.value, this.limitTasks).pipe(take(1)).subscribe({
            next: (tasks) => {
                this.tasks = tasks;
                this.disablePrevButton = tasks.length < this.limitTasks;
                this.disableNextButton = tasks.length < this.limitTasks;
                this.loadingTasks = false;
            },
            error: _ => {
                this.loadingTasks = false;
                this.disablePrevButton = true;
                this.disableNextButton = true;
            }
        });
    }

    applyFilter() {
        if (this.filterOptionSelected.value === this.lastFilterValue && this.sortOptionSelected.value === this.lastSortValue) return;
        this.lastFilterValue = this.filterOptionSelected.value;
        this.lastSortValue = this.sortOptionSelected.value;
        this.getTasks();
    }

    getTasksPage(directionPage: 'next' | 'prev') {
        this.loadingTasks = true;
        this.tasksService.getTasksPage(
            this.filterOptionSelected.value,
            this.sortOptionSelected.value,
            this.limitTasks,
            directionPage
        ).pipe(take(1)).subscribe({
            next: (tasks) => {
                if (tasks) {
                    this.tasks = tasks;
                }

                this.disableNextButton = directionPage === 'next' && tasks === undefined;
                this.disablePrevButton = directionPage === 'prev' && tasks === undefined;

                this.loadingTasks = false;
            },
            error: _ => {
                this.loadingTasks = false;
                this.disableNextButton = true;
                this.disablePrevButton = true;
            }
        });
    }

    openNewTaskModal() {
        this.showNewTaskModal = true;
    }

    async onCloseModal(modalValue: ModalCloseValue<Task>) {
        this.showNewTaskModal = false;
        if (modalValue.action === 'ok' && modalValue.value) {
            const result = await this.tasksService.addNewTask(modalValue.value);
            if (result instanceof Error) {
                this.alertControllerService.showAlert(this.containerRef, result.message, 'error', 2500);
            } else {
                this.alertControllerService.showAlert(this.containerRef, 'Tarea creada con exito', 'success', 2500);
            }
            this.getTasks();
        }
    }

}
