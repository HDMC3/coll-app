import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { Project } from 'src/app/core/interfaces/project.interface';
import { AlertControllerService } from 'src/app/core/services/alert-controller.service';
import { ProjectsService } from 'src/app/core/services/projects.service';

@Component({
    selector: 'app-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

    projectId?: string;
    loading: boolean;
    project?: Project;

    constructor(
        private activateRoute: ActivatedRoute,
        private projectService: ProjectsService,
        private alertController: AlertControllerService,
        private containerRef: ViewContainerRef
    ) {
        this.activateRoute.params.pipe(take(1)).subscribe({
            next: (params) => {
                this.projectId = params['project_id'];
            }
        });
        this.loading = true;
    }

    ngOnInit() {
        if (this.projectId) {
            this.getProject(this.projectId);
        }
    }

    getProject(projectId: string) {
        this.loading = true;
        this.projectService.getProject(projectId)
            .pipe(take(1))
            .subscribe({
                next: (project) => {
                    this.project = project;
                    this.loading = false;
                },
                error: er => {
                    this.alertController.showAlert(this.containerRef, er.message ? er.message : 'Problema al cargar el proyecto', 'error', 3000);
                    this.loading = false;
                }
            });
    }

}
