export enum TaskExecutionStatus {
    RUNNING = "Running",
    SUCCEEDED = "Succeeded",
    FAILED = "Failed"
}
export type TaskExecution = {
    id: string;
    title: string;
    projectId: string;
    taskId: string;
    accountId: string;
    status: TaskExecutionStatus;
    occurredAt: string;
    error?: string;
};