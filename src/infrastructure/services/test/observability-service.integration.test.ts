import { describe, it, expect, beforeAll } from "@rstest/core"
import { JigJoyObservabilityService } from "@infra/services/observability/observability-service"

describe("JigJoyObservabilityService Integration Tests", () => {
	let service: JigJoyObservabilityService
	const taskId = `test-task-${Date.now()}`
	const projectId = `test-project-${Date.now()}`
	const testAccountId = `test-account-${Date.now()}`

	beforeAll(() => {
		service = new JigJoyObservabilityService()
	})

	it("should start and complete a task execution", async () => {
		const taskTitle = "Test Integration Task"
		
		const taskExecution = await service.taskExecutionStarted(
			taskTitle,
			projectId,
			taskId,
			testAccountId
		)

		expect(taskExecution).toBeDefined()
		expect(taskExecution.id).toBeDefined()
		expect(taskExecution.title).toBe(taskTitle)
		expect(taskExecution.projectId).toBe(projectId)
		expect(taskExecution.accountId).toBe(testAccountId)

		await expect(service.taskExecutionSucceeded(taskExecution.id)).resolves.not.toThrow()
	}, 5_000)
})
