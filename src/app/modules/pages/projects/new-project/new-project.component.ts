import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
    selector: 'app-new-project',
    templateUrl: './new-project.component.html',
    styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

    @HostBinding('id') containerId = 'new-project-container';

    constructor() { }

    ngOnInit(): void {
    }

}
