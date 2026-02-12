import { describe, it, expect, beforeEach, afterEach } from "@rstest/core"
import { ImplementationPhase } from "@app/workflow/phase/implementation"
import { InMemoryProjectPlanningService } from "@app/test/mocks/in-memory-project-planning-service"
import { InMemoryCodeGeneratorPort } from "@app/test/mocks/in-memory-code-generator"
import { AIDevelopmentWorkflow } from "@app/workflow/ai-development-workflow"
import { FileArtifacts } from "@domain/file-artifacts"
import { ActivityType, Task, TaskStatus } from "@jigjoy-ai/task-contracts"
import { eventBus } from "@app/events/event-bus"
import { ContributionType } from "@app/types/contribution"

describe("ImplementationPhase", () => {
	let implementationPhase: ImplementationPhase
	let projectPlanningService: InMemoryProjectPlanningService
	let codeGenerator: InMemoryCodeGeneratorPort
	let context: AIDevelopmentWorkflow
	let task: Task
	let initialSourceCode: FileArtifacts
	let eventListener: (task: Task) => void
	let updateSourceCodeCalls: FileArtifacts[]
	let updateTaskCalls: Task[]
	let recordWorkCalls: Array<{ taskId: string; workerId: string; message: string; type: ContributionType }>
	let leaveCommentCalls: Array<{ taskId: string; comment: string; authorId: string }>
	let generateCodeCalls: Array<{ task: Task; sourceCode: FileArtifacts }>

	beforeEach(() => {
		projectPlanningService = new InMemoryProjectPlanningService()
		codeGenerator = new InMemoryCodeGeneratorPort()
		implementationPhase = new ImplementationPhase(projectPlanningService, codeGenerator)

		task = {
			id: "task-123",
			projectId: "project-123",
			title: "Create login page",
			description: "Implement login functionality",
			status: TaskStatus.TODO,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			activities: [],
		}

		initialSourceCode = new FileArtifacts()
		initialSourceCode["src/App.tsx"] = "export default function App() {}"

		// Reset tracking arrays
		updateSourceCodeCalls = []
		updateTaskCalls = []
		recordWorkCalls = []
		leaveCommentCalls = []
		generateCodeCalls = []

		// Track recordWork calls
		const originalRecordWork = projectPlanningService.recordWork.bind(projectPlanningService)
		projectPlanningService.recordWork = async (contribution) => {
			recordWorkCalls.push(contribution)
			return originalRecordWork(contribution)
		}

		// Track leaveComment calls
		const originalLeaveComment = projectPlanningService.leaveComment.bind(projectPlanningService)
		projectPlanningService.leaveComment = async (taskId, comment, authorId) => {
			leaveCommentCalls.push({ taskId, comment, authorId })
			return originalLeaveComment(taskId, comment, authorId)
		}

		// Track generateCode calls
		const originalGenerateCode = codeGenerator.generateCode.bind(codeGenerator)
		codeGenerator.generateCode = async (task, currentSourceCode) => {
			generateCodeCalls.push({ task, sourceCode: currentSourceCode })
			return originalGenerateCode(task, currentSourceCode)
		}

		// Create a minimal context mock
		context = {
			getTask: () => task,
			getSourceCode: () => initialSourceCode,
			updateSourceCode: (sourceCode: FileArtifacts) => {
				updateSourceCodeCalls.push(sourceCode)
			},
			updateTask: (updatedTask: Task) => {
				updateTaskCalls.push(updatedTask)
			},
		} as unknown as AIDevelopmentWorkflow

		// Set up event listener to track task update events
		eventListener = (task: Task) => {
			// Track events
		}
		eventBus.on("task:update", eventListener)
	})

	afterEach(() => {
		eventBus.removeAllListeners("task:update")
	})

	it("should generate code and update source code in context", async () => {
		// Arrange
		const generatedCode = new FileArtifacts()
		generatedCode["src/Login.tsx"] = "export default function Login() {}"
		const updatedTask: Task = {
			...task,
			updated: new Date().toISOString(),
		}

		codeGenerator.seed(task.id, {
			comment: "Generated login component",
			sourceCode: generatedCode,
		})
		projectPlanningService.seedRecordWork(task.id, updatedTask)
		projectPlanningService.seedLeaveComment(task.id, "Generated login component", updatedTask)

		// Act
		await implementationPhase.execute(context)

		// Assert
		expect(updateSourceCodeCalls.length).toBe(1)
		expect(updateSourceCodeCalls[0]["src/Login.tsx"]).toBe("export default function Login() {}")
		expect(generateCodeCalls.length).toBe(1)
		expect(generateCodeCalls[0].task.id).toBe(task.id)
		expect(generateCodeCalls[0].sourceCode).toBe(initialSourceCode)
	})

	it("should record work contributions in correct order", async () => {
		// Arrange
		const generatedCode = new FileArtifacts()
		const startedTask: Task = {
			...task,
			activities: [
				{
					type: ActivityType.STARTED_WORK,
					id: "work-123",
					projectId: "project-123",
					taskId: "task-123",
					userId: "user-123",
					occurredAt: new Date().toISOString(),
					metadata: {
						workerId: "React Developer",
						message: "React Developer is generating the code...",
					},
				},
			],
		}
		const finishedTask: Task = {
			...startedTask,
			activities: [
				...startedTask.activities,
				{
					type: ActivityType.FINISHED_WORK,
					id: "work-123",
					projectId: "project-123",
					taskId: "task-123",
					userId: "user-123",
					occurredAt: new Date().toISOString(),
					metadata: {
						workerId: "React Developer",
						message: "React Developer finished with coding",
					},
				},
			],
		}
		const commentedTask: Task = {
			...finishedTask,
			activities: [
				...finishedTask.activities,
				{
					type: ActivityType.COMMENT_LEFT,
					id: "comment-123",
					projectId: "project-123",
					taskId: "task-123",
					userId: "user-123",
					occurredAt: new Date().toISOString(),
					metadata: {
						authorId: "React Developer",
						commentText: "Generated login component",
					},
				},
			],
		}

		codeGenerator.seed(task.id, {
			comment: "Generated login component",
			sourceCode: generatedCode,
		})
		projectPlanningService.seedRecordWork(task.id, startedTask)
		projectPlanningService.seedLeaveComment(task.id, "Generated login component", commentedTask)

		// Act
		await implementationPhase.execute(context)

		// Assert - Verify recordWork was called twice (STARTED_WORK and FINISHED_WORK)
		expect(recordWorkCalls.length).toBe(2)

		// Verify first call is STARTED_WORK
		expect(recordWorkCalls[0].taskId).toBe(task.id)
		expect(recordWorkCalls[0].workerId).toBe("React Developer")
		expect(recordWorkCalls[0].message).toBe("React Developer is generating the code...")
		expect(recordWorkCalls[0].type).toBe(ContributionType.STARTED_WORK)

		// Verify second call is FINISHED_WORK
		expect(recordWorkCalls[1].taskId).toBe(task.id)
		expect(recordWorkCalls[1].workerId).toBe("React Developer")
		expect(recordWorkCalls[1].message).toBe("React Developer finished with coding")
		expect(recordWorkCalls[1].type).toBe(ContributionType.FINISHED_WORK)
	})

	it("should emit task update events in correct order", async () => {
		// Arrange
		const generatedCode = new FileArtifacts()
		const startedTask: Task = { ...task, updated: new Date().toISOString() }
		const finishedTask: Task = { ...startedTask, updated: new Date().toISOString() }
		const commentedTask: Task = { ...finishedTask, updated: new Date().toISOString() }

		const emittedTasks: Task[] = []
		const eventListener = (emittedTask: Task) => {
			emittedTasks.push(emittedTask)
		}
		eventBus.on("task:update", eventListener)

		codeGenerator.seed(task.id, {
			comment: "Generated login component",
			sourceCode: generatedCode,
		})
		projectPlanningService.seedRecordWork(task.id, startedTask)
		projectPlanningService.seedLeaveComment(task.id, "Generated login component", commentedTask)

		// Act
		await implementationPhase.execute(context)

		// Assert - Should emit 3 events: STARTED_WORK, FINISHED_WORK, and COMMENT
		expect(emittedTasks.length).toBe(3)

		// Verify first event is for STARTED_WORK
		expect(emittedTasks[0].id).toBe(startedTask.id)

		// Verify second event is for FINISHED_WORK
		expect(emittedTasks[1].id).toBe(finishedTask.id)

		// Verify third event is for COMMENT
		expect(emittedTasks[2].id).toBe(commentedTask.id)

		eventBus.removeListener("task:update", eventListener)
	})

	it("should leave a comment after code generation", async () => {
		// Arrange
		const generatedCode = new FileArtifacts()
		const comment = "Generated login component"
		const updatedTask: Task = {
			...task,
			updated: new Date().toISOString(),
		}

		codeGenerator.seed(task.id, {
			comment,
			sourceCode: generatedCode,
		})
		projectPlanningService.seedRecordWork(task.id, updatedTask)
		projectPlanningService.seedLeaveComment(task.id, comment, updatedTask)

		// Act
		await implementationPhase.execute(context)

		// Assert
		expect(leaveCommentCalls.length).toBe(1)
		expect(leaveCommentCalls[0].taskId).toBe(task.id)
		expect(leaveCommentCalls[0].comment).toBe(comment)
		expect(leaveCommentCalls[0].authorId).toBe("React Developer")
	})

	it("should update task in context with final task state", async () => {
		// Arrange
		const generatedCode = new FileArtifacts()
		const finalTask: Task = {
			...task,
			updated: new Date().toISOString(),
			activities: [
				{
					type: ActivityType.COMMENT_LEFT,
					id: "comment-123",
					projectId: "project-123",
					taskId: "task-123",
					userId: "user-123",
					occurredAt: new Date().toISOString(),
					metadata: {
						authorId: "React Developer",
						commentText: "Generated login component",
					},
				},
			],
		}

		codeGenerator.seed(task.id, {
			comment: "Generated login component",
			sourceCode: generatedCode,
		})
		projectPlanningService.seedRecordWork(task.id, finalTask)
		projectPlanningService.seedLeaveComment(task.id, "Generated login component", finalTask)

		// Act
		await implementationPhase.execute(context)

		// Assert
		expect(updateTaskCalls.length).toBe(1)
		expect(updateTaskCalls[0].id).toBe(finalTask.id)
	})

	it("should handle errors during code generation", async () => {
		// Arrange
		const error = new Error("Code generation failed")
		const originalGenerateCode = codeGenerator.generateCode.bind(codeGenerator)
		codeGenerator.generateCode = async () => {
			throw error
		}

		// Act & Assert
		await expect(implementationPhase.execute(context)).rejects.toThrow("Code generation failed")
		expect(updateSourceCodeCalls.length).toBe(0)
		expect(updateTaskCalls.length).toBe(0)

		// Restore original method
		codeGenerator.generateCode = originalGenerateCode
	})
})
