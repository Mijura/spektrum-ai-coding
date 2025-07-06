import { PlanTasksWithAI } from "@domain/use-cases/project/plan-tasks-with-ai"
import { Task } from "@domain/entities/task"

export class PlanTasksWithAIUseCase implements PlanTasksWithAI {
	constructor(
		private readonly taskPlanningWorkflow: any
	) {}
    
    async execute(projectId: string, projectDescription: string): Promise<Task[]> {

        console.log("Planning tasks with AI")
        const task = Task.create("Product Owner", projectId, "Plan Tasks", projectDescription)
        return await this.taskPlanningWorkflow.run(task)
    }
    
}