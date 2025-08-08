import { PlanTasksWithAI } from "@domain/use-cases/project/plan-tasks-with-ai"
import { Task } from "@domain/entities/task"
import { MarketingService } from "@domain/ports/services/marketing-service"    
import { Contributor } from "@domain/ports/ai/contributor"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"

export class PlanTasksWithAIUseCase implements PlanTasksWithAI {
	constructor(
        private readonly productOwner: Contributor,
        private readonly marketingService: MarketingService,
        private readonly projectRepository: ProjectRepository
	) {}
    
    async execute(projectId: string, projectDescription: string): Promise<Task[]> {

        console.log("Planning tasks with AI")
        const task = Task.create("Product Owner", projectId, "Plan Tasks", projectDescription)
        await this.marketingService.updateProjectDetails(task)

        const tasks = await this.productOwner.execute(task)

        // Save all tasks
        const taskToSave = []
        for (const task of tasks) {
            taskToSave.push(this.projectRepository.save(task))
        }

        await Promise.all(taskToSave)

        return tasks
    }
    
}