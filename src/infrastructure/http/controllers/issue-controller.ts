import { Request, Response } from "express"
import { IssueDtoMapper } from "@application/mappers/issue-dto-mapper"
import { leaveComment, prototypingWorkflow, fetchProject, updateIssueDescription, fetchIssues, createIssue, updateIssueTitle } from "@infrastructure/dependencies"
import { IssueDto } from "@application/dto/issue"
import { Issue } from "@domain/entities/issue"

export class IssueController {

	constructor() {}

	async createIssue(req: Request, res: Response): Promise<void> {
		try {
			const { projectId, title, description } = req.body
			const issue: Issue = await createIssue.execute(projectId, title, description)
			res.status(201).json(issue)
		} catch (error) {
			console.error("Error creating issue:", error)
			res.status(500).json({ message: "Error creating issue." })
		}
	}

	async updateIssueTitle(req: Request, res: Response): Promise<void> {
		try {
			const issueDto: IssueDto = req.body
			const updatedIssue: Issue = await updateIssueTitle.execute(issueDto)
			res.status(200).json(updatedIssue)
		} catch (error) {
			// TODO: Handle Issue Not Found
			console.error("Error updating issue title:", error)
			res.status(500).json({ message: "Error updating issue title." })
		}
    }

	async updateIssueDescription(req: Request, res: Response): Promise<void> {
		try {
			const issueDto: IssueDto = req.body
			const updatedIssue: Issue = await updateIssueDescription.execute(issueDto)
			res.status(200).json(updatedIssue)
		} catch (error) {
			// TODO: Handle Issue Not Found
			console.error("Error updating issue description:", error)
			res.status(500).json({ message: "Error updating issue description." })
		}
	}

	async fetchIssues(req: Request, res: Response): Promise<any> {

		try {
			const { projectId } = req.params
			console.log(`Fetching all issues for project: ${projectId}`)
			const issues: Issue[] = await fetchIssues.execute(projectId)
			const issueDtos: IssueDto[] = IssueDtoMapper.toDtos(issues)
			res.json(issueDtos)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching issues:", error)
			res.status(500).json({ message: "Error fetching issues" })
		}

    }

	async leaveComment(req: Request, res: Response): Promise<void> {
		try {
			const { issueId, authorId, commentText } = req.body
			const issue = await leaveComment.execute(issueId, authorId, commentText)
			const project = await fetchProject.execute(issue.projectId)
			await prototypingWorkflow.run(project, issue)
			res.status(200).json(issue)
		} catch (error) {
			console.error("Error adding comment:", error)
			res.status(500).json({ message: "Error adding comment." })
		}
	}


}
