import { WorkflowRun } from "@domain/entities/activities/workflow-run"
import { Activity } from "@domain/entities/activity"
import { ActivityRepository } from "@domain/repositories/activity-repository"
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws"
import { defaultProvider } from "@aws-sdk/credential-provider-node"
import { Client } from "@opensearch-project/opensearch"
import { ActivityData, ActivityMetadata, ActivityType } from "@domain/types/activity"

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

    private activities: Activity<ActivityMetadata>[] = []	

    async save(activity: Activity<ActivityMetadata>): Promise<Activity<ActivityMetadata>> {
		const index = process.env.OPENSEARCH_COLLECTION || "activities"
        const client = this.getClient()

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

		console.log(`response: ${JSON.stringify(response)}`)

        if(response.statusCode !== 200) {
            throw new Error(`Failed to save activity: ${JSON.stringify(response)}`)
        }

		return response.body as unknown as ActivityData
    }

    async findById(id: string): Promise<Activity<ActivityMetadata> | null> {
        return this.activities.find(activity => activity.id === id) ?? null
    }

    async findAllByIssueId(issueId: string): Promise<Activity<ActivityMetadata>[]> {
        return this.activities.filter(activity => activity.issueId === issueId)
    }   

    async findAllByIssueIdAndWorkflowRun(issueId: string): Promise<WorkflowRun[]> {
        const workflowRuns = this.activities.filter(activity => activity.issueId === issueId && activity.type === ActivityType.WORKFLOW_RUN)
        return workflowRuns as WorkflowRun[]
    }
    
    
}
