import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewTaskModalComponent } from './components/new-task-modal/new-task-modal.component';
import { EditTaskModalComponent } from './components/edit-task-modal/edit-task-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
    declarations: [
        TasksComponent,
        NewTaskModalComponent,
        EditTaskModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TasksRoutingModule,
        SharedModule
    ]
})
export class TasksModule { }
