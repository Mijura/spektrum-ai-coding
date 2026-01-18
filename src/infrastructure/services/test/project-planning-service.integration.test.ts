import { describe, it, expect, beforeAll } from "@rstest/core"
import { JigJoyProjectPlanningService } from "@infra/services/project-planning/project-planning-service"
import { ContributionType } from "@app/types/contribution"
import { Task, TaskStatus } from "@jigjoy-io/task-contracts"

describe("JigJoyProjectPlanningService Integration Tests", () => {
	let service: JigJoyProjectPlanningService
	let testTaskId: string
	let testProjectId: string
	const testWorkerId = `test-worker-${Date.now()}`
	const testAuthorId = `test-author-${Date.now()}`
	const testOwner = `test-owner-${Date.now()}`

	beforeAll(async () => {
		// Ensure the endpoint is configured
		if (!process.env.PROJECT_PLANNING_ENDPOINT) {
			throw new Error("PROJECT_PLANNING_ENDPOINT environment variable is not set")
		}
		service = new JigJoyProjectPlanningService()

		// Create a project first
		const result = await service.createProject(testOwner)
		testProjectId = result.project.id

		// Create a task so we can record work and leave comments on it
		const task: Task = {
			id: `test-task-${Date.now()}`,
			projectId: testProjectId,
			title: "Test Integration Task",
			description: "Task created for integration testing",
			status: TaskStatus.TODO,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			activities: [],
		}
		
		const createdTask = await service.createTask(task)
		testTaskId = createdTask.id
	}, 50_000)

	it("should record work contribution", async () => {
		const contribution = {
			taskId: testTaskId,
			workerId: testWorkerId,
			message: "Test work contribution",
			type: ContributionType.STARTED_WORK,
		}

		const task = await service.recordWork(contribution)

		expect(task).toBeDefined()
		expect(task.id).toBeDefined()
	}, 5_000)

	it("should leave a comment on a task", async () => {
		const comment = "Test integration comment"

		const task = await service.leaveComment(testTaskId, comment, testAuthorId)

		expect(task).toBeDefined()
		expect(task.id).toBeDefined()
	}, 5_000)
})
