import { TaskExecutionRepository } from "@domain/ports/repositories/task-execution-repository"
import { TimeRangeData, TaskExecutionHeatmap } from "@domain/value-objects/task-execution"
import { FetchTaskExecutionsHeatmap } from "@domain/use-cases/task-execution/fetch-heatmap"

export class FetchTaskExecutionsHeatmapUseCase implements FetchTaskExecutionsHeatmap{

    constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}


    execute(accountId: string, timeRange: TimeRangeData): Promise<TaskExecutionHeatmap[]> {
        
        return this.taskExecutionRepository.getHeatmap(accountId, timeRange)
    }

    
}