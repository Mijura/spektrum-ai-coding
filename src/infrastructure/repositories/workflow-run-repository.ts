import { Activity } from "@domain/entities/activity"
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws"
import { defaultProvider } from "@aws-sdk/credential-provider-node"
import { Client } from "@opensearch-project/opensearch"
import { ActivityMetadata, PaginationData, TimeRangeData } from "@domain/types/activity"
import { WorkflowRun } from "@domain/entities/workflow/workflow-run"
import { WorkflowRunRepository } from "@domain/repositories/workflow-run-repository"
import { v4 as uuidv4 } from 'uuid'

export class OpenSearchWorkflowRunRepository implements WorkflowRunRepository {

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

    async save(workflowRun: WorkflowRun): Promise<WorkflowRun> {
		const index = this.getIndex()

        const client = this.getClient()

		console.log(`Saving workflow run: ${JSON.stringify(workflowRun)}`)
		
		// create index if it doesn't already exist
		if (!(await client.indices.exists({ index })).body) {

            const createIndexResponse = await client.indices.create({
                index,
            })

			console.log(createIndexResponse.body)
		}

		const response = await client.index({
			id: uuidv4(),
			index,
			body: workflowRun,
		})

        if(response.statusCode !== 201) {
            throw new Error(`Failed to save activity: ${JSON.stringify(response)}`)
        }

		return response.body as unknown as WorkflowRun
    }

    async findById(id: string): Promise<WorkflowRun | null> {
		const index = this.getIndex()

		const client = this.getClient()

		console.log(`Fetching workflow run by id: ${id}`)


		let response = await client.get({
			index: index,
			id: id,
		})

		return response.body as unknown as WorkflowRun
    }

	async getTimeline(projectId: string, pagination: PaginationData): Promise<WorkflowRun[]> {
		const index = this.getIndex()

		const client = this.getClient()
		const from = (pagination.pageNumber - 1) * pagination.pageSize

		console.log(`Fetching workflow run timeline for projectId: ${projectId} with pagination: ${JSON.stringify(pagination)}`)

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


		return response.body.hits.hits.map((hit: any) => hit._source) as WorkflowRun[]
	}
    
    
}
