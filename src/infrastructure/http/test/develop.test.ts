import { describe, it, expect, beforeEach } from "@rstest/core"
import { Request, Response } from "express"
import { DevelopUseCase } from "@app/ports/use-cases/develop"
import { createDevelopController } from "@infra/http/factories/develop"
import { Task, TaskStatus } from "@jigjoy-io/task-contracts"

describe("Develop Controller", () => {
	let controller: (req: Request, res: Response) => Promise<void>
	let mockRequest: Partial<Request>
	let mockResponse: Partial<Response>
	let statusCalls: number[]
	let jsonCalls: any[]

	beforeEach(() => {
		statusCalls = []
		jsonCalls = []
		
		const statusFn = (code: number) => {
			statusCalls.push(code)
			return mockResponse as Response
		}

		const jsonFn = (data: any) => {
			jsonCalls.push(data)
			return mockResponse as Response
		}

		mockResponse = {
			status: statusFn,
			json: jsonFn,
		}

		mockRequest = {
			body: {},
		}
	})

	it("returns 200 and success message when task and accountId are provided", async () => {
		const mockTask: Task = {
			id: "task-123",
			projectId: "project-123",
			title: "Test Task",
			description: "Test description",
			status: TaskStatus.TODO,
			created: "2024-01-01T00:00:00.000Z",
			updated: "2024-01-01T00:00:00.000Z",
			activities: [],
		}

		const mockUseCase: DevelopUseCase = {
			execute: async () => {},
		}

		controller = createDevelopController(mockUseCase)

		mockRequest.body = {
			task: mockTask,
			accountId: "account-123",
		}

		await controller(mockRequest as Request, mockResponse as Response)

		expect(statusCalls).toContain(200)
		expect(jsonCalls).toContainEqual({ message: "Task developed successfully" })
	})

	it("returns 500 when task is missing", async () => {
		const mockUseCase: DevelopUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		controller = createDevelopController(mockUseCase)

		mockRequest.body = {
			accountId: "account-123",
		}

		await controller(mockRequest as Request, mockResponse as Response)

		expect(statusCalls).toContain(500)
		expect(jsonCalls).toContainEqual({ error: "Internal server error" })
	})

	it("returns 500 when accountId is missing", async () => {
		const mockTask: Task = {
			id: "task-123",
			projectId: "project-123",
			title: "Test Task",
			description: "Test description",
			status: TaskStatus.TODO,
			created: "2024-01-01T00:00:00.000Z",
			updated: "2024-01-01T00:00:00.000Z",
			activities: [],
		}

		const mockUseCase: DevelopUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		controller = createDevelopController(mockUseCase)

		mockRequest.body = {
			task: mockTask,
		}

		await controller(mockRequest as Request, mockResponse as Response)

		expect(statusCalls).toContain(500)
		expect(jsonCalls).toContainEqual({ error: "Internal server error" })
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockTask: Task = {
			id: "task-123",
			projectId: "project-123",
			title: "Test Task",
			description: "Test description",
			status: TaskStatus.TODO,
			created: "2024-01-01T00:00:00.000Z",
			updated: "2024-01-01T00:00:00.000Z",
			activities: [],
		}

		const mockUseCase: DevelopUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		controller = createDevelopController(mockUseCase)

		mockRequest.body = {
			task: mockTask,
			accountId: "account-123",
		}

		await controller(mockRequest as Request, mockResponse as Response)

		expect(statusCalls).toContain(500)
		expect(jsonCalls).toContainEqual({ error: "Internal server error" })
	})
})
