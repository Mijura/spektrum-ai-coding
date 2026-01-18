import { describe, it, expect, beforeEach, afterEach } from "@rstest/core"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBCodebaseRepository } from "@infra/repositories/codebase/codebase-repository"
import { Codebase } from "@domain/codebase"
import { Module, ModuleType } from "@domain/module"

describe("DynamoDB Codebase Repository", () => {
	let repository: DynamoDBCodebaseRepository
	let ddbDocClient: DynamoDBDocumentClient
	const testProjectIds: string[] = []

	const client = new DynamoDBClient({
		region: process.env.AWS_REGION,
		profile: process.env.AWS_PROFILE,
	})

	beforeEach(() => {
		ddbDocClient = DynamoDBDocumentClient.from(client)
		repository = new DynamoDBCodebaseRepository()
	})

	afterEach(async () => {
		// Clean up test data from DynamoDB
		const tableName = process.env.CODEBASE_TABLE
		if (!tableName) return

		for (const projectId of testProjectIds) {
			try {
				await ddbDocClient.send(
					new DeleteCommand({
						TableName: tableName,
						Key: {
							projectId: projectId,
						},
					}),
				)
			} catch (error) {
				console.error(`Failed to delete test data with projectId ${projectId}:`, error)
			}
		}
		testProjectIds.length = 0
	})

	it("should save a codebase to DynamoDB", async () => {
		const projectId = "test-project-1"
		const codebase = Codebase.create(projectId)
		testProjectIds.push(projectId)

		await repository.save(codebase)

		const retrieved = await repository.get(projectId)
		expect(retrieved).toBeDefined()
		expect(retrieved.projectId).toBe(projectId)
		expect(retrieved.modules).toHaveLength(0)
	})

	it("should save a codebase with modules to DynamoDB", async () => {
		const projectId = "test-project-2"
		const codebase = Codebase.create(projectId)
		const module1 = Module.create("repository-1", ModuleType.FRONTEND)
		const module2 = Module.create("repository-2", ModuleType.FRONTEND)
		codebase.addModule(module1)
		codebase.addModule(module2)
		testProjectIds.push(projectId)

		await repository.save(codebase)

		const retrieved = await repository.get(projectId)
		expect(retrieved).toBeDefined()
		expect(retrieved.projectId).toBe(projectId)
		expect(retrieved.modules).toHaveLength(2)
		expect(retrieved.modules[0].id).toBe(module1.id)
		expect(retrieved.modules[0].repositoryId).toBe(module1.repositoryId)
		expect(retrieved.modules[0].type).toBe(module1.type)
		expect(retrieved.modules[1].id).toBe(module2.id)
		expect(retrieved.modules[1].repositoryId).toBe(module2.repositoryId)
		expect(retrieved.modules[1].type).toBe(module2.type)
	})

	it("should retrieve a previously saved codebase from DynamoDB", async () => {
		const projectId = "test-project-3"
		const codebase = Codebase.create(projectId)
		const module = Module.create("repository-3", ModuleType.FRONTEND)
		codebase.addModule(module)
		testProjectIds.push(projectId)

		await repository.save(codebase)

		const retrieved = await repository.get(projectId)
		expect(retrieved).toBeDefined()
		expect(retrieved.projectId).toBe(projectId)
		expect(retrieved.modules).toHaveLength(1)
		expect(retrieved.modules[0].id).toBe(module.id)
		expect(retrieved.modules[0].repositoryId).toBe(module.repositoryId)
		expect(retrieved.modules[0].type).toBe(module.type)
	})

	it("should throw an error when retrieving a non-existent codebase", async () => {
		const nonExistentProjectId = "non-existent-project-id"
		await expect(repository.get(nonExistentProjectId)).rejects.toThrow("Codebase not found!")
	})

	it("should update an existing codebase when saving again", async () => {
		const projectId = "test-project-4"
		const codebase = Codebase.create(projectId)
		const module1 = Module.create("repository-4", ModuleType.FRONTEND)
		codebase.addModule(module1)
		testProjectIds.push(projectId)

		await repository.save(codebase)

		const module2 = Module.create("repository-5", ModuleType.FRONTEND)
		codebase.addModule(module2)

		await repository.save(codebase)

		const retrieved = await repository.get(projectId)
		expect(retrieved).toBeDefined()
		expect(retrieved.projectId).toBe(projectId)
		expect(retrieved.modules).toHaveLength(2)
		expect(retrieved.modules.map((m) => m.id)).toContain(module1.id)
		expect(retrieved.modules.map((m) => m.id)).toContain(module2.id)
	})

	it("should save and retrieve a codebase with multiple modules correctly", async () => {
		const projectId = "test-project-5"
		const codebase = Codebase.create(projectId)
		const module1 = Module.create("repository-6", ModuleType.FRONTEND)
		const module2 = Module.create("repository-7", ModuleType.FRONTEND)
		const module3 = Module.create("repository-8", ModuleType.FRONTEND)
		codebase.addModule(module1)
		codebase.addModule(module2)
		codebase.addModule(module3)
		testProjectIds.push(projectId)

		await repository.save(codebase)

		const retrieved = await repository.get(projectId)
		expect(retrieved).toBeDefined()
		expect(retrieved.projectId).toBe(projectId)
		expect(retrieved.modules).toHaveLength(3)
		expect(retrieved.modules.map((m) => m.id)).toContain(module1.id)
		expect(retrieved.modules.map((m) => m.id)).toContain(module2.id)
		expect(retrieved.modules.map((m) => m.id)).toContain(module3.id)
		expect(retrieved.modules.every((m) => m.type === ModuleType.FRONTEND)).toBe(true)
	})

	it("should preserve module order when saving and retrieving", async () => {
		const projectId = "test-project-6"
		const codebase = Codebase.create(projectId)
		const module1 = Module.create("repository-9", ModuleType.FRONTEND)
		const module2 = Module.create("repository-10", ModuleType.FRONTEND)
		const module3 = Module.create("repository-11", ModuleType.FRONTEND)
		codebase.addModule(module1)
		codebase.addModule(module2)
		codebase.addModule(module3)
		testProjectIds.push(projectId)

		await repository.save(codebase)

		const retrieved = await repository.get(projectId)
		expect(retrieved.modules[0].id).toBe(module1.id)
		expect(retrieved.modules[1].id).toBe(module2.id)
		expect(retrieved.modules[2].id).toBe(module3.id)
	})

	it("should throw an error when DynamoDB get operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.CODEBASE_TABLE
		process.env.CODEBASE_TABLE = ""

		try {
			await expect(repository.get("some-project-id")).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.CODEBASE_TABLE = originalTableName
			} else {
				delete process.env.CODEBASE_TABLE
			}
		}
	})

	it("should throw an error when DynamoDB save operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.CODEBASE_TABLE
		process.env.CODEBASE_TABLE = ""

		const codebase = Codebase.create("test-project-error")
		// Note: Not tracking for cleanup since save will fail and nothing will be written to DynamoDB

		try {
			await expect(repository.save(codebase)).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.CODEBASE_TABLE = originalTableName
			} else {
				delete process.env.CODEBASE_TABLE
			}
		}
	})
})
