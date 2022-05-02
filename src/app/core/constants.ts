import { FilterOptionValues, SortOptionsValues } from './enums';
import { FilterOption } from './interfaces/filter-option.interface';
import { SelectOption } from './interfaces/select-option.interface';

const sortTasksOptions: SelectOption[] = [
    {
        text: 'Mas recientes',
        value: SortOptionsValues.RECENT
    },
    {
        text: 'Mas antiguas',
        value: SortOptionsValues.OLDEST
    }
];

const filterTasksOptions: FilterOption[] = [
    {
        text: 'Todas',
        value: FilterOptionValues.ALL,
        sortOptions: sortTasksOptions
    },
    {
        text: 'Completadas',
        value: FilterOptionValues.COMPLETED,
        sortOptions: sortTasksOptions
    },
    {
        text: 'Pendientes',
        value: FilterOptionValues.PENDING,
        sortOptions: sortTasksOptions
    }
];

const filterTasksPriorityOptions: FilterOption[] = [
    {
        text: 'Alta',
        value: FilterOptionValues.PRIORITY_HIGH,
        sortOptions: sortTasksOptions
    },
    {
        text: 'Media',
        value: FilterOptionValues.PRIORITY_MEDIUM,
        sortOptions: sortTasksOptions
    },
    {
        text: 'Baja',
        value: FilterOptionValues.PRIORITY_LOW,
        sortOptions: sortTasksOptions
    },
    {
        text: 'Ninguna',
        value: FilterOptionValues.NO_PRIORITY,
        sortOptions: sortTasksOptions
    }
];

export {
    filterTasksOptions,
    filterTasksPriorityOptions
};
