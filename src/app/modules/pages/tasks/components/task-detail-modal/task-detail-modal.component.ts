import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';
import { Task } from 'src/app/core/interfaces/task.interface';

@Component({
    selector: 'app-task-detail-modal',
    templateUrl: './task-detail-modal.component.html',
    styleUrls: ['./task-detail-modal.component.scss'],
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
export class TaskDetailModalComponent implements OnInit {

    @HostBinding('class') componentClass = 'modal modal-bottom sm:modal-middle';
    @HostBinding('@hiddeModal') hiddeAnimationComponent = '';
    @Output() closeModal = new EventEmitter();
    @Input() task?: Task;

    constructor() { }

    ngOnInit() {
        setTimeout(() => {
            this.componentClass += ' modal-open';
        }, 50);
    }

    close() {
        this.closeModal.emit();
    }

    @HostListener('click', ['$event'])
    onClickComponent(event: any) {
        if (event.target.classList.contains('modal')) {
            this.closeModal.emit();
        }
    }

}
