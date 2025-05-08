import { WorkflowRunRepository } from "@domain/repositories/workflow-run-repository"
import { TimeRangeData, WorkflowRunHeatmap } from "@domain/types/workflow"
import { FetchWorkflowRunsHeatmap } from "@domain/use-cases/workflow-run/fetch-heatmap"

export class FetchWorkflowRunsHeatmapUseCase implements FetchWorkflowRunsHeatmap{

    constructor(private readonly workflowRunRepository: WorkflowRunRepository) {}


    execute(accountId: string, timeRange: TimeRangeData): Promise<WorkflowRunHeatmap[]> {
        
        return this.workflowRunRepository.getHeatmap(accountId, timeRange)
    }

    
}