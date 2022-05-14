import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewProjectComponent } from './new-project/new-project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { NewMemberModalComponent } from './components/new-member-modal/new-member-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditMemberModalComponent } from './components/edit-member-modal/edit-member-modal.component';
import { NewProjectTaskModalComponent } from './components/new-project-task-modal/new-project-task-modal.component';


@NgModule({
    declarations: [
        ProjectsComponent,
        NewProjectComponent,
        ProjectDetailComponent,
        NewMemberModalComponent,
        EditMemberModalComponent,
        NewProjectTaskModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ProjectsRoutingModule,
        SharedModule
    ]
})
export class ProjectsModule { }
