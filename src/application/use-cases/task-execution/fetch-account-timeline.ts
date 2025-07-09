import { TaskExecution } from "@domain/entities/task-execution"
import { TaskExecutionRepository } from "@domain/repositories/task-execution-repository"
import { PaginationData } from "@domain/types/activity"
import { FetchTaskExecutionsTimeline } from "@domain/use-cases/task-execution/fetch-timeline"

export class FetchTimelineByAccountIdUseCase implements FetchTaskExecutionsTimeline {
    constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

    async execute(accountId: string, pagination: PaginationData): Promise<TaskExecution[]> {
        return await this.taskExecutionRepository.getTimelineByAccountId(accountId, pagination)
    }
}