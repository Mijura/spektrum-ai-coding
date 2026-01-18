import { describe, it, expect, beforeEach } from "@rstest/core"
import { Request, Response } from "express"
import { InitializeReactModuleUseCase } from "@app/ports/use-cases/initialize-react-module"
import { createInitializeReactModuleController } from "@infra/http/factories/initialize-react-module"
import { Module, ModuleType } from "@domain/module"

describe("Initialize React Module Controller", () => {
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

	it("returns 201 and module data when projectId is provided", async () => {
		const mockModule = Module.rehydrate({
			id: "test-module-id",
			repositoryId: "repo-123",
			type: ModuleType.FRONTEND,
		})

		const mockUseCase: InitializeReactModuleUseCase = {
			execute: async () => mockModule,
		}

		controller = createInitializeReactModuleController(mockUseCase)

		mockRequest.body = {
			projectId: "test-project-id",
		}

		await controller(mockRequest as Request, mockResponse as Response)

		expect(statusCalls).toContain(201)
		expect(jsonCalls).toContainEqual({
			id: "test-module-id",
			repositoryId: "repo-123",
			type: ModuleType.FRONTEND,
		})
	})

	it("returns 500 when projectId is missing", async () => {
		const mockUseCase: InitializeReactModuleUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		controller = createInitializeReactModuleController(mockUseCase)

		mockRequest.body = {}

		await expect(
			controller(mockRequest as Request, mockResponse as Response)
		).rejects.toThrow("Project id is required")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: InitializeReactModuleUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		controller = createInitializeReactModuleController(mockUseCase)

		mockRequest.body = {
			projectId: "test-project-id",
		}

		await controller(mockRequest as Request, mockResponse as Response)

		expect(statusCalls).toContain(500)
		expect(jsonCalls).toContainEqual({ error: "Internal server error" })
	})
})
