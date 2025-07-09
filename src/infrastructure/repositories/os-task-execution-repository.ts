import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws"
import { defaultProvider } from "@aws-sdk/credential-provider-node"
import { Client } from "@opensearch-project/opensearch"
import { PaginationData } from "@domain/types/activity"
import { TaskExecution } from "@domain/entities/task-execution"
import { TaskExecutionRepository } from "@domain/repositories/task-execution-repository"
import { OpenSearchHeatmapResponse, WorkflowRunMapper } from "@infrastructure/mappers/workflow-run-mapper"
import { TaskExecutionHeatmap, TimeRangeData } from "@domain/types/workflow"

export class OpenSearchTaskExecutionRepository implements TaskExecutionRepository {

	getClient(): Client {
		const OPENSEARCH_ENDPOINT = process.env.OPENSEARCH_ENDPOINT || ""

		return new Client({
			...AwsSigv4Signer({
				region: process.env.AWS_REGION || "eu-west-1",
				service: "aoss",
				getCredentials: () => {
					const credentialsProvider = defaultProvider()
					return credentialsProvider()
				},
			}),
			node: OPENSEARCH_ENDPOINT,
		})
	}

	getIndex(): string {
		const index = process.env.OPENSEARCH_COLLECTION

		if (!index) {
			throw new Error("OPENSEARCH_COLLECTION is not found")
		}

		return index
	}

	private async indexExists(index: string): Promise<boolean> {
		const client = this.getClient()
		const exists = await client.indices.exists({ index })
		return exists.body ?? exists
	}

	private async createIndexIfNotExists(index: string) {
		const client = this.getClient()

		if (!this.indexExists(index)) {
			const response = await client.indices.create({ index, 			
				body: {
					mappings: {
						properties: {
							projectId: { type: 'keyword' },
							accountId: { type: 'keyword' },
							occurredAt: { type: 'date' }
						}
					}
				} 
			})
			console.log(`Index created: ${JSON.stringify(response.body)}`)
		}
	}

    async save(taskExecution: TaskExecution): Promise<TaskExecution> {
		const index = this.getIndex()

        const client = this.getClient()		
		// create index if it doesn't already exist
		await this.createIndexIfNotExists(index)

		if (!taskExecution.id) {
			throw new Error("taskExecution.id is required for saving. Missing ID may cause unintended document creation.")
		}

		const response = await client.update({
			index,
			id: taskExecution.id,
			body: {
				doc: taskExecution,
				doc_as_upsert: true
			}
		});
	
		if (response.statusCode !== 200 && response.statusCode !== 201) {
			throw new Error(`Failed to save task execution: ${JSON.stringify(response)}`);
		}

		return response.body as unknown as TaskExecution
    }

    async get(taskExecutionId: string): Promise<TaskExecution | null> {
		const index = this.getIndex()

		const client = this.getClient()

		console.log(`Fetching task execution by id: ${taskExecutionId}`)

		const indexExists = await this.indexExists(index)
		if (!indexExists) {
			console.log(`Index ${index} does not exist`)
			return null
		}

		let response = await client.get({
			index: index,
			id: taskExecutionId,
		})

		return response.body._source as TaskExecution
    }

	async getTimelineByProjectId(projectId: string, pagination: PaginationData): Promise<TaskExecution[]> {
		const index = this.getIndex()

		const client = this.getClient()
		const from = (pagination.pageNumber - 1) * pagination.pageSize

		console.log(`Fetching task execution timeline for projectId: ${projectId} with pagination: ${JSON.stringify(pagination)}`)

		const indexExists = await this.indexExists(index)
		if (!indexExists) {
			console.log(`Index ${index} does not exist`)
			return []
		}

		const query: any = {
			size: pagination.pageSize,
			from,
			query: {
				bool: {
					must: [{ term: { "projectId.keyword": projectId } }],
				},
			},
			sort: [{ occurredAt: "desc" }],
		}

		let response = await client.search({
			index: index,
			body: query,
		})


		return response.body.hits.hits.map((hit: any) => hit._source) as TaskExecution[]
	}

	async getTimelineByAccountId(accountId: string, pagination: PaginationData): Promise<TaskExecution[]> {
		const index = this.getIndex()

		const client = this.getClient()
		const from = (pagination.pageNumber - 1) * pagination.pageSize

		console.log(`Fetching task execution timeline for accountId: ${accountId} with pagination: ${JSON.stringify(pagination)}`)

		// check if index exists
		const indexExists = await this.indexExists(index)
		if (!indexExists) {
			console.log(`Index ${index} does not exist`)
			return []
		}

		const query: any = {
			size: pagination.pageSize,
			from,
			query: {
				bool: {
					must: [{ term: { "accountId.keyword": accountId } }],
				},
			},
			sort: [{ occurredAt: "desc" }],
		}

		let response = await client.search({
			index: index,
			body: query,
		})


		return response.body.hits.hits.map((hit: any) => hit._source) as TaskExecution[]
	}	


	/**
	 * Heatmap: Get the number of workflow run per day for a given accountId
	 */
	async getHeatmap(accountId: string, timeRange: TimeRangeData): Promise<TaskExecutionHeatmap[]> {
		const index = this.getIndex()
		const client = this.getClient()

		const startDate = timeRange.startDate
		const endDate = timeRange.endDate

		console.log(`Searching for heatmap data for accountId: ${accountId}, startDate: ${startDate}, endDate: ${endDate}`)

		const indexExists = await this.indexExists(index)
		if (!indexExists) {
			console.log(`Index ${index} does not exist`)
			return []
		}

		const query: any = {
			size: 0, // We only need aggregations
			query: {
				bool: {
					must: [{ term: { "accountId.keyword": accountId } }],
					...(startDate && endDate ? { filter: [{ range: { occurredAt: { gte: startDate, lte: endDate } } }] } : {}),
				},
			},
			aggregations: {
				activities_per_day: {
					date_histogram: { 
						field: "occurredAt", 
						calendar_interval: "day", 
						min_doc_count: 0, // Fills missing days with zero counts
						extended_bounds: {
						  min: startDate, // Start date of the range
						  max: endDate // End date of the range
						} },
				},
			},
		}

		let response = await client.search({
			index: index,
			body: query,
		})

		const heatmap: TaskExecutionHeatmap[] = WorkflowRunMapper.parseHistogram(response.body as OpenSearchHeatmapResponse)

		return heatmap
	}

    
    
}
