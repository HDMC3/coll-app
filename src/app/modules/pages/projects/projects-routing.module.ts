import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewProjectComponent } from './new-project/new-project.component';
import { ProjectDetailMemberComponent } from './project-detail-member/project-detail-member.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectsComponent } from './projects.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectsComponent
    },
    {
        path: 'new-project',
        component: NewProjectComponent
    },
    {
        path: 'o/:project_id',
        component: ProjectDetailComponent
    },
    {
        path: 'c/:project_id',
        component: ProjectDetailMemberComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule { }
