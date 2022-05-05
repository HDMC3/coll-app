import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ModalCloseValue } from 'src/app/core/interfaces/modal-close-value.interface';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss'],
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
export class ConfirmModalComponent implements AfterViewInit {

    @HostBinding('class') modalClass = 'modal modal-bottom sm:modal-middle';
    @HostBinding('@hiddeModal') animationHiddeModal = '';
    @Input() message: string = 'Esta seguro?';
    @Output() closeModal = new EventEmitter<ModalCloseValue<any>>();

    constructor() { }

    ngAfterViewInit() {
        setTimeout(() => {
            this.modalClass += ' modal-open';
        }, 200);
    }

    cancel() {
        this.closeModal.emit({ action: 'cancel' });
    }

    confirm() {
        this.closeModal.emit({ action: 'ok' });
    }

}
