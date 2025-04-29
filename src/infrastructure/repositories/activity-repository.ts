import { WorkflowRun } from "@domain/entities/activities/workflow-run"
import { Activity } from "@domain/entities/activity"
import { ActivityRepository } from "@domain/repositories/activity-repository"
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws"
import { defaultProvider } from "@aws-sdk/credential-provider-node"
import { Client } from "@opensearch-project/opensearch"
import { ActivityData, ActivityMetadata, ActivityType, DefaultPagination, PaginationData, TimeRangeData } from "@domain/types/activity"
import { ActivityMapper } from "@infrastructure/mappers/activity-mapper"

export class OpenSearchActivityRepository implements ActivityRepository {


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

    async save(activity: Activity<ActivityMetadata>): Promise<Activity<ActivityMetadata>> {
		const index = this.getIndex()

        const client = this.getClient()

		console.log(`Saving activity: ${JSON.stringify(activity)}`)
		
		// create index if it doesn't already exist
		if (!(await client.indices.exists({ index })).body) {

            const createIndexResponse = await client.indices.create({
                index,
            })

			console.log(createIndexResponse.body)
		}

		const response = await client.index({
			id: `${activity.occurredAt}-${activity.userId}`,
			index,
			body: activity,
		})

		console.log(`Saved activity: ${JSON.stringify(response.body)}`)

        if(response.statusCode !== 201) {
            throw new Error(`Failed to save activity: ${JSON.stringify(response)}`)
        }

		return response.body as unknown as Activity<ActivityMetadata>
    }

    async findById(id: string): Promise<Activity<ActivityMetadata> | null> {
		const index = this.getIndex()

		const client = this.getClient()

		console.log(`Fetching activity by id: ${id}`)


		let response = await client.get({
			index: index,
			id: id,
		})
		
		console.log(`Found activity: ${JSON.stringify(response.body)}`)
		const activityData = response.body as unknown as ActivityData

		if (!activityData) {
			return null
		}

		return ActivityMapper.toDomain(activityData)
    }

	async fetchIssueActivities(issueId: string): Promise<Activity<ActivityMetadata>[]> {
		const index = this.getIndex()

		const client = this.getClient()

		console.log(`Fetching issue activities for issueId: ${issueId}`)

		const query: any = {
			query: {
				bool: {
					must: [{ term: { "issueId.keyword": issueId } }],
				},
			},
			sort: [{ occurredAt: "desc" }],
		}

		let response = await client.search({
			index: index,
			body: query,
		})
		console.log("Search results:")
		console.log(JSON.stringify(response.body.hits, null, "  "))
		console.log("\n")

		return response.body.hits.hits.map((hit: any) => hit._source) as Activity<ActivityMetadata>[]
	}

	async fetchActivitiesHeatmap(userId: string, timeRange: TimeRangeData): Promise<Activity<ActivityMetadata>[]> {
		throw new Error("Method not implemented.")
	}

	async fetchWorkflowRunTimeline(projectId: string, pagination: PaginationData = DefaultPagination): Promise<WorkflowRun[]> {
		const index = this.getIndex()

		const client = this.getClient()
		const from = (pagination.pageNumber - 1) * pagination.pageSize

		console.log(`Fetching workflow run timeline for projectId: ${projectId} with pagination: ${JSON.stringify(pagination)}`)

		const query: any = {
			size: pagination.pageSize,
			from,
			query: {
				bool: {
					must: [{ term: { "projectId.keyword": projectId } }, { term: { "type.keyword": ActivityType.WORKFLOW_RUN } }],
				},
			},
			sort: [{ occurredAt: "desc" }],
		}

		let response = await client.search({
			index: index,
			body: query,
		})
		console.log("Search results:")
		console.log(JSON.stringify(response.body.hits, null, "  "))
		console.log("\n")


		return response.body.hits.hits.map((hit: any) => hit._source) as WorkflowRun[]
	}
    
    
}
