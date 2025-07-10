import { PlanTasksWithAI } from "@domain/use-cases/project/plan-tasks-with-ai"
import { Task } from "@domain/entities/task"
import { ProjectService } from "@domain/ports/project-service"    
import { Contributor } from "@domain/ports/contirbutor"

export class PlanTasksWithAIUseCase implements PlanTasksWithAI {
	constructor(
        private readonly productOwner: Contributor,
        private readonly projectService: ProjectService
	) {}
    
    async execute(projectId: string, projectDescription: string): Promise<Task[]> {

        console.log("Planning tasks with AI")
        const task = Task.create("Product Owner", projectId, "Plan Tasks", projectDescription)
        await this.projectService.updateDetailsWithAI(task)

        return await this.productOwner.execute(task)
    }
    
}