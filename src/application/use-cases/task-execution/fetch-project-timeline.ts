import { TaskExecution } from "@domain/entities/task-execution"
import { TaskExecutionRepository } from "@domain/repositories/task-execution-repository"
import { PaginationData } from "@domain/value-objects/activity"
import { FetchTaskExecutionsTimeline } from "@domain/use-cases/task-execution/fetch-timeline"

export class FetchTimelineByProjectIdUseCase implements FetchTaskExecutionsTimeline {
    constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

    async execute(projectId: string, pagination: PaginationData): Promise<TaskExecution[]> {
        return await this.taskExecutionRepository.getTimelineByProjectId(projectId, pagination)
    }
}