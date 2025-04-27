import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { Issue } from "@domain/entities/issue"
import { IssueRecord } from "@infrastructure/records/issue"
import { IssueMapper } from "@infrastructure/mappers/issue-mapper"

const client = new DynamoDBClient({
	region: process.env.AWS_REGION,
	profile: process.env.AWS_PROFILE,
})
const ddbDocClient = DynamoDBDocumentClient.from(client)

export class DynamoDBIssueRepository implements IssueRepository {


	async save(issue: Issue): Promise<Issue> {
		const tableName = process.env.ISSUE_TABLE

		console.log(`Saving issue with ${issue.id} to dynamodb table ${tableName}.`)

		const issueRecord: IssueRecord = IssueMapper.toRecord(issue)

		const params = {
			TableName: tableName,
			Item: issueRecord,
		}

		await ddbDocClient.send(new PutCommand(params))

		return issue
	}

	async findById(id: string): Promise<Issue | null> {
		const tableName = process.env.ISSUE_TABLE

		console.log(`Fetching issue with id ${id} from dynamodb table ${tableName}.`)
		const params = {
			TableName: tableName,
			Key: { id },
		}

		const { Item: item } = await ddbDocClient.send(new GetCommand(params))

		if (!item) throw new Error(`Issue not found!`)

		const issueRecord: IssueRecord = item as IssueRecord

		return IssueMapper.toDomain(issueRecord)
	}

	async findAll(projectId: string): Promise<Issue[]> {

		const tableName = process.env.ISSUE_TABLE

		console.log(`Fetching all issues for project with ${projectId} from dynamodb table ${tableName}.`)
		const params = {
			KeyConditionExpression: "projectId = :projectId",
			IndexName: "projectGSI",
			ExpressionAttributeValues: {
				":projectId": projectId
			},
			TableName: tableName,
		}
	
		const data = await ddbDocClient.send(new QueryCommand(params))
		const items = data.Items as IssueRecord[]
	
		return IssueMapper.toDomains(items)
	}
}