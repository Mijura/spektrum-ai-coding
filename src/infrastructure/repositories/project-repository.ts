
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

		console.log(`User is trying to save project with ${project.id} to dynamodb table ${tableName}.`)

		const projectRecord: ProjectRecord = ProjectMapper.toRecord(project)

		const params = {
			TableName: tableName,
			Item: projectRecord,
		}

		await ddbDocClient.send(new PutCommand(params))

		return project
	}

	async findById(id: string): Promise<Project> {
		const tableName = process.env.PROJECT_TABLE

		console.log(`User is trying to fetch project with ${id} from dynamodb table ${tableName}.`)
		const params = {
			TableName: tableName,
			Key: { id },
		}

		const { Item: item } = await ddbDocClient.send(new GetCommand(params))

		if (!item) throw new Error(`Project not found!`)

		const projectRecord: ProjectRecord = item as ProjectRecord

		return ProjectMapper.toDomain(projectRecord)
	}

	async findAll(ownerId: string): Promise<Project[]> {

		const tableName = process.env.PROJECT_TABLE

		const params = {
			KeyConditionExpression: "ownerId = :ownerId",
			IndexName: "ownerGSI",
			ExpressionAttributeValues: {
				":ownerId": ownerId,
			},
			TableName: tableName,
		}
	
		const data = await ddbDocClient.send(new QueryCommand(params))
		const items = data.Items as []
	
		return ProjectMapper.toDomains(items)
	}

	async findAllByStatus(ownerId: string, status: ProjectStatus): Promise<Project[]> {
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
		};
	  
		const data = await ddbDocClient.send(new QueryCommand(params));
		const items = data.Items as [];
	  
		return ProjectMapper.toDomains(items);
	  }
	  
}