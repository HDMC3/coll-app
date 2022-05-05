import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewTaskModalComponent } from './components/new-task-modal/new-task-modal.component';
import { EditTaskModalComponent } from './components/edit-task-modal/edit-task-modal.component';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';


@NgModule({
    declarations: [
        TasksComponent,
        NewTaskModalComponent,
        EditTaskModalComponent,
        ConfirmModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TasksRoutingModule
    ]
})
export class TasksModule { }
