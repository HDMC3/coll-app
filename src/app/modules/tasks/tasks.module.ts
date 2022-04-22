import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './layout/navbar/navbar.component';


@NgModule({
    declarations: [
        TasksComponent,
        HomeComponent,
        NavbarComponent
    ],
    imports: [
        CommonModule,
        TasksRoutingModule
    ]
})
export class TasksModule { }
