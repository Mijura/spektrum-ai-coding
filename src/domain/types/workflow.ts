export enum WorkflowType {
    FRONTEND_DEVELOPMENT = 'Frontend Development',
}

export type TimeRangeData = {
    startDate: string
    endDate: string
}

export type TaskExecutionHeatmap = {
    date: string
    runCount: number
}