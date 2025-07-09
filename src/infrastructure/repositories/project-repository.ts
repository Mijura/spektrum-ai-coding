
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { Project, ProjectStatus } from "@domain/entities/project"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { ProjectMapper } from "@infrastructure/mappers/project-mapper"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { ProjectRecord } from "@infrastructure/records/project"

const client = new DynamoDBClient({
	region: process.env.AWS_REGION,
	profile: process.env.AWS_PROFILE,
})
const ddbDocClient = DynamoDBDocumentClient.from(client)

export class DynamoDBProjectRepository implements ProjectRepository {

	async save(project: Project): Promise<Project> {
		const tableName = process.env.PROJECT_TABLE

		console.log(`Saving project with ${project.id} to dynamodb table ${tableName}.`)

		const projectRecord: ProjectRecord = ProjectMapper.toRecord(project)

		const params = {
			TableName: tableName,
			Item: projectRecord,
		}

		await ddbDocClient.send(new PutCommand(params))

		return project
	}

	async get(projectId: string): Promise<Project> {
		const tableName = process.env.PROJECT_TABLE

		console.log(`Fetching project with ${projectId} from dynamodb table ${tableName}.`)
		const params = {
			TableName: tableName,
			Key: { id: projectId },
		}

		const { Item: item } = await ddbDocClient.send(new GetCommand(params))

		if (!item) throw new Error(`Project not found!`)

		const projectRecord: ProjectRecord = item as ProjectRecord

		return ProjectMapper.toDomain(projectRecord)
	}

	async queryAllPages(queryParams: any, ddbDocClient: any): Promise<any[]> {
		let allItems: any[] = []
		let lastEvaluatedKey

		do {
			const result: any = await ddbDocClient.send(new QueryCommand({
			...queryParams,
			ExclusiveStartKey: lastEvaluatedKey,
			}))

			allItems = allItems.concat(result.Items || [])
			lastEvaluatedKey = result.LastEvaluatedKey
		} while (lastEvaluatedKey)

		return allItems
	}

	async getAll(ownerId: string): Promise<Project[]> {

		const tableName = process.env.PROJECT_TABLE

		const params = {
			KeyConditionExpression: "ownerId = :ownerId",
			IndexName: "ownerGSI",
			ExpressionAttributeValues: {
				":ownerId": ownerId,
			},
			TableName: tableName,
		}
	  
		const items = await this.queryAllPages(params, ddbDocClient)
	
		return ProjectMapper.toDomains(items)
	}



	async getAllByStatus(ownerId: string, status: ProjectStatus): Promise<Project[]> {
		const tableName = process.env.PROJECT_TABLE;
	  
		const params = {
		  KeyConditionExpression: "ownerId = :ownerId and #status = :status",  // Use #status to avoid conflict with reserved word
		  IndexName: "ownerStatusGSI", // Use the GSI that indexes by ownerId and status
		  ExpressionAttributeNames: {
			"#status": "status"
		  },
		  ExpressionAttributeValues: {
			":ownerId": ownerId, 
			":status": status,  
		  },
		  TableName: tableName,
		}
	  
		const items = await this.queryAllPages(params, ddbDocClient)

		console.log(`Found ${items.length} projects with status ${status} for owner ${ownerId}.`)
	  
		return ProjectMapper.toDomains(items)
	  }
	  
}