export enum WorkflowType {
    PROTOTYPING = 'Prototyping',
}

export type TimeRangeData = {
    startDate: string
    endDate: string
}

export type WorkflowRunHeatmap = {
    date: string
    runCount: number
}