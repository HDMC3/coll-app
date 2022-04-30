import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { NewTaskModalComponent } from './components/new-task-modal/new-task-modal.component';


@NgModule({
    declarations: [
        TasksComponent,
        HomeComponent,
        NavbarComponent,
        NewTaskModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TasksRoutingModule
    ]
})
export class TasksModule { }
