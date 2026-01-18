import { describe, it, expect, beforeEach } from "@rstest/core"
import { InitializeReactModule } from "@app/use-cases/initialize-react-module"
import { InMemoryVersionControlService } from "@app/test/mocks/in-memory-version-control-service"
import { InMemoryTemplateRepository } from "@app/test/mocks/in-memory-template-repository"
import { InMemoryCodebaseRepository } from "@app/test/mocks/in-memory-codebase-repository"
import { VersionControlService } from "@app/ports/services/version-control-service"
import { TemplateRepositoryPort } from "@app/ports/repositories/template-repository"
import { CodebaseRepositoryPort } from "@app/ports/repositories/codebase-repository"
import { Module, ModuleType } from "@domain/module"
import { FileArtifacts } from "@domain/file-artifacts"

describe("InitializeReactModule", () => {
	let initializeReactModuleUseCase: InitializeReactModule
	let vcs: VersionControlService
	let templateRepository: TemplateRepositoryPort
	let codebaseRepository: CodebaseRepositoryPort

	beforeEach(() => {
		vcs = new InMemoryVersionControlService()
		templateRepository = new InMemoryTemplateRepository()
		codebaseRepository = new InMemoryCodebaseRepository()
		initializeReactModuleUseCase = new InitializeReactModule(vcs, templateRepository, codebaseRepository)
	})

	it("should successfully initialize a React module", async () => {
		// Arrange
		const projectId = "project-123"
		const repositoryId = "repository-456"
		const buildArtifacts = new FileArtifacts()
		buildArtifacts["dist/index.js"] = "console.log('Hello')"
		const sourceCode = new FileArtifacts()
		sourceCode["src/index.tsx"] = "export default function App() {}"
		;(vcs as InMemoryVersionControlService).seedInit(repositoryId)
		;(templateRepository as InMemoryTemplateRepository).setDefaultPrebuiltFiles(buildArtifacts)
		;(templateRepository as InMemoryTemplateRepository).setDefaultSourceCode(sourceCode)

		// Act
		const result = await initializeReactModuleUseCase.execute(projectId)

		// Assert
		expect(result).toBeDefined()
		expect(result.repositoryId).toBe(repositoryId)
		expect(result.type).toBe(ModuleType.FRONTEND)
		expect(result.id).toBeDefined()
	})

	it("should save codebase to repository", async () => {
		// Arrange
		const projectId = "project-456"
		const repositoryId = "repository-789"
		const buildArtifacts = new FileArtifacts()
		const sourceCode = new FileArtifacts()

		;(vcs as InMemoryVersionControlService).seedInit(repositoryId)
		;(templateRepository as InMemoryTemplateRepository).setDefaultPrebuiltFiles(buildArtifacts)
		;(templateRepository as InMemoryTemplateRepository).setDefaultSourceCode(sourceCode)

		// Act
		await initializeReactModuleUseCase.execute(projectId)

		// Assert
		const savedCodebase = await codebaseRepository.get(projectId)
		expect(savedCodebase).toBeDefined()
		expect(savedCodebase.projectId).toBe(projectId)
		expect(savedCodebase.modules).toHaveLength(1)
		expect(savedCodebase.modules[0].repositoryId).toBe(repositoryId)
		expect(savedCodebase.modules[0].type).toBe(ModuleType.FRONTEND)
	})

	it("should push version to version control service", async () => {
		// Arrange
		const projectId = "project-789"
		const repositoryId = "repository-abc"
		const buildArtifacts = new FileArtifacts()
		buildArtifacts["dist/bundle.js"] = "bundle content"
		const sourceCode = new FileArtifacts()
		sourceCode["src/App.tsx"] = "App component"
		;(vcs as InMemoryVersionControlService).seedInit(repositoryId)
		;(templateRepository as InMemoryTemplateRepository).setDefaultPrebuiltFiles(buildArtifacts)
		;(templateRepository as InMemoryTemplateRepository).setDefaultSourceCode(sourceCode)

		// Act
		await initializeReactModuleUseCase.execute(projectId)

		// Assert
		const version = await vcs.pull(repositoryId)
		expect(version).toBeDefined()
		expect(version.repositoryId).toBe(repositoryId)
		expect(version.buildArtifacts).toEqual(buildArtifacts)
		expect(version.sourceCodeArtifacts).toEqual(sourceCode)
	})

	it("should create module with correct repository ID from VCS", async () => {
		// Arrange
		const projectId = "project-xyz"
		const customRepositoryId = "custom-repo-123"
		const buildArtifacts = new FileArtifacts()
		const sourceCode = new FileArtifacts()

		;(vcs as InMemoryVersionControlService).seedInit(customRepositoryId)
		;(templateRepository as InMemoryTemplateRepository).setDefaultPrebuiltFiles(buildArtifacts)
		;(templateRepository as InMemoryTemplateRepository).setDefaultSourceCode(sourceCode)

		// Act
		const result = await initializeReactModuleUseCase.execute(projectId)

		// Assert
		expect(result.repositoryId).toBe(customRepositoryId)
		const savedCodebase = await codebaseRepository.get(projectId)
		expect(savedCodebase.modules[0].repositoryId).toBe(customRepositoryId)
	})

	it("should use template files from template repository", async () => {
		// Arrange
		const projectId = "project-template"
		const repositoryId = "repo-template"
		const buildArtifacts = new FileArtifacts()
		buildArtifacts["dist/main.js"] = "main bundle"
		buildArtifacts["dist/style.css"] = "body { margin: 0; }"
		const sourceCode = new FileArtifacts()
		sourceCode["src/main.tsx"] = "import React from 'react'"
		sourceCode["package.json"] = '{"name": "my-app"}'
		;(vcs as InMemoryVersionControlService).seedInit(repositoryId)
		;(templateRepository as InMemoryTemplateRepository).setDefaultPrebuiltFiles(buildArtifacts)
		;(templateRepository as InMemoryTemplateRepository).setDefaultSourceCode(sourceCode)

		// Act
		await initializeReactModuleUseCase.execute(projectId)

		// Assert
		const version = await vcs.pull(repositoryId)
		expect(version.buildArtifacts["dist/main.js"]).toBe("main bundle")
		expect(version.buildArtifacts["dist/style.css"]).toBe("body { margin: 0; }")
		expect(version.sourceCodeArtifacts["src/main.tsx"]).toBe("import React from 'react'")
		expect(version.sourceCodeArtifacts["package.json"]).toBe('{"name": "my-app"}')
	})

	it("should create unique modules for different projects", async () => {
		// Arrange
		const projectId1 = "project-1"
		const projectId2 = "project-2"
		const repositoryId1 = "repo-1"
		const repositoryId2 = "repo-2"
		const buildArtifacts = new FileArtifacts()
		const sourceCode = new FileArtifacts()

		;(vcs as InMemoryVersionControlService).seedInit(repositoryId1)
		;(vcs as InMemoryVersionControlService).seedInit(repositoryId2)
		;(templateRepository as InMemoryTemplateRepository).setDefaultPrebuiltFiles(buildArtifacts)
		;(templateRepository as InMemoryTemplateRepository).setDefaultSourceCode(sourceCode)

		// Act
		const module1 = await initializeReactModuleUseCase.execute(projectId1)
		const module2 = await initializeReactModuleUseCase.execute(projectId2)

		// Assert
		expect(module1.id).not.toBe(module2.id)
		expect(module1.repositoryId).toBe(repositoryId1)
		expect(module2.repositoryId).toBe(repositoryId2)

		const codebase1 = await codebaseRepository.get(projectId1)
		const codebase2 = await codebaseRepository.get(projectId2)
		expect(codebase1.modules[0].id).not.toBe(codebase2.modules[0].id)
	})
})
