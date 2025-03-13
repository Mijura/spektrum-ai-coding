import { ProjectStorage } from "@domain/persistence/project-storage"
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { Project } from "@domain/model/project"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { ProjectMapper } from "@domain/mappers/project-mapper"
import { MarshalledProject } from "@domain/mappers/types"

// DynamoDB client setup
const client = new DynamoDBClient({
	region: process.env.AWS_REGION,
	profile: process.env.AWS_PROFILE,
})
const ddbDocClient = DynamoDBDocumentClient.from(client)

export class DynamoDBProjectRepository implements ProjectStorage {
	async save(project: Project): Promise<Project> {
		const tableName = process.env.PROJECT_TABLE

		console.log(`User is trying to save project with ${project.id} to dynamodb table ${tableName}.`)

		const params = {
			TableName: tableName,
			Item: project,
		}

		await ddbDocClient.send(new PutCommand(params))

		return project
	}

	async findById(id: string): Promise<Project | null> {
		const tableName = process.env.PROJECT_TABLE

		console.log(`User is trying to fetch project with ${id} from dynamodb table ${tableName}.`)
		const params = {
			TableName: tableName,
			Key: { id },
		}

		const { Item: item } = await ddbDocClient.send(new GetCommand(params))

		if (!item) return null

		const restoredProject = ProjectMapper.unmarshal(item as MarshalledProject)

		return restoredProject
	}
}
