import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewTaskModalComponent } from './components/new-task-modal/new-task-modal.component';
import { EditTaskModalComponent } from './components/edit-task-modal/edit-task-modal.component';


@NgModule({
    declarations: [
        TasksComponent,
        HomeComponent,
        NavbarComponent,
        NewTaskModalComponent,
        EditTaskModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TasksRoutingModule
    ]
})
export class TasksModule { }
