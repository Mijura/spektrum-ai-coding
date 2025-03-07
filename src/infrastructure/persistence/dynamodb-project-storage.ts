import { ProjectStorage } from "@domain/ports/outbound/project-storage"

import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { Project } from "@domain/entities/project-details"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { ProjectDto } from "src/application/dto/project"

// DynamoDB client setup
const client = new DynamoDBClient({
	region: process.env.AWS_REGION,
	profile: process.env.AWS_PROFILE,
})
const ddbDocClient = DynamoDBDocumentClient.from(client)

export class DynamoDBProjectStorage implements ProjectStorage {
	private tableName = process.env.PROJECT_TABLE

	async save(project: Project): Promise<void> {
		const projectDto: ProjectDto = {
			id: project.id,
		}

		const params = {
			TableName: this.tableName,
			Item: projectDto,
		}

		await ddbDocClient.send(new PutCommand(params))
	}

	async findById(id: string): Promise<Project | null> {
		const params = {
			TableName: this.tableName,
			Key: { id },
		}

		const { Item: item } = await ddbDocClient.send(new GetCommand(params))

		if (!item) return null

		// Convert ProjectDto back into a Project entity
		return new Project(item.id)
	}
}
