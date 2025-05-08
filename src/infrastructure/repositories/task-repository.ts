import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { TaskRepository } from "@domain/repositories/task-repository"
import { Task } from "@domain/entities/task"
import { TaskRecord } from "@infrastructure/records/task"
import { TaskMapper } from "@infrastructure/mappers/task-mapper"

const client = new DynamoDBClient({
	region: process.env.AWS_REGION,
	profile: process.env.AWS_PROFILE,
})
const ddbDocClient = DynamoDBDocumentClient.from(client)

export class DynamoDBTaskRepository implements TaskRepository {


	async save(task: Task): Promise<Task> {
		const tableName = process.env.TASK_TABLE

		console.log(`Saving task with ${task.id} to dynamodb table ${tableName}.`)

		const taskRecord: TaskRecord = TaskMapper.toRecord(task)

		const params = {
			TableName: tableName,
			Item: taskRecord,
		}

		await ddbDocClient.send(new PutCommand(params))

		return task
	}

	async findById(id: string): Promise<Task | null> {
		const tableName = process.env.TASK_TABLE

		console.log(`Fetching task with id ${id} from dynamodb table ${tableName}.`)
		const params = {
			TableName: tableName,
			Key: { id },
		}

		const { Item: item } = await ddbDocClient.send(new GetCommand(params))

		if (!item) throw new Error(`Task not found!`)

		const taskRecord: TaskRecord = item as TaskRecord

		return TaskMapper.toDomain(taskRecord)
	}

	async findAll(projectId: string): Promise<Task[]> {

		const tableName = process.env.TASK_TABLE

		console.log(`Fetching all tasks for project with ${projectId} from dynamodb table ${tableName}.`)
		const params = {
			KeyConditionExpression: "projectId = :projectId",
			IndexName: "projectGSI",
			ExpressionAttributeValues: {
				":projectId": projectId
			},
			TableName: tableName,
		}
	
		const data = await ddbDocClient.send(new QueryCommand(params))
		const items = data.Items as TaskRecord[]
	
		return TaskMapper.toDomains(items)
	}
}