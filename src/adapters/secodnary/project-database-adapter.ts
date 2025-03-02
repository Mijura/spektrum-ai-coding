
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { ProjectDto } from "@dto/project"
const client = new DynamoDBClient({})
const ddbDocClient = DynamoDBDocumentClient.from(client)

const tableName = process.env.PROJECT_TABLE

export async function putProjectConfig(projectConfig: ProjectDto): Promise<void> {
	const params = {
		TableName: tableName,
		Item: projectConfig,
	}

	await ddbDocClient.send(new PutCommand(params))
}