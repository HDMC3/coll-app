import { TaskFilterOptionValues, SortOptionsValues, ProjectFilterOptionValues } from './enums';
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

const sortProjectsOptions: SelectOption[] = [
    {
        text: 'Mas recientes',
        value: SortOptionsValues.RECENT
    },
    {
        text: 'Mas antiguos',
        value: SortOptionsValues.OLDEST
    }
];

const filterTasksOptions: FilterOption[] = [
    {
        text: 'Todas',
        value: TaskFilterOptionValues.ALL,
        sortOptions: sortTasksOptions
    },
    {
        text: 'Completadas',
        value: TaskFilterOptionValues.COMPLETED,
        sortOptions: sortTasksOptions
    },
    {
        text: 'Pendientes',
        value: TaskFilterOptionValues.PENDING,
        sortOptions: sortTasksOptions
    }
];

const filterTasksPriorityOptions: FilterOption[] = [
    {
        text: 'Alta',
        value: TaskFilterOptionValues.PRIORITY_HIGH,
        sortOptions: sortTasksOptions
    },
    {
        text: 'Media',
        value: TaskFilterOptionValues.PRIORITY_MEDIUM,
        sortOptions: sortTasksOptions
    },
    {
        text: 'Baja',
        value: TaskFilterOptionValues.PRIORITY_LOW,
        sortOptions: sortTasksOptions
    },
    {
        text: 'Ninguna',
        value: TaskFilterOptionValues.NO_PRIORITY,
        sortOptions: sortTasksOptions
    }
];

const filterProjectsOptions: FilterOption[] = [
    {
        value: ProjectFilterOptionValues.OWN,
        text: 'Propios',
        sortOptions: sortProjectsOptions
    },
    {
        value: ProjectFilterOptionValues.COLLABORATOR,
        text: 'Colaborador',
        sortOptions: sortProjectsOptions
    },
    {
        value: ProjectFilterOptionValues.COMPLETED,
        text: 'Completados',
        sortOptions: sortProjectsOptions
    },
    {
        value: ProjectFilterOptionValues.IN_PROGRESS,
        text: 'En progreso',
        sortOptions: sortProjectsOptions
    }
];

export {
    filterTasksOptions,
    filterTasksPriorityOptions,
    filterProjectsOptions
};
