import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskPriorityValues } from 'src/app/core/enums';
import { ModalCloseValue } from 'src/app/core/interfaces/modal-close-value.interface';
import { SelectOption } from 'src/app/core/interfaces/select-option.interface';
import { UserInfo } from '@angular/fire/auth';
import { Task } from 'src/app/core/interfaces/task.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { take } from 'rxjs/operators';
import { Timestamp } from 'firebase/firestore';

@Component({
    selector: 'app-edit-task-modal',
    templateUrl: './edit-task-modal.component.html',
    styleUrls: ['./edit-task-modal.component.scss'],
    animations: [
        trigger('hiddeModal', [
            transition(':leave', [
                style({
                    opacity: '1',
                    visibility: 'visible'
                }),
                animate('0.15s', style({
                    opacity: '0',
                    visibility: 'hidden'
                }))
            ])
        ])
    ]
})
export class EditTaskModalComponent implements OnInit {

    @HostBinding('class') modalClass = 'modal modal-bottom sm:modal-middle';
    @HostBinding('id') componentId = 'edit-task-modal';
    @HostBinding('@hiddeModal') animationModal = '';
    @Output() closeModal = new EventEmitter<ModalCloseValue<any>>();
    @Input() task?: Task;

    priorityOptions: SelectOption[] = [
        { value: TaskPriorityValues.HIGH, text: 'Alta' },
        { value: TaskPriorityValues.MEDIUM, text: 'Media' },
        { value: TaskPriorityValues.LOW, text: 'Baja' },
        { value: TaskPriorityValues.NO_PRIORITY, text: 'Sin prioridad' }
    ];

    formEditTask: FormGroup;
    nameFormControl: FormControl;
    descriptionFormControl: FormControl;
    priorityFormControl: FormControl;
    currentUser?: UserInfo;

    loading: boolean;

    constructor(private authService: AuthService) {
        this.nameFormControl = new FormControl(this.task ? this.task.name : '', [Validators.required]);
        this.descriptionFormControl = new FormControl(this.task ? this.task.description : '');
        this.priorityFormControl = new FormControl(this.task ? this.task.priority : TaskPriorityValues.NO_PRIORITY, [Validators.required]);
        this.formEditTask = new FormGroup({
            name: this.nameFormControl,
            description: this.descriptionFormControl,
            priority: this.priorityFormControl
        });

        this.authService.currentUser.pipe(take(1)).subscribe({
            next: user => {
                if (user) this.currentUser = user;
            }
        });

        this.loading = true;
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.modalClass = this.modalClass + ' modal-open';
        }, 50);
        if (this.task) {
            this.formEditTask.setValue({
                name: this.task?.name,
                description: this.task?.description,
                priority: this.task?.priority
            });
            this.loading = false;
        }
    }

    @HostListener('click', ['$event'])
    onClickComponent(event: any) {
        if (event.target.classList.contains('modal')) {
            this.closeModal.emit({ action: 'cancel' });
        }
    }

    saveTaskChanges() {
        if (this.formEditTask.invalid || !this.currentUser) return;

        this.closeModal.emit({
            action: 'ok',
            value: {
                taskId: this.task?.id,
                changeValues: {
                    name: this.nameFormControl.value,
                    description: this.descriptionFormControl.value,
                    priority: this.priorityFormControl.value,
                    modification_date: Timestamp.now()
                }
            }
        });
    }

    close() {
        this.closeModal.emit({
            action: 'cancel'
        });
    }

}
