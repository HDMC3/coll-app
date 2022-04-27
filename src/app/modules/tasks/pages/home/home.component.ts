import { Component, HostBinding, OnInit } from '@angular/core';
import { FilterOptionValues, SortOptionsValues } from 'src/app/core/enums';

interface SelectOption {
    text: string;
    value: any;
}
interface FilterOption extends SelectOption{
    sortOptions: SelectOption[];
}
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @HostBinding('id') homePageId = 'home-page-container';

    tasks: any[];
    filterOptions: FilterOption[];
    filterPriorityOptions: FilterOption[];

    commonSortOptions: SelectOption[];
    prioritySortOptions: SelectOption[];

    filterOptionSelected: FilterOption;
    sortOptionSelected: SelectOption;

    searchedValue: string;

    constructor() {
        this.tasks = [];

        this.commonSortOptions = [
            {
                text: 'Mas recientes',
                value: SortOptionsValues.RECENT
            },
            {
                text: 'Mas antiguas',
                value: SortOptionsValues.OLDEST
            }
        ];

        this.prioritySortOptions = [
            {
                text: 'Mas recientes',
                value: SortOptionsValues.RECENT
            },
            {
                text: 'Mas antiguas',
                value: SortOptionsValues.OLDEST
            }
        ];

        this.filterOptions = [
            {
                text: 'Todas',
                value: FilterOptionValues.ALL,
                sortOptions: this.commonSortOptions
            },
            {
                text: 'Completadas',
                value: FilterOptionValues.COMPLETED,
                sortOptions: this.commonSortOptions
            },
            {
                text: 'Pendientes',
                value: FilterOptionValues.PENDING,
                sortOptions: this.commonSortOptions
            }
        ];

        this.filterPriorityOptions = [
            {
                text: 'Alta',
                value: FilterOptionValues.PRIORITY_HIGH,
                sortOptions: this.prioritySortOptions
            },
            {
                text: 'Media',
                value: FilterOptionValues.PRIORITY_MEDIUM,
                sortOptions: this.prioritySortOptions
            },
            {
                text: 'Baja',
                value: FilterOptionValues.PRIORITY_LOW,
                sortOptions: this.prioritySortOptions
            },
            {
                text: 'Ninguna',
                value: FilterOptionValues.NO_PRIORITY,
                sortOptions: this.prioritySortOptions
            }
        ];

        this.filterOptionSelected = this.filterOptions[0];
        this.sortOptionSelected = this.filterOptionSelected.sortOptions[0];

        this.searchedValue = '';

    }

    ngOnInit(): void {
    }

    onFilterOptionChange(value: FilterOption) {
        const currentSortOption = value.sortOptions.find(opt => opt.value === this.sortOptionSelected.value);
        if (currentSortOption) {
            this.sortOptionSelected = currentSortOption;
        } else {
            this.sortOptionSelected = value.sortOptions[0];
        }
    }

}
