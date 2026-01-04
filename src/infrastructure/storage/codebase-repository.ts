import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { CodebaseRepositoryPort } from "@application/ports/outbound/codebase-repository"
import { Codebase } from "@domain/codebase"
import { CodebaseMapper } from "@infrastructure/mappers/codebase-mapper"
import { CodebaseRecord } from "@infrastructure/records/codebase"

const client = new DynamoDBClient()
const ddbDocClient = DynamoDBDocumentClient.from(client)

export class DynamoDBCodebaseRepository implements CodebaseRepositoryPort {
	async save(codebase: Codebase): Promise<void> {
		const tableName = process.env.CODEBASE_TABLE

		console.log(`Saving codebase with projectId ${codebase.projectId} to dynamodb table ${tableName}.`)

		const codebaseRecord: CodebaseRecord = CodebaseMapper.toRecord(codebase)

		const params = {
			TableName: tableName,
			Item: codebaseRecord,
		}

		await ddbDocClient.send(new PutCommand(params))
	}

	async get(projectId: string): Promise<Codebase> {
		const tableName = process.env.CODEBASE_TABLE

		console.log(`Fetching codebase with projectId ${projectId} from dynamodb table ${tableName}.`)
		const params = {
			TableName: tableName,
			Key: { projectId: projectId },
		}

		const { Item: item } = await ddbDocClient.send(new GetCommand(params))

		if (!item) throw new Error(`Codebase not found!`)

		const codebaseRecord: CodebaseRecord = item as CodebaseRecord

		return CodebaseMapper.toDomain(codebaseRecord)
	}
}
