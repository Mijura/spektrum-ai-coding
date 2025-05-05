import { CreateIssue } from "@domain/use-cases/issue/create-issue"
import { Issue } from "@domain/entities/issue"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { Workflow } from "@domain/entities/workflow/workflow"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { Project } from "@domain/entities/project"
export class CreateIssueUseCase implements CreateIssue {
	constructor(
		private readonly issueRepository: IssueRepository,
		private readonly projectRepository: ProjectRepository,
		private readonly issueRefiningWorkflow: Workflow,
		private readonly projectRefiningWorkflow: Workflow
	) {}

	async execute(projectId: string, title: string, description: string): Promise<Issue> {
		try {
			// Create a new issue
			const issue: Issue = Issue.create('User', projectId, title, description)
			const refinedIssue = await this.issueRefiningWorkflow.run(issue)

			// Refine project details
			
			const project: Project = await this.projectRepository.findById(projectId)
			if (!project) {
				throw new Error("Project not found")
			}

			if (!project.detailsUpdated) {
				const projectDetails = await this.projectRefiningWorkflow.run(refinedIssue)
				project.updateDetails(projectDetails.title, projectDetails.description)
				await this.projectRepository.save(project)
			}
			// Persist the issue in the database
			const savedIssue = await this.issueRepository.save(refinedIssue)
			
			return savedIssue
		} catch (error) {
			console.error("Error creating new issue:", error)
			throw new Error("Failed to create new issue.")
		}
	}
}
