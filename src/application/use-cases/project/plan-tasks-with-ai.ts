import { PlanTasksWithAI } from "@domain/use-cases/project/plan-tasks-with-ai"
import { Task } from "@domain/entities/task"
import { MarketingService } from "@domain/ports/services/marketing-service"    
import { Contributor } from "@domain/ports/ai/contributor"

export class PlanTasksWithAIUseCase implements PlanTasksWithAI {
	constructor(
        private readonly productOwner: Contributor,
        private readonly marketingService: MarketingService
	) {}
    
    async execute(projectId: string, projectDescription: string): Promise<Task[]> {

        console.log("Planning tasks with AI")
        const task = Task.create("Product Owner", projectId, "Plan Tasks", projectDescription)
        await this.marketingService.updateProjectDetails(task)

        return await this.productOwner.execute(task)
    }
    
}