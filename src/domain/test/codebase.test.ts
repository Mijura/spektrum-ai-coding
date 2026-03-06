import { describe, it, expect } from "@rstest/core"
import { Codebase } from "@domain/codebase"
import { Module, ModuleType } from "@domain/module"

describe("Codebase", () => {
	it("should add a module to an empty Codebase", () => {
		// Arrange
		const codebase = Codebase.create("project-123")
		const module = Module.create("repo-123", ModuleType.FRONTEND)

		// Act
		codebase.addModule(module)

		// Assert
		expect(codebase.modules).toHaveLength(1)
		expect(codebase.modules[0]).toBe(module)
	})

	it("should add multiple modules to a Codebase", () => {
		// Arrange
		const codebase = Codebase.create("project-123")
		const module1 = Module.create("repo-123", ModuleType.FRONTEND)
		const module2 = Module.create("repo-456", ModuleType.FRONTEND)
		const module3 = Module.create("repo-789", ModuleType.FRONTEND)

		// Act
		codebase.addModule(module1)
		codebase.addModule(module2)
		codebase.addModule(module3)

		// Assert
		expect(codebase.modules).toHaveLength(3)
		expect(codebase.modules).toContain(module1)
		expect(codebase.modules).toContain(module2)
		expect(codebase.modules).toContain(module3)
	})

	it("should maintain modules in order", () => {
		// Arrange
		const codebase = Codebase.create("project-123")
		const module1 = Module.create("repo-123", ModuleType.FRONTEND)
		const module2 = Module.create("repo-456", ModuleType.FRONTEND)
		const module3 = Module.create("repo-789", ModuleType.FRONTEND)

		// Act
		codebase.addModule(module1)
		codebase.addModule(module2)
		codebase.addModule(module3)

		// Assert
		expect(codebase.modules[0]).toBe(module1)
		expect(codebase.modules[1]).toBe(module2)
		expect(codebase.modules[2]).toBe(module3)
	})

	it("should allow adding modules with same repositoryId", () => {
		// Arrange
		const codebase = Codebase.create("project-123")
		const module1 = Module.create("repo-123", ModuleType.FRONTEND)
		const module2 = Module.create("repo-123", ModuleType.FRONTEND)

		// Act
		codebase.addModule(module1)
		codebase.addModule(module2)

		// Assert
		expect(codebase.modules).toHaveLength(2)
		expect(module1.id).not.toBe(module2.id)
		expect(codebase.modules[0]).toBe(module1)
		expect(codebase.modules[1]).toBe(module2)
	})

	describe("create", () => {
		it("should create a new Codebase instance", () => {
			// Arrange
			const projectId = "project-123"

			// Act
			const codebase = Codebase.create(projectId)

			// Assert
			expect(codebase).toBeInstanceOf(Codebase)
			expect(codebase.projectId).toBe(projectId)
			expect(codebase.modules).toBeDefined()
		})

		it("should create Codebase with empty modules array", () => {
			// Arrange
			const projectId = "project-123"

			// Act
			const codebase = Codebase.create(projectId)

			// Assert
			expect(codebase.modules).toHaveLength(0)
			expect(Array.isArray(codebase.modules)).toBe(true)
		})

		it("should create Codebase with correct projectId", () => {
			// Arrange
			const projectId = "project-123"

			// Act
			const codebase = Codebase.create(projectId)

			// Assert
			expect(codebase.projectId).toBe(projectId)
		})

		it("should create different Codebase instances with different projectIds", () => {
			// Act
			const codebase1 = Codebase.create("project-1")
			const codebase2 = Codebase.create("project-2")
			const codebase3 = Codebase.create("project-3")

			// Assert
			expect(codebase1.projectId).not.toBe(codebase2.projectId)
			expect(codebase2.projectId).not.toBe(codebase3.projectId)
			expect(codebase1.projectId).not.toBe(codebase3.projectId)
		})

		it("should create a Codebase that is ready to use", () => {
			// Arrange
			const codebase = Codebase.create("project-123")
			const module = Module.create("repo-123", ModuleType.FRONTEND)

			// Act
			codebase.addModule(module)

			// Assert
			expect(codebase.modules).toHaveLength(1)
			expect(codebase.modules[0]).toBe(module)
		})
	})

	describe("rehydrate", () => {
		it("should rehydrate Codebase with empty modules", () => {
			// Arrange
			const data = {
				projectId: "project-123",
				modules: [],
			}

			// Act
			const rehydrated = Codebase.rehydrate(data)

			// Assert
			expect(rehydrated).toBeInstanceOf(Codebase)
			expect(rehydrated.projectId).toBe(data.projectId)
			expect(rehydrated.modules).toHaveLength(0)
		})

		it("should rehydrate Codebase with a single module", () => {
			// Arrange
			const moduleData = {
				id: "module-id-1",
				repositoryId: "repo-123",
				type: ModuleType.FRONTEND,
			}
			const module = Module.rehydrate(moduleData)
			const data = {
				projectId: "project-123",
				modules: [module],
			}

			// Act
			const rehydrated = Codebase.rehydrate(data)

			// Assert
			expect(rehydrated.projectId).toBe(data.projectId)
			expect(rehydrated.modules).toHaveLength(1)
			expect(rehydrated.modules[0]).toBe(module)
			expect(rehydrated.modules[0].id).toBe(moduleData.id)
			expect(rehydrated.modules[0].repositoryId).toBe(moduleData.repositoryId)
			expect(rehydrated.modules[0].type).toBe(moduleData.type)
		})

		it("should rehydrate Codebase with multiple modules", () => {
			// Arrange
			const module1Data = {
				id: "module-id-1",
				repositoryId: "repo-123",
				type: ModuleType.FRONTEND,
			}
			const module2Data = {
				id: "module-id-2",
				repositoryId: "repo-456",
				type: ModuleType.FRONTEND,
			}
			const module3Data = {
				id: "module-id-3",
				repositoryId: "repo-789",
				type: ModuleType.FRONTEND,
			}
			const module1 = Module.rehydrate(module1Data)
			const module2 = Module.rehydrate(module2Data)
			const module3 = Module.rehydrate(module3Data)
			const data = {
				projectId: "project-123",
				modules: [module1, module2, module3],
			}

			// Act
			const rehydrated = Codebase.rehydrate(data)

			// Assert
			expect(rehydrated.projectId).toBe(data.projectId)
			expect(rehydrated.modules).toHaveLength(3)
			expect(rehydrated.modules[0].id).toBe(module1Data.id)
			expect(rehydrated.modules[1].id).toBe(module2Data.id)
			expect(rehydrated.modules[2].id).toBe(module3Data.id)
		})

		it("should rehydrate Codebase preserving module order", () => {
			// Arrange
			const module1 = Module.rehydrate({
				id: "module-id-1",
				repositoryId: "repo-123",
				type: ModuleType.FRONTEND,
			})
			const module2 = Module.rehydrate({
				id: "module-id-2",
				repositoryId: "repo-456",
				type: ModuleType.FRONTEND,
			})
			const module3 = Module.rehydrate({
				id: "module-id-3",
				repositoryId: "repo-789",
				type: ModuleType.FRONTEND,
			})
			const data = {
				projectId: "project-123",
				modules: [module1, module2, module3],
			}

			// Act
			const rehydrated = Codebase.rehydrate(data)

			// Assert
			expect(rehydrated.modules[0]).toBe(module1)
			expect(rehydrated.modules[1]).toBe(module2)
			expect(rehydrated.modules[2]).toBe(module3)
		})

		it("should rehydrate Codebase that can be used like a created codebase", () => {
			// Arrange
			const module1 = Module.rehydrate({
				id: "module-id-1",
				repositoryId: "repo-123",
				type: ModuleType.FRONTEND,
			})
			const data = {
				projectId: "project-123",
				modules: [module1],
			}

			// Act
			const rehydrated = Codebase.rehydrate(data)
			const newModule = Module.create("repo-456", ModuleType.FRONTEND)
			rehydrated.addModule(newModule)

			// Assert
			expect(rehydrated.modules).toHaveLength(2)
			expect(rehydrated.modules[0]).toBe(module1)
			expect(rehydrated.modules[1]).toBe(newModule)
		})
	})
})
