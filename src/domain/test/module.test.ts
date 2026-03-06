import { describe, it, expect } from "@rstest/core"
import { Module, ModuleType } from "@domain/module"

describe("Module", () => {
	it("should add a module to an empty Codebase", () => {
		// Arrange
		const repositoryId = "repo-123"
		const moduleType = ModuleType.FRONTEND

		// Act
		const module = Module.create(repositoryId, moduleType)

		// Assert
		expect(module).toBeInstanceOf(Module)
		expect(module.id).toBeDefined()
		expect(typeof module.id).toBe("string")
		expect(module.repositoryId).toBe(repositoryId)
		expect(module.type).toBe(moduleType)
	})

	it("should create different modules with different IDs", () => {
		// Arrange
		const repositoryId = "repo-123"
		const moduleType = ModuleType.FRONTEND

		// Act
		const module1 = Module.create(repositoryId, moduleType)
		const module2 = Module.create(repositoryId, moduleType)
		const module3 = Module.create(repositoryId, moduleType)

		// Assert
		expect(module1.id).not.toBe(module2.id)
		expect(module2.id).not.toBe(module3.id)
		expect(module1.id).not.toBe(module3.id)
	})

	it("should create modules with valid UUID v4 IDs", () => {
		// Arrange
		const repositoryId = "repo-123"
		const moduleType = ModuleType.FRONTEND

		// Act
		const module = Module.create(repositoryId, moduleType)

		// Assert
		const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
		expect(module.id).toMatch(uuidV4Regex)
	})

	it("should create modules with correct repositoryId and type", () => {
		// Arrange
		const repositoryId1 = "repo-123"
		const repositoryId2 = "repo-456"
		const moduleType = ModuleType.FRONTEND

		// Act
		const module1 = Module.create(repositoryId1, moduleType)
		const module2 = Module.create(repositoryId2, moduleType)

		// Assert
		expect(module1.repositoryId).toBe(repositoryId1)
		expect(module2.repositoryId).toBe(repositoryId2)
		expect(module1.type).toBe(moduleType)
		expect(module2.type).toBe(moduleType)
	})

	describe("create", () => {
		it("should create a new Module instance", () => {
			// Arrange
			const repositoryId = "repo-123"
			const moduleType = ModuleType.FRONTEND

			// Act
			const module = Module.create(repositoryId, moduleType)

			// Assert
			expect(module).toBeInstanceOf(Module)
			expect(module.id).toBeDefined()
			expect(typeof module.id).toBe("string")
			expect(module.repositoryId).toBe(repositoryId)
			expect(module.type).toBe(moduleType)
		})

		it("should create Module with a valid UUID v4 id", () => {
			// Arrange
			const repositoryId = "repo-123"
			const moduleType = ModuleType.FRONTEND

			// Act
			const module = Module.create(repositoryId, moduleType)

			// Assert
			const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
			expect(module.id).toMatch(uuidV4Regex)
		})

		it("should create different Module instances with different IDs", () => {
			// Arrange
			const repositoryId = "repo-123"
			const moduleType = ModuleType.FRONTEND

			// Act
			const module1 = Module.create(repositoryId, moduleType)
			const module2 = Module.create(repositoryId, moduleType)
			const module3 = Module.create(repositoryId, moduleType)

			// Assert
			expect(module1.id).not.toBe(module2.id)
			expect(module2.id).not.toBe(module3.id)
			expect(module1.id).not.toBe(module3.id)
		})

		it("should create Module with correct repositoryId", () => {
			// Arrange
			const repositoryId = "repo-123"
			const moduleType = ModuleType.FRONTEND

			// Act
			const module = Module.create(repositoryId, moduleType)

			// Assert
			expect(module.repositoryId).toBe(repositoryId)
		})

		it("should create Module with correct type", () => {
			// Arrange
			const repositoryId = "repo-123"
			const moduleType = ModuleType.FRONTEND

			// Act
			const module = Module.create(repositoryId, moduleType)

			// Assert
			expect(module.type).toBe(moduleType)
		})
	})

	describe("rehydrate", () => {
		it("should rehydrate Module with provided data", () => {
			// Arrange
			const data = {
				id: "test-id-123",
				repositoryId: "repo-123",
				type: ModuleType.FRONTEND,
			}

			// Act
			const rehydrated = Module.rehydrate(data)

			// Assert
			expect(rehydrated).toBeInstanceOf(Module)
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.repositoryId).toBe(data.repositoryId)
			expect(rehydrated.type).toBe(data.type)
		})

		it("should rehydrate Module with different IDs", () => {
			// Arrange
			const data1 = {
				id: "test-id-1",
				repositoryId: "repo-123",
				type: ModuleType.FRONTEND,
			}
			const data2 = {
				id: "test-id-2",
				repositoryId: "repo-123",
				type: ModuleType.FRONTEND,
			}

			// Act
			const rehydrated1 = Module.rehydrate(data1)
			const rehydrated2 = Module.rehydrate(data2)

			// Assert
			expect(rehydrated1.id).toBe(data1.id)
			expect(rehydrated2.id).toBe(data2.id)
			expect(rehydrated1.id).not.toBe(rehydrated2.id)
		})

		it("should rehydrate Module with different repositoryIds", () => {
			// Arrange
			const data1 = {
				id: "test-id-1",
				repositoryId: "repo-123",
				type: ModuleType.FRONTEND,
			}
			const data2 = {
				id: "test-id-2",
				repositoryId: "repo-456",
				type: ModuleType.FRONTEND,
			}

			// Act
			const rehydrated1 = Module.rehydrate(data1)
			const rehydrated2 = Module.rehydrate(data2)

			// Assert
			expect(rehydrated1.repositoryId).toBe(data1.repositoryId)
			expect(rehydrated2.repositoryId).toBe(data2.repositoryId)
			expect(rehydrated1.repositoryId).not.toBe(rehydrated2.repositoryId)
		})

		it("should rehydrate Module preserving all properties", () => {
			// Arrange
			const data = {
				id: "test-id-789",
				repositoryId: "repo-789",
				type: ModuleType.FRONTEND,
			}

			// Act
			const rehydrated = Module.rehydrate(data)

			// Assert
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.repositoryId).toBe(data.repositoryId)
			expect(rehydrated.type).toBe(data.type)
		})

		it("should rehydrate Module that can be used like a created module", () => {
			// Arrange
			const data = {
				id: "test-id-abc",
				repositoryId: "repo-abc",
				type: ModuleType.FRONTEND,
			}

			// Act
			const rehydrated = Module.rehydrate(data)

			// Assert
			expect(rehydrated).toBeInstanceOf(Module)
			expect(rehydrated.id).toBeDefined()
			expect(rehydrated.repositoryId).toBeDefined()
			expect(rehydrated.type).toBeDefined()
		})
	})
})
