
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { ProjectDto } from "@dto/project"

const client = new DynamoDBClient({
	region: process.env.AWS_REGION,
	profile: process.env.AWS_PROFILE
})
const ddbDocClient = DynamoDBDocumentClient.from(client)

export async function saveProject(project: ProjectDto): Promise<void> {

	const tableName = process.env.PROJECT_TABLE

	const params = {
		TableName: tableName,
		Item: project,
	}

	await ddbDocClient.send(new PutCommand(params))
}