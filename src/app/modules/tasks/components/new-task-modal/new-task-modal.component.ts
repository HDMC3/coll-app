import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostBinding, HostListener, OnInit, Output } from '@angular/core';
import { TaskPriorityValues } from 'src/app/core/enums';
import { ModalCloseValue } from 'src/app/core/interfaces/modal-close-value.interface';
import { SelectOption } from 'src/app/core/interfaces/select-option.interface';
import { Task } from 'src/app/core/interfaces/task.interface';

@Component({
    selector: 'app-new-task-modal',
    templateUrl: './new-task-modal.component.html',
    styleUrls: ['./new-task-modal.component.scss'],
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
                // animate('0.25s', style({
                //     opacity: '1',
                //     transform: 'translateY(0)'
                // }))
            ])
        ])
    ]
})
export class NewTaskModalComponent implements OnInit {

    @HostBinding('class') modalClass = 'modal modal-bottom sm:modal-middle';
    @HostBinding('id') componentId = 'new-task-modal';
    @HostBinding('@hiddeModal') animationModal = '';
    @Output() closeModal = new EventEmitter<ModalCloseValue<Task>>();
    task?: Task;
    priorityOptions: SelectOption[] = [
        { value: TaskPriorityValues.HIGH, text: 'Alta' },
        { value: TaskPriorityValues.MEDIUM, text: 'Media' },
        { value: TaskPriorityValues.LOW, text: 'Baja' },
        { value: TaskPriorityValues.NO_PRIORITY, text: 'Sin prioridad' }
    ];

    constructor() {
    }

    ngOnInit(): void {
        this.modalClass = this.modalClass + ' modal-open';
    }

    close() {
        this.closeModal.emit({ action: 'cancel', value: undefined });
    }

    @HostListener('click', ['$event'])
    onClickComponent(event: any) {
        if (event.target.classList.contains('modal')) {
            this.closeModal.emit({ action: 'cancel', value: undefined });
        }
    }

    saveTask() {
        this.closeModal.emit({ action: 'ok', value: undefined });
    }

}
