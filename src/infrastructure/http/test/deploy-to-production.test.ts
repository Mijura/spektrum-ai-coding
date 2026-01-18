import { describe, it, expect, beforeEach } from "@rstest/core"
import { Request, Response } from "express"
import { DeployToProductionUseCase } from "@app/ports/use-cases/deploy-to-production"
import { createDeployToProductionController } from "@infra/http/factories/deploy-to-production"
import { EntryPoint } from "@app/types/entry-point"

describe("Deploy To Production Controller", () => {
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

	it("returns 200 and entryPoint data when projectId is provided", async () => {
		const mockEntryPoint: EntryPoint = {
			moduleId: "module-123",
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}

		const mockUseCase: DeployToProductionUseCase = {
			execute: async () => mockEntryPoint,
		}

		controller = createDeployToProductionController(mockUseCase)

		mockRequest.body = {
			projectId: "test-project-id",
		}

		await controller(mockRequest as Request, mockResponse as Response)

		expect(statusCalls).toContain(200)
		expect(jsonCalls).toContainEqual({
			moduleId: "module-123",
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		})
	})

	it("returns 500 when projectId is missing", async () => {
		const mockUseCase: DeployToProductionUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		controller = createDeployToProductionController(mockUseCase)

		mockRequest.body = {}

		await expect(
			controller(mockRequest as Request, mockResponse as Response)
		).rejects.toThrow("Project id is required")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: DeployToProductionUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		controller = createDeployToProductionController(mockUseCase)

		mockRequest.body = {
			projectId: "test-project-id",
		}

		await controller(mockRequest as Request, mockResponse as Response)

		expect(statusCalls).toContain(500)
		expect(jsonCalls).toContainEqual({ error: "Internal server error" })
	})
})
