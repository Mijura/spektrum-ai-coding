import { describe, it, expect, beforeEach, afterEach } from "@rstest/core"
import { DeploymentPhase } from "@app/workflow/phase/deployment"
import { InMemoryProjectPlanningService } from "@app/test/mocks/in-memory-project-planning-service"
import { InMemoryProjectDeploymentService } from "@app/test/mocks/in-memory-project-deployment-service"
import { AIDevelopmentWorkflow } from "@app/workflow/ai-development-workflow"
import { ActivityType, Task, TaskStatus } from "@jigjoy-ai/task-contracts"
import { Module, ModuleType } from "@domain/module"
import { eventBus } from "@app/events/event-bus"
import { ContributionType } from "@app/types/contribution"
import { EnvironmentType, DeploymentRequest } from "@app/types/deployment-request"

describe("DeploymentPhase", () => {
	let deploymentPhase: DeploymentPhase
	let projectPlanningService: InMemoryProjectPlanningService
	let projectDeploymentService: InMemoryProjectDeploymentService
	let context: AIDevelopmentWorkflow
	let task: Task
	let module: Module
	let updateTaskCalls: Task[]
	let recordWorkCalls: Array<{ taskId: string; workerId: string; message: string; type: ContributionType }>
	let deployModuleCalls: Array<{ projectId: string; deploymentRequest: DeploymentRequest }>

	beforeEach(() => {
		projectPlanningService = new InMemoryProjectPlanningService()
		projectDeploymentService = new InMemoryProjectDeploymentService()
		deploymentPhase = new DeploymentPhase(projectDeploymentService, projectPlanningService)

		task = {
			id: "task-123",
			projectId: "project-123",
			title: "Deploy application",
			description: "Deploy the application",
			status: TaskStatus.TODO,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			activities: [],
		}

		module = Module.create("repository-456", ModuleType.FRONTEND)

		// Reset tracking arrays
		updateTaskCalls = []
		recordWorkCalls = []
		deployModuleCalls = []

		// Track recordWork calls
		const originalRecordWork = projectPlanningService.recordWork.bind(projectPlanningService)
		projectPlanningService.recordWork = async (contribution) => {
			recordWorkCalls.push(contribution)
			return originalRecordWork(contribution)
		}

		// Track deployModule calls
		const originalDeployModule = projectDeploymentService.deployModule.bind(projectDeploymentService)
		projectDeploymentService.deployModule = async (projectId, deploymentRequest) => {
			deployModuleCalls.push({ projectId, deploymentRequest })
			return originalDeployModule(projectId, deploymentRequest)
		}

		// Create a minimal context mock
		context = {
			getTask: () => task,
			getModule: () => module,
			updateTask: (updatedTask: Task) => {
				updateTaskCalls.push(updatedTask)
			},
		} as unknown as AIDevelopmentWorkflow
	})

	afterEach(() => {
		eventBus.removeAllListeners("task:update")
	})

	it("should deploy module with correct deployment request", async () => {
		// Arrange
		const entryPoint = {
			moduleId: module.id,
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}
		projectDeploymentService.seed(task.projectId, entryPoint)

		const updatedTask: Task = {
			...task,
			updated: new Date().toISOString(),
		}
		projectPlanningService.seedRecordWork(task.id, updatedTask)

		// Act
		await deploymentPhase.execute(context)

		// Assert
		expect(deployModuleCalls.length).toBe(1)
		expect(deployModuleCalls[0].projectId).toBe(task.projectId)
		expect(deployModuleCalls[0].deploymentRequest.moduleId).toBe(module.id)
		expect(deployModuleCalls[0].deploymentRequest.moduleType).toBe(module.type)
		expect(deployModuleCalls[0].deploymentRequest.repositoryId).toBe(module.repositoryId)
		expect(deployModuleCalls[0].deploymentRequest.environmentType).toBe(EnvironmentType.DEV)
		expect(deployModuleCalls[0].deploymentRequest.setAsEntryPoint).toBe(true)
	})

	it("should record work contributions in correct order", async () => {
		// Arrange
		const entryPoint = {
			moduleId: module.id,
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}
		projectDeploymentService.seed(task.projectId, entryPoint)

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
						message: "Deploying the application...",
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
					id: "work-124",
					projectId: "project-123",
					taskId: "task-123",
					userId: "user-123",
					occurredAt: new Date().toISOString(),
					metadata: {
						workerId: "React Developer",
						message: "App deployed — check Output tab to test.",
					},
				},
			],
		}

		projectPlanningService.seedRecordWork(task.id, startedTask)
		projectPlanningService.setDefault(finishedTask)

		// Act
		await deploymentPhase.execute(context)

		// Assert - Verify recordWork was called twice (STARTED_WORK and FINISHED_WORK)
		expect(recordWorkCalls.length).toBe(2)

		// Verify first call is STARTED_WORK
		expect(recordWorkCalls[0].taskId).toBe(task.id)
		expect(recordWorkCalls[0].workerId).toBe("React Developer")
		expect(recordWorkCalls[0].message).toBe("Deploying the application...")
		expect(recordWorkCalls[0].type).toBe(ContributionType.STARTED_WORK)

		// Verify second call is FINISHED_WORK
		expect(recordWorkCalls[1].taskId).toBe(task.id)
		expect(recordWorkCalls[1].workerId).toBe("React Developer")
		expect(recordWorkCalls[1].message).toBe("App deployed — check Output tab to test.")
		expect(recordWorkCalls[1].type).toBe(ContributionType.FINISHED_WORK)
	})

	it("should emit task update events in correct order", async () => {
		// Arrange
		const entryPoint = {
			moduleId: module.id,
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}
		projectDeploymentService.seed(task.projectId, entryPoint)

		const startedTask: Task = {
			...task,
			updated: new Date().toISOString(),
		}
		const finishedTask: Task = {
			...startedTask,
			updated: new Date().toISOString(),
		}

		const emittedTasks: Task[] = []
		const eventListener = (emittedTask: Task) => {
			emittedTasks.push(emittedTask)
		}
		eventBus.on("task:update", eventListener)

		projectPlanningService.seedRecordWork(task.id, startedTask)
		projectPlanningService.setDefault(finishedTask)

		// Act
		await deploymentPhase.execute(context)

		// Assert - Should emit 2 events: STARTED_WORK and FINISHED_WORK
		expect(emittedTasks.length).toBe(2)

		// Verify first event is for STARTED_WORK
		expect(emittedTasks[0].id).toBe(startedTask.id)

		// Verify second event is for FINISHED_WORK
		expect(emittedTasks[1].id).toBe(finishedTask.id)

		eventBus.removeListener("task:update", eventListener)
	})

	it("should update task in context with final task state", async () => {
		// Arrange
		const entryPoint = {
			moduleId: module.id,
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}
		projectDeploymentService.seed(task.projectId, entryPoint)

		const finalTask: Task = {
			...task,
			updated: new Date().toISOString(),
			activities: [
				{
					type: ActivityType.FINISHED_WORK,
					id: "work-124",
					projectId: "project-123",
					taskId: "task-123",
					userId: "user-123",
					occurredAt: new Date().toISOString(),
					metadata: {
						workerId: "React Developer",
						message: "App deployed — check Output tab to test.",
					},
				},
			],
		}

		projectPlanningService.seedRecordWork(task.id, finalTask)
		projectPlanningService.setDefault(finalTask)

		// Act
		await deploymentPhase.execute(context)

		// Assert
		expect(updateTaskCalls.length).toBe(1)
		expect(updateTaskCalls[0].id).toBe(finalTask.id)
	})

	it("should handle errors during deployment", async () => {
		// Arrange
		const error = new Error("Deployment failed")
		const originalDeployModule = projectDeploymentService.deployModule.bind(projectDeploymentService)
		projectDeploymentService.deployModule = async () => {
			throw error
		}

		// Act & Assert
		await expect(deploymentPhase.execute(context)).rejects.toThrow("Deployment failed")
		expect(updateTaskCalls.length).toBe(0)

		// Restore original method
		projectDeploymentService.deployModule = originalDeployModule
	})

	it("should use correct deployment request parameters", async () => {
		// Arrange
		const entryPoint = {
			moduleId: module.id,
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}
		projectDeploymentService.seed(task.projectId, entryPoint)

		const updatedTask: Task = {
			...task,
			updated: new Date().toISOString(),
		}
		projectPlanningService.seedRecordWork(task.id, updatedTask)

		// Act
		await deploymentPhase.execute(context)

		// Assert - Verify deployment request has all correct fields
		expect(deployModuleCalls.length).toBe(1)
		expect(deployModuleCalls[0].projectId).toBe(task.projectId)
		expect(deployModuleCalls[0].deploymentRequest).toEqual({
			moduleId: module.id,
			moduleType: module.type,
			repositoryId: module.repositoryId,
			environmentType: EnvironmentType.DEV,
			setAsEntryPoint: true,
		})
	})
})
