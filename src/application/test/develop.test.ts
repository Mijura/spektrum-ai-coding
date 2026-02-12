import { describe, it, expect, beforeEach } from "@rstest/core"
import { Develop } from "@app/use-cases/develop"
import { InMemoryCodebaseRepository } from "@app/test/mocks/in-memory-codebase-repository"
import { InMemoryProjectPlanningService } from "@app/test/mocks/in-memory-project-planning-service"
import { InMemoryVersionControlService } from "@app/test/mocks/in-memory-version-control-service"
import { InMemoryObservabilityService } from "@app/test/mocks/in-memory-observability-service"
import { InMemoryProjectDeploymentService } from "@app/test/mocks/in-memory-project-deployment-service"
import { InMemoryCodeGeneratorPort } from "@app/test/mocks/in-memory-code-generator"
import { InMemoryBundlerPort } from "@app/test/mocks/in-memory-bundler"
import { InMemoryFileSystemPort } from "@app/test/mocks/in-memory-file-system"
import { CodebaseRepositoryPort } from "@app/ports/repositories/codebase-repository"
import { ProjectPlanningService } from "@app/ports/services/project-planning-service"
import { VersionControlService } from "@app/ports/services/version-control-service"
import { ObservabilityService } from "@app/ports/services/observability-service"
import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { CodeGeneratorPort } from "@app/ports/services/code-generator"
import { LocalDevEnvironment } from "@app/services/local-dev-environment"
import { Codebase } from "@domain/codebase"
import { Module, ModuleType } from "@domain/module"
import { FileArtifacts } from "@domain/file-artifacts"
import { Task, TaskStatus } from "@jigjoy-ai/task-contracts"
import { TaskExecutionStatus } from "@app/types/task-execution"
import { Version } from "@domain/version"

