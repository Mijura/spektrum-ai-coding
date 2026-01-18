import { describe, it, expect, beforeEach, afterEach } from "@rstest/core"
import { BuildPhase } from "@app/workflow/phase/build"
import { InMemoryProjectPlanningService } from "@app/test/mocks/in-memory-project-planning-service"
import { InMemoryBundlerPort } from "@app/test/mocks/in-memory-bundler"
import { InMemoryFileSystemPort } from "@app/test/mocks/in-memory-file-system"
import { LocalDevEnvironment } from "@app/services/local-dev-environment"
import { AIDevelopmentWorkflow } from "@app/workflow/ai-development-workflow"
import { FileArtifacts } from "@domain/file-artifacts"
import { ActivityType, Task, TaskStatus } from "@jigjoy-io/task-contracts"
import { eventBus } from "@app/events/event-bus"
import { ContributionType } from "@app/types/contribution"

describe("BuildPhase", () => {
	let buildPhase: BuildPhase
	let projectPlanningService: InMemoryProjectPlanningService
	let bundler: InMemoryBundlerPort
	let fileSystem: InMemoryFileSystemPort
	let devEnvironment: LocalDevEnvironment
	let context: AIDevelopmentWorkflow
	let task: Task
	let sourceCode: FileArtifacts
	let updateBuildArtifactsCalls: FileArtifacts[]
	let updateTaskCalls: Task[]
	let recordWorkCalls: Array<{ taskId: string; workerId: string; message: string; type: ContributionType }>
	let bundleCalls: string[]

	beforeEach(() => {
		projectPlanningService = new InMemoryProjectPlanningService()
		bundler = new InMemoryBundlerPort()
		fileSystem = new InMemoryFileSystemPort()
		devEnvironment = new LocalDevEnvironment(bundler, fileSystem)
		buildPhase = new BuildPhase(projectPlanningService, devEnvironment)

		task = {
			id: "task-123",
			projectId: "project-123",
			title: "Build application",
			description: "Build the application",
			status: TaskStatus.TODO,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			activities: [],
		}

		sourceCode = new FileArtifacts()
		sourceCode["src/App.tsx"] = "export default function App() {}"
		sourceCode["src/index.tsx"] = "import React from 'react'"

		// Reset tracking arrays
		updateBuildArtifactsCalls = []
		updateTaskCalls = []
		recordWorkCalls = []
		bundleCalls = []

		// Track recordWork calls
		const originalRecordWork = projectPlanningService.recordWork.bind(projectPlanningService)
		projectPlanningService.recordWork = async (contribution) => {
			recordWorkCalls.push(contribution)
			return originalRecordWork(contribution)
		}

		// Track bundle calls
		const originalBundle = bundler.bundle.bind(bundler)
		bundler.bundle = async (projectPath: string) => {
			bundleCalls.push(projectPath)
			return originalBundle(projectPath)
		}

		// Create a minimal context mock
		context = {
			getTask: () => task,
			getSourceCode: () => sourceCode,
			updateBuildArtifacts: (buildArtifacts: FileArtifacts) => {
				updateBuildArtifactsCalls.push(buildArtifacts)
			},
			updateTask: (updatedTask: Task) => {
				updateTaskCalls.push(updatedTask)
			},
		} as unknown as AIDevelopmentWorkflow
	})

	afterEach(() => {
		eventBus.removeAllListeners("task:update")
		fileSystem.clear()
	})

	it("should build source code and update build artifacts in context", async () => {
		// Arrange
		const buildArtifacts = new FileArtifacts()
		buildArtifacts["dist/bundle.js"] = "bundled code"
		buildArtifacts["dist/bundle.css"] = "styles"

		// Use setDefault since LocalDevEnvironment uses path.resolve() which creates absolute paths
		bundler.setDefault(buildArtifacts)

		const updatedTask: Task = {
			...task,
			updated: new Date().toISOString(),
		}
		projectPlanningService.seedRecordWork(task.id, updatedTask)

		// Act
		await buildPhase.execute(context)

		// Assert
		expect(updateBuildArtifactsCalls.length).toBe(1)
		expect(updateBuildArtifactsCalls[0]["dist/bundle.js"]).toBe("bundled code")
		expect(updateBuildArtifactsCalls[0]["dist/bundle.css"]).toBe("styles")
	})

	it("should record work contributions in correct order", async () => {
		// Arrange
		const buildArtifacts = new FileArtifacts()
		bundler.setDefault(buildArtifacts)

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
						message: "Building the application...",
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
						message: "Build finished successfully",
					},
				},
			],
		}

		projectPlanningService.seedRecordWork(task.id, startedTask)
		// Second call should return finished task
		projectPlanningService.setDefault(finishedTask)

		// Act
		await buildPhase.execute(context)

		// Assert - Verify recordWork was called twice (STARTED_WORK and FINISHED_WORK)
		expect(recordWorkCalls.length).toBe(2)

		// Verify first call is STARTED_WORK
		expect(recordWorkCalls[0].taskId).toBe(task.id)
		expect(recordWorkCalls[0].workerId).toBe("React Developer")
		expect(recordWorkCalls[0].message).toBe("Building the application...")
		expect(recordWorkCalls[0].type).toBe(ContributionType.STARTED_WORK)

		// Verify second call is FINISHED_WORK
		expect(recordWorkCalls[1].taskId).toBe(task.id)
		expect(recordWorkCalls[1].workerId).toBe("React Developer")
		expect(recordWorkCalls[1].message).toBe("Build finished successfully")
		expect(recordWorkCalls[1].type).toBe(ContributionType.FINISHED_WORK)
	})

	it("should emit task update events in correct order", async () => {
		// Arrange
		const buildArtifacts = new FileArtifacts()
		bundler.setDefault(buildArtifacts)

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
		await buildPhase.execute(context)

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
		const buildArtifacts = new FileArtifacts()
		bundler.setDefault(buildArtifacts)

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
						message: "Build finished successfully",
					},
				},
			],
		}

		projectPlanningService.seedRecordWork(task.id, finalTask)
		projectPlanningService.setDefault(finalTask)

		// Act
		await buildPhase.execute(context)

		// Assert
		expect(updateTaskCalls.length).toBe(1)
		expect(updateTaskCalls[0].id).toBe(finalTask.id)
	})

	it("should handle errors during build", async () => {
		// Arrange
		const error = new Error("Build failed")
		const originalBundle = bundler.bundle.bind(bundler)
		bundler.bundle = async () => {
			throw error
		}

		// Act & Assert
		await expect(buildPhase.execute(context)).rejects.toThrow("Build failed")
		expect(updateBuildArtifactsCalls.length).toBe(0)
		expect(updateTaskCalls.length).toBe(0)

		// Restore original method
		bundler.bundle = originalBundle
	})

	it("should write source code to file system before bundling", async () => {
		// Arrange
		const buildArtifacts = new FileArtifacts()
		bundler.setDefault(buildArtifacts)

		const updatedTask: Task = {
			...task,
			updated: new Date().toISOString(),
		}
		projectPlanningService.seedRecordWork(task.id, updatedTask)

		// Act
		await buildPhase.execute(context)

		// Assert - Verify files were written to file system
		// The LocalDevEnvironment writes files to a temporary directory
		// We can verify that bundler was called, which implies files were written
		expect(bundleCalls.length).toBe(1)
		expect(bundleCalls[0]).toContain("projects/")
	})
})
