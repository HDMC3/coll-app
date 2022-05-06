import { Component, HostBinding, OnInit } from '@angular/core';
import { filterProjectsOptions } from 'src/app/core/constants';
import { FilterOption } from 'src/app/core/interfaces/filter-option.interface';
import { SelectOption } from 'src/app/core/interfaces/select-option.interface';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

    @HostBinding('id') projectsContainerId = 'projects-page-container';

    filterOptions: FilterOption[];
    sortOptions: SelectOption[];
    filterOptionSelected: FilterOption;
    sortOptionSelected: SelectOption;

    constructor() {
        this.filterOptions = filterProjectsOptions;
        this.filterOptionSelected = this.filterOptions[0];
        this.sortOptions = this.filterOptionSelected.sortOptions;
        this.sortOptionSelected = this.sortOptions[0];
    }

    ngOnInit(): void {
    }

}
