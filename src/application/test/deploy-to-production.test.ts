import { describe, it, expect, beforeEach } from "@rstest/core"
import { DeployToProduction } from "@app/use-cases/deploy-to-production"
import { InMemoryProjectDeploymentService } from "@app/test/mocks/in-memory-project-deployment-service"
import { InMemoryCodebaseRepository } from "@app/test/mocks/in-memory-codebase-repository"
import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { CodebaseRepositoryPort } from "@app/ports/repositories/codebase-repository"
import { EntryPoint } from "@app/types/entry-point"
import { Codebase } from "@domain/codebase"
import { Module, ModuleType } from "@domain/module"

describe("DeployToProduction", () => {
	let deployToProductionUseCase: DeployToProduction
	let projectDeploymentService: ProjectDeploymentService
	let codebaseRepository: CodebaseRepositoryPort

	beforeEach(() => {
		projectDeploymentService = new InMemoryProjectDeploymentService()
		codebaseRepository = new InMemoryCodebaseRepository()
		deployToProductionUseCase = new DeployToProduction(projectDeploymentService, codebaseRepository)
	})

	it("should successfully deploy module to production", async () => {
		// Arrange
		const projectId = "project-123"
		const module = Module.create("repository-456", ModuleType.FRONTEND)
		const codebase = Codebase.create(projectId)
		codebase.addModule(module)

		const entryPoint: EntryPoint = {
			moduleId: module.id,
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}

		await codebaseRepository.save(codebase)
		;(projectDeploymentService as InMemoryProjectDeploymentService).seed(projectId, entryPoint)

		// Act
		const result = await deployToProductionUseCase.execute(projectId)

		// Assert
		expect(result).toBeDefined()
		expect(result.moduleId).toBe(module.id)
		expect(result.assetBaseUrl).toBe(entryPoint.assetBaseUrl)
		expect(result.publicAppUrl).toBe(entryPoint.publicAppUrl)
	})

	it("should throw error when module not found", async () => {
		// Arrange
		const projectId = "project-no-modules"
		const codebase = Codebase.create(projectId)
		// Don't add any modules

		await codebaseRepository.save(codebase)

		// Act & Assert
		await expect(deployToProductionUseCase.execute(projectId)).rejects.toThrow("Module not found")
	})

	it("should deploy with correct deployment request", async () => {
		// Arrange
		const projectId = "project-456"
		const repositoryId = "repository-789"
		const module = Module.create(repositoryId, ModuleType.FRONTEND)
		const codebase = Codebase.create(projectId)
		codebase.addModule(module)

		const entryPoint: EntryPoint = {
			moduleId: module.id,
			assetBaseUrl: "https://assets.test.com",
			publicAppUrl: "https://app.test.com",
		}

		await codebaseRepository.save(codebase)
		;(projectDeploymentService as InMemoryProjectDeploymentService).seed(projectId, entryPoint)

		// Act
		const result = await deployToProductionUseCase.execute(projectId)

		// Assert
		expect(result.moduleId).toBe(module.id)
		expect(result.assetBaseUrl).toBe(entryPoint.assetBaseUrl)
		expect(result.publicAppUrl).toBe(entryPoint.publicAppUrl)
	})

	it("should use first module from codebase", async () => {
		// Arrange
		const projectId = "project-multiple-modules"
		const module1 = Module.create("repository-1", ModuleType.FRONTEND)
		const module2 = Module.create("repository-2", ModuleType.FRONTEND)
		const codebase = Codebase.create(projectId)
		codebase.addModule(module1)
		codebase.addModule(module2)

		const entryPoint: EntryPoint = {
			moduleId: module1.id,
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}

		await codebaseRepository.save(codebase)
		;(projectDeploymentService as InMemoryProjectDeploymentService).seed(projectId, entryPoint)

		// Act
		const result = await deployToProductionUseCase.execute(projectId)

		// Assert
		expect(result.moduleId).toBe(module1.id) // Should use first module
	})

	it("should deploy with PROD environment type", async () => {
		// Arrange
		const projectId = "project-prod"
		const module = Module.create("repository-prod", ModuleType.FRONTEND)
		const codebase = Codebase.create(projectId)
		codebase.addModule(module)

		const entryPoint: EntryPoint = {
			moduleId: module.id,
			assetBaseUrl: "https://assets.prod.com",
			publicAppUrl: "https://app.prod.com",
		}

		await codebaseRepository.save(codebase)
		;(projectDeploymentService as InMemoryProjectDeploymentService).seed(projectId, entryPoint)

		// Act
		const result = await deployToProductionUseCase.execute(projectId)

		// Assert
		expect(result).toBeDefined()
		expect(result.moduleId).toBe(module.id)
	})

	it("should use project-specific entry point when seeded", async () => {
		// Arrange
		const projectId1 = "project-1"
		const projectId2 = "project-2"
		const module1 = Module.create("repository-1", ModuleType.FRONTEND)
		const module2 = Module.create("repository-2", ModuleType.FRONTEND)
		const codebase1 = Codebase.create(projectId1)
		const codebase2 = Codebase.create(projectId2)
		codebase1.addModule(module1)
		codebase2.addModule(module2)

		const entryPoint1: EntryPoint = {
			moduleId: module1.id,
			assetBaseUrl: "https://assets.project1.com",
			publicAppUrl: "https://app.project1.com",
		}

		const entryPoint2: EntryPoint = {
			moduleId: module2.id,
			assetBaseUrl: "https://assets.project2.com",
			publicAppUrl: "https://app.project2.com",
		}

		await codebaseRepository.save(codebase1)
		await codebaseRepository.save(codebase2)
		;(projectDeploymentService as InMemoryProjectDeploymentService).seed(projectId1, entryPoint1)
		;(projectDeploymentService as InMemoryProjectDeploymentService).seed(projectId2, entryPoint2)

		// Act
		const result1 = await deployToProductionUseCase.execute(projectId1)
		const result2 = await deployToProductionUseCase.execute(projectId2)

		// Assert
		expect(result1.assetBaseUrl).toBe(entryPoint1.assetBaseUrl)
		expect(result1.publicAppUrl).toBe(entryPoint1.publicAppUrl)
		expect(result2.assetBaseUrl).toBe(entryPoint2.assetBaseUrl)
		expect(result2.publicAppUrl).toBe(entryPoint2.publicAppUrl)
	})

	it("should use default entry point when not seeded", async () => {
		// Arrange
		const projectId = "project-default"
		const module = Module.create("repository-default", ModuleType.FRONTEND)
		const codebase = Codebase.create(projectId)
		codebase.addModule(module)

		const defaultEntryPoint: EntryPoint = {
			moduleId: "default-module-id",
			assetBaseUrl: "https://default-assets.example.com",
			publicAppUrl: "https://default-app.example.com",
		}

		await codebaseRepository.save(codebase)
		;(projectDeploymentService as InMemoryProjectDeploymentService).setDefault(defaultEntryPoint)

		// Act
		const result = await deployToProductionUseCase.execute(projectId)

		// Assert
		expect(result.assetBaseUrl).toBe(defaultEntryPoint.assetBaseUrl)
		expect(result.publicAppUrl).toBe(defaultEntryPoint.publicAppUrl)
	})
})
