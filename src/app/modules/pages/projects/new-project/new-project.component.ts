import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-new-project',
    templateUrl: './new-project.component.html',
    styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

    @HostBinding('id') containerId = 'new-project-container';

    newProjectForm: FormGroup;
    membersProjectForm: FormGroup;
    members: string[];

    constructor() {
        this.newProjectForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('')
        });

        this.membersProjectForm = new FormGroup({
            member: new FormControl('', [Validators.pattern(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/)])
        });
        this.members = [];
    }

    ngOnInit(): void {
    }

}
