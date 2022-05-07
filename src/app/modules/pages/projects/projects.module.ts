import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { FormsModule } from '@angular/forms';
import { NewProjectComponent } from './new-project/new-project.component';


@NgModule({
    declarations: [
        ProjectsComponent,
        NewProjectComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ProjectsRoutingModule
    ]
})
export class ProjectsModule { }
