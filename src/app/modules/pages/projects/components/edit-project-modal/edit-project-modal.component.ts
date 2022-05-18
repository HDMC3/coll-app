import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { ModalCloseValue } from 'src/app/core/interfaces/modal-close-value.interface';
import { Project } from 'src/app/core/interfaces/project.interface';

@Component({
    selector: 'app-edit-project-modal',
    templateUrl: './edit-project-modal.component.html',
    styleUrls: ['./edit-project-modal.component.scss'],
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
export class EditProjectModalComponent implements OnInit {

    @HostBinding('class') componentClass = 'modal modal-bottom sm:modal-middle';
    @HostBinding('@hiddeModal') hideModalAnimation = '';
    @Output() closeModal = new EventEmitter<ModalCloseValue<Partial<Project>>>();
    @Input() project?: Project;

    nameFormControl: FormControl;
    descriptionFormControl: FormControl;
    completedFormControl: FormControl;
    projectForm: FormGroup;

    constructor() {
        this.nameFormControl = new FormControl('', [Validators.required, this.noEmpty]);
        this.descriptionFormControl = new FormControl('', [Validators.required, this.noEmpty]);
        this.completedFormControl = new FormControl(false, [Validators.required]);
        this.projectForm = new FormGroup({
            name: this.nameFormControl,
            description: this.descriptionFormControl,
            completed: this.completedFormControl
        });
    }

    ngOnInit() {
        if (this.project) {
            this.projectForm.setValue({
                name: this.project.name,
                description: this.project.description,
                completed: this.project.completed
            });
        }

        setTimeout(() => {
            this.componentClass += ' modal-open';
        }, 50);
    }

    close() {
        this.closeModal.emit({ action: 'cancel' });
    }

    @HostListener('click', ['$event'])
    onClickComponent(event: any) {
        if (event.target.classList.contains('modal')) {
            this.closeModal.emit({ action: 'cancel' });
        }
    }

    noEmpty(control: FormControl) {
        if (control.value.replace(/\s/g, '').length === 0) {
            return {
                empty: true
            };
        }
        return null;
    }

    saveProject() {
        if (this.projectForm.invalid) return;
        const editedProject: Partial<Project> = {
            name: this.nameFormControl.value,
            description: this.descriptionFormControl.value,
            completed: this.completedFormControl.value,
            modification_date: Timestamp.now()
        };

        this.closeModal.emit({ action: 'ok', value: editedProject });
    }

}
