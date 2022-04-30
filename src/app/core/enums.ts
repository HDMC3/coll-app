export enum TaskPriorityValues {
    HIGH,
    MEDIUM,
    LOW,
    NO_PRIORITY
}

export enum FilterOptionValues {
    PRIORITY_HIGH = TaskPriorityValues.HIGH,
    PRIORITY_MEDIUM = TaskPriorityValues.MEDIUM,
    PRIORITY_LOW = TaskPriorityValues.LOW,
    NO_PRIORITY = TaskPriorityValues.NO_PRIORITY,
    ALL,
    COMPLETED,
    PENDING
};

export enum SortOptionsValues {
    RECENT,
    OLDEST
}