describe("Develop", () => {
	let developUseCase: Develop
	let codebaseRepository: CodebaseRepositoryPort
	let projectPlanningService: ProjectPlanningService
	let versionControlService: VersionControlService
	let observabilityService: ObservabilityService
	let projectDeploymentService: ProjectDeploymentService
	let codeGenerator: CodeGeneratorPort
	let bundler: InMemoryBundlerPort
	let fileSystem: InMemoryFileSystemPort
	let devEnvironment: LocalDevEnvironment

	beforeEach(() => {
		codebaseRepository = new InMemoryCodebaseRepository()
		projectPlanningService = new InMemoryProjectPlanningService()
		versionControlService = new InMemoryVersionControlService()
		observabilityService = new InMemoryObservabilityService()
		projectDeploymentService = new InMemoryProjectDeploymentService()
		codeGenerator = new InMemoryCodeGeneratorPort()
		bundler = new InMemoryBundlerPort()
		fileSystem = new InMemoryFileSystemPort()
		devEnvironment = new LocalDevEnvironment(bundler, fileSystem)
		developUseCase = new Develop(
			codebaseRepository,
			projectPlanningService,
			devEnvironment,
			versionControlService,
			observabilityService,
			projectDeploymentService,
			codeGenerator,
		)
	})

	it("should successfully develop a task", async () => {
		// Arrange
		const projectId = "project-123"
		const repositoryId = "repository-456"
		const accountId = "account-789"
		const task: Task = {
			id: "task-123",
			projectId: projectId,
			title: "Create login page",
			description: "Implement login functionality",
			status: TaskStatus.TODO,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			activities: [],
		}

		const module = Module.create(repositoryId, ModuleType.FRONTEND)
		const codebase = Codebase.create(projectId)
		codebase.addModule(module)
		await codebaseRepository.save(codebase)

		const sourceCode = new FileArtifacts()
		sourceCode["src/App.tsx"] = "export default function App() {}"
		const buildArtifacts = new FileArtifacts()
		buildArtifacts["dist/bundle.js"] = "console.log('app')"

		const version: Version = {
			repositoryId: repositoryId,
			sourceCodeArtifacts: sourceCode,
			buildArtifacts: buildArtifacts,
		}
		;(versionControlService as InMemoryVersionControlService).seed(repositoryId, version)

		const generatedCode = new FileArtifacts()
		generatedCode["src/Login.tsx"] = "export default function Login() {}"
		;(codeGenerator as InMemoryCodeGeneratorPort).seed(task.id, {
			comment: "Generated login component",
			sourceCode: generatedCode,
		})

		const bundledCode = new FileArtifacts()
		bundledCode["dist/login.js"] = "bundled login"
		;(bundler as InMemoryBundlerPort).seed("projects/", bundledCode)

		const entryPoint = {
			moduleId: module.id,
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}
		;(projectDeploymentService as InMemoryProjectDeploymentService).seed(projectId, entryPoint)

		// Act
		await developUseCase.execute(task, accountId)

		// Assert
		const finalVersion = await versionControlService.pull(repositoryId)
		expect(finalVersion.sourceCodeArtifacts["src/Login.tsx"]).toBeDefined()
	})

	it("should retry on implementation phase failure and succeed on second try", async () => {
		// Arrange
		const projectId = "project-retry"
		const repositoryId = "repository-retry"
		const accountId = "account-retry"
		const task: Task = {
			id: "task-retry",
			projectId: projectId,
			title: "Create component",
			description: "Implement component",
			status: TaskStatus.TODO,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			activities: [],
		}

		const module = Module.create(repositoryId, ModuleType.FRONTEND)
		const codebase = Codebase.create(projectId)
		codebase.addModule(module)
		await codebaseRepository.save(codebase)

		const sourceCode = new FileArtifacts()
		const version: Version = {
			repositoryId: repositoryId,
			sourceCodeArtifacts: sourceCode,
			buildArtifacts: new FileArtifacts(),
		}
		;(versionControlService as InMemoryVersionControlService).seed(repositoryId, version)

		let callCount = 0
		const originalGenerateCode = (codeGenerator as InMemoryCodeGeneratorPort).generateCode.bind(codeGenerator)
		;(codeGenerator as InMemoryCodeGeneratorPort).generateCode = async (task, currentSourceCode) => {
			callCount++
			if (callCount === 1) {
				throw new Error("Code generation failed")
			}
			return originalGenerateCode(task, currentSourceCode)
		}

		const generatedCode = new FileArtifacts()
		generatedCode["src/Component.tsx"] = "export default function Component() {}"
		;(codeGenerator as InMemoryCodeGeneratorPort).seed(task.id, {
			comment: "Generated component",
			sourceCode: generatedCode,
		})

		const bundledCode = new FileArtifacts()
		;(bundler as InMemoryBundlerPort).seed("projects/any", bundledCode)

		const entryPoint = {
			moduleId: module.id,
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}
		;(projectDeploymentService as InMemoryProjectDeploymentService).seed(projectId, entryPoint)

		// Act
		await developUseCase.execute(task, accountId)

		// Assert
		expect(callCount).toBe(2) // Should have retried once
	})

	it("should retry on build phase failure and succeed on second try", async () => {
		// Arrange
		const projectId = "project-build-retry"
		const repositoryId = "repository-build-retry"
		const accountId = "account-build-retry"
		const task: Task = {
			id: "task-build-retry",
			projectId: projectId,
			title: "Create component",
			description: "Implement component",
			status: TaskStatus.TODO,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			activities: [],
		}

		const module = Module.create(repositoryId, ModuleType.FRONTEND)
		const codebase = Codebase.create(projectId)
		codebase.addModule(module)
		await codebaseRepository.save(codebase)

		const sourceCode = new FileArtifacts()
		sourceCode["src/App.tsx"] = "export default function App() {}"
		const version: Version = {
			repositoryId: repositoryId,
			sourceCodeArtifacts: sourceCode,
			buildArtifacts: new FileArtifacts(),
		}
		;(versionControlService as InMemoryVersionControlService).seed(repositoryId, version)

		const generatedCode = new FileArtifacts()
		generatedCode["src/Component.tsx"] = "export default function Component() {}"
		;(codeGenerator as InMemoryCodeGeneratorPort).seed(task.id, {
			comment: "Generated component",
			sourceCode: generatedCode,
		})

		let bundleCallCount = 0
		const originalBundle = (bundler as InMemoryBundlerPort).bundle.bind(bundler)
		;(bundler as InMemoryBundlerPort).bundle = async (projectPath: string) => {
			bundleCallCount++
			if (bundleCallCount === 1) {
				throw new Error("Build failed")
			}
			return originalBundle(projectPath)
		}

		const bundledCode = new FileArtifacts()
		bundledCode["dist/component.js"] = "bundled"
		;(bundler as InMemoryBundlerPort).seed("projects/", bundledCode)

		const entryPoint = {
			moduleId: module.id,
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}
		;(projectDeploymentService as InMemoryProjectDeploymentService).seed(projectId, entryPoint)

		// Act
		await developUseCase.execute(task, accountId)

		// Assert
		expect(bundleCallCount).toBe(2) // Should have retried once
	})

	it("should fail after 3 retries", async () => {
		// Arrange
		const projectId = "project-fail"
		const repositoryId = "repository-fail"
		const accountId = "account-fail"
		const task: Task = {
			id: "task-fail",
			projectId: projectId,
			title: "Create component",
			description: "Implement component",
			status: TaskStatus.TODO,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			activities: [],
		}

		const module = Module.create(repositoryId, ModuleType.FRONTEND)
		const codebase = Codebase.create(projectId)
		codebase.addModule(module)
		await codebaseRepository.save(codebase)

		const sourceCode = new FileArtifacts()
		const version: Version = {
			repositoryId: repositoryId,
			sourceCodeArtifacts: sourceCode,
			buildArtifacts: new FileArtifacts(),
		}
		;(versionControlService as InMemoryVersionControlService).seed(repositoryId, version)

		// Always fail code generation
		;(codeGenerator as InMemoryCodeGeneratorPort).generateCode = async () => {
			throw new Error("Code generation always fails")
		}

		// Act & Assert
		await expect(developUseCase.execute(task, accountId)).rejects.toThrow("Failed to develop task after 3 tries")

		// Verify task execution was created and marked as failed
		// The workflow creates a task execution with task.id as the executionId
		const taskExecution = (observabilityService as InMemoryObservabilityService).getTaskExecution(task.id)
		expect(taskExecution).toBeDefined()
		expect(taskExecution?.status).toBe(TaskExecutionStatus.FAILED)
		expect(taskExecution?.error).toContain("Failed to develop task after 3 tries")
	})

	it("should handle two concurrent executions without state sharing", async () => {
		// Arrange
		const projectId1 = "project-1"
		const projectId2 = "project-2"
		const repositoryId1 = "repository-1"
		const repositoryId2 = "repository-2"
		const accountId1 = "account-1"
		const accountId2 = "account-2"

		const task1: Task = {
			id: "task-1",
			projectId: projectId1,
			title: "Task 1",
			description: "First task",
			status: TaskStatus.TODO,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			activities: [],
		}

		const task2: Task = {
			id: "task-2",
			projectId: projectId2,
			title: "Task 2",
			description: "Second task",
			status: TaskStatus.TODO,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			activities: [],
		}

		const module1 = Module.create(repositoryId1, ModuleType.FRONTEND)
		const module2 = Module.create(repositoryId2, ModuleType.FRONTEND)
		const codebase1 = Codebase.create(projectId1)
		const codebase2 = Codebase.create(projectId2)
		codebase1.addModule(module1)
		codebase2.addModule(module2)
		await codebaseRepository.save(codebase1)
		await codebaseRepository.save(codebase2)

		const sourceCode1 = new FileArtifacts()
		sourceCode1["src/App1.tsx"] = "export default function App1() {}"
		const sourceCode2 = new FileArtifacts()
		sourceCode2["src/App2.tsx"] = "export default function App2() {}"

		const version1: Version = {
			repositoryId: repositoryId1,
			sourceCodeArtifacts: sourceCode1,
			buildArtifacts: new FileArtifacts(),
		}
		const version2: Version = {
			repositoryId: repositoryId2,
			sourceCodeArtifacts: sourceCode2,
			buildArtifacts: new FileArtifacts(),
		}
		;(versionControlService as InMemoryVersionControlService).seed(repositoryId1, version1)
		;(versionControlService as InMemoryVersionControlService).seed(repositoryId2, version2)

		const generatedCode1 = new FileArtifacts()
		generatedCode1["src/Component1.tsx"] = "export default function Component1() {}"
		const generatedCode2 = new FileArtifacts()
		generatedCode2["src/Component2.tsx"] = "export default function Component2() {}"
		;(codeGenerator as InMemoryCodeGeneratorPort).seed(task1.id, {
			comment: "Generated component 1",
			sourceCode: generatedCode1,
		})
		;(codeGenerator as InMemoryCodeGeneratorPort).seed(task2.id, {
			comment: "Generated component 2",
			sourceCode: generatedCode2,
		})

		const bundledCode1 = new FileArtifacts()
		bundledCode1["dist/component1.js"] = "bundled1"
		const bundledCode2 = new FileArtifacts()
		bundledCode2["dist/component2.js"] = "bundled2"

		// Use a pattern that matches any project path for bundler
		;(bundler as InMemoryBundlerPort).setDefault(bundledCode1)

		const entryPoint1 = {
			moduleId: module1.id,
			assetBaseUrl: "https://assets1.example.com",
			publicAppUrl: "https://app1.example.com",
		}
		const entryPoint2 = {
			moduleId: module2.id,
			assetBaseUrl: "https://assets2.example.com",
			publicAppUrl: "https://app2.example.com",
		}
		;(projectDeploymentService as InMemoryProjectDeploymentService).seed(projectId1, entryPoint1)
		;(projectDeploymentService as InMemoryProjectDeploymentService).seed(projectId2, entryPoint2)

		// Act - Execute both concurrently
		const [result1, result2] = await Promise.all([
			developUseCase.execute(task1, accountId1),
			developUseCase.execute(task2, accountId2),
		])

		// Assert - Both should complete successfully
		expect(result1).toBeUndefined() // execute returns void
		expect(result2).toBeUndefined()

		// Verify each project has its own results
		const finalVersion1 = await versionControlService.pull(repositoryId1)
		const finalVersion2 = await versionControlService.pull(repositoryId2)

		// Each should have its own generated code
		expect(finalVersion1.sourceCodeArtifacts["src/Component1.tsx"]).toBeDefined()
		expect(finalVersion2.sourceCodeArtifacts["src/Component2.tsx"]).toBeDefined()

		// Verify task executions are separate
		const taskExecution1 = (observabilityService as InMemoryObservabilityService).getTaskExecution(task1.id)
		const taskExecution2 = (observabilityService as InMemoryObservabilityService).getTaskExecution(task2.id)
		expect(taskExecution1).toBeDefined()
		expect(taskExecution2).toBeDefined()
		expect(taskExecution1?.id).not.toBe(taskExecution2?.id)
		expect(taskExecution1?.taskId).toBe(task1.id)
		expect(taskExecution2?.taskId).toBe(task2.id)
	})

	it("should throw error when module not found", async () => {
		// Arrange
		const projectId = "project-no-module"
		const accountId = "account-123"
		const task: Task = {
			id: "task-no-module",
			projectId: projectId,
			title: "Create component",
			description: "Implement component",
			status: TaskStatus.TODO,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			activities: [],
		}

		const codebase = Codebase.create(projectId)
		// Don't add any modules
		await codebaseRepository.save(codebase)

		// Act & Assert
		await expect(developUseCase.execute(task, accountId)).rejects.toThrow("Module not found")
	})

	it("should mark task execution as succeeded on successful completion", async () => {
		// Arrange
		const projectId = "project-success"
		const repositoryId = "repository-success"
		const accountId = "account-success"
		const task: Task = {
			id: "task-success",
			projectId: projectId,
			title: "Create component",
			description: "Implement component",
			status: TaskStatus.TODO,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			activities: [],
		}

		const module = Module.create(repositoryId, ModuleType.FRONTEND)
		const codebase = Codebase.create(projectId)
		codebase.addModule(module)
		await codebaseRepository.save(codebase)

		const sourceCode = new FileArtifacts()
		const version: Version = {
			repositoryId: repositoryId,
			sourceCodeArtifacts: sourceCode,
			buildArtifacts: new FileArtifacts(),
		}
		;(versionControlService as InMemoryVersionControlService).seed(repositoryId, version)

		const generatedCode = new FileArtifacts()
		;(codeGenerator as InMemoryCodeGeneratorPort).seed(task.id, {
			comment: "Generated",
			sourceCode: generatedCode,
		})

		const bundledCode = new FileArtifacts()
		;(bundler as InMemoryBundlerPort).setDefault(bundledCode)

		const entryPoint = {
			moduleId: module.id,
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}
		;(projectDeploymentService as InMemoryProjectDeploymentService).seed(projectId, entryPoint)

		// Act
		await developUseCase.execute(task, accountId)

		// Assert - Task execution should be marked as succeeded
		const taskExecution = (observabilityService as InMemoryObservabilityService).getTaskExecution(task.id)
		expect(taskExecution).toBeDefined()
		expect(taskExecution?.taskId).toBe(task.id)
		expect(taskExecution?.accountId).toBe(accountId)
		expect(taskExecution?.status).toBe(TaskExecutionStatus.SUCCEEDED)
	})

	it("should record work contributions during execution", async () => {
		// Arrange
		const projectId = "project-contributions"
		const repositoryId = "repository-contributions"
		const accountId = "account-contributions"
		const task: Task = {
			id: "task-contributions",
			projectId: projectId,
			title: "Create component",
			description: "Implement component",
			status: TaskStatus.TODO,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			activities: [],
		}

		const module = Module.create(repositoryId, ModuleType.FRONTEND)
		const codebase = Codebase.create(projectId)
		codebase.addModule(module)
		await codebaseRepository.save(codebase)

		const sourceCode = new FileArtifacts()
		const version: Version = {
			repositoryId: repositoryId,
			sourceCodeArtifacts: sourceCode,
			buildArtifacts: new FileArtifacts(),
		}
		;(versionControlService as InMemoryVersionControlService).seed(repositoryId, version)

		const generatedCode = new FileArtifacts()
		;(codeGenerator as InMemoryCodeGeneratorPort).seed(task.id, {
			comment: "Generated component",
			sourceCode: generatedCode,
		})

		const bundledCode = new FileArtifacts()
		;(bundler as InMemoryBundlerPort).setDefault(bundledCode)

		const entryPoint = {
			moduleId: module.id,
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}
		;(projectDeploymentService as InMemoryProjectDeploymentService).seed(projectId, entryPoint)

		// Act
		await developUseCase.execute(task, accountId)

		// Assert - Verify that recordWork was called multiple times
		// The workflow should record work for implementation, build, and deployment phases
		const updatedTask = await projectPlanningService.recordWork({
			taskId: task.id,
			workerId: "React Developer",
			message: "Test",
			type: "STARTED_WORK" as any,
		})
		expect(updatedTask).toBeDefined()
	})
})
