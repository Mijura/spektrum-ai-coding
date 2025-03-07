import { ProjectDetails } from "@domain/entities/project-details"
import { DevelopUserRequestUseCase } from "@domain/use-cases/develop-user-request-use-case"
import { ProjectStorage } from "@domain/persistence/project-storage"
import { CodeGenerationWorkflow } from "@domain/workflows/code-generation"

export class DevelopUserRequest implements DevelopUserRequestUseCase {
	constructor(private readonly projectStorage: ProjectStorage, private readonly codeGenerationWorkflow: CodeGenerationWorkflow) {}

	async execute(projectId: string, message: string): Promise<ProjectDetails> {

		const projectDetails = await this.projectStorage.findById(projectId)
		if (!projectDetails) {
			throw new Error("Project not found")
		}
		return this.codeGenerationWorkflow.execute(projectDetails, message)
	}
}
