import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        TasksComponent,
        HomeComponent,
        NavbarComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TasksRoutingModule
    ]
})
export class TasksModule { }
