import { ProjectStorage } from "@domain/persistence/project-storage"
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { ProjectDetails } from "@domain/model/project-details"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { ProjectDetailsDto } from "src/application/dto/project"

// DynamoDB client setup
const client = new DynamoDBClient({
	region: process.env.AWS_REGION,
	profile: process.env.AWS_PROFILE,
})
const ddbDocClient = DynamoDBDocumentClient.from(client)

export class DynamoDBProjectStorage implements ProjectStorage {


	async save(project: ProjectDetails): Promise<ProjectDetails> {

		const tableName = process.env.PROJECT_TABLE
		const projectDetailsDto: ProjectDetailsDto = {
			id: project.id,
		}

		const params = {
			TableName: tableName,
			Item: projectDetailsDto,
		}

		await ddbDocClient.send(new PutCommand(params))

		return new ProjectDetails(projectDetailsDto.id)
	}

	async findById(id: string): Promise<ProjectDetails | null> {
		const tableName = process.env.PROJECT_TABLE
		const params = {
			TableName: tableName,
			Key: { id },
		}

		const { Item: item } = await ddbDocClient.send(new GetCommand(params))

		if (!item) return null

		// Convert ProjectDto back into a Project entity
		return new ProjectDetails(item.id)
	}
}
