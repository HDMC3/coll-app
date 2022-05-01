import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    animations: [
        trigger('toggleAlert', [
            transition(':enter', [
                style({
                    opacity: '0',
                    transform: 'scale(0.9)'
                }),
                animate('0.1s', style({
                    opacity: '1',
                    transform: 'scale(1.1)'
                })),
                animate('0.1s', style({
                    transform: 'scale(1)'
                }))
            ])
        ])
    ]
})
export class AlertComponent {

    message: string;
    type?: 'success' | 'warning' | 'error';
    horizontal?: 'left' | 'center' | 'right' = 'right';
    vertical?: 'top' | 'bottom' = 'top';

    constructor() {
        this.message = '';
    }

}
