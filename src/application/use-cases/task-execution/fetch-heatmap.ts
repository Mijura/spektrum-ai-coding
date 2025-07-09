import { TaskExecutionRepository } from "@domain/repositories/task-execution-repository"
import { TimeRangeData, TaskExecutionHeatmap } from "@domain/types/task-execution"
import { FetchTaskExecutionsHeatmap } from "@domain/use-cases/task-execution/fetch-heatmap"

export class FetchTaskExecutionsHeatmapUseCase implements FetchTaskExecutionsHeatmap{

    constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}


    execute(accountId: string, timeRange: TimeRangeData): Promise<TaskExecutionHeatmap[]> {
        
        return this.taskExecutionRepository.getHeatmap(accountId, timeRange)
    }

    
}