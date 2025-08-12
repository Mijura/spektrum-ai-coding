import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { TaskExecution } from "@domain/entities/task-execution"
import { TaskExecutionRepository } from "@domain/ports/repositories/task-execution-repository"
import { PaginationData } from "@domain/value-objects/activity"
import { TimeRangeData, TaskExecutionHeatmap } from "@domain/value-objects/task-execution"
import { TaskExecutionMapper } from "@infrastructure/mappers/task-execution-mapper"
import { TaskExecutionRecord } from "@infrastructure/records/task-execution"

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    profile: process.env.AWS_PROFILE,
})
const ddbDocClient = DynamoDBDocumentClient.from(client)

export class DynamoDBTaskExecutionRepository implements TaskExecutionRepository {
    async save(taskExecution: TaskExecution): Promise<TaskExecution> {
        if (!taskExecution.id) {
            throw new Error("taskExecution.id is required for saving. Missing ID may cause unintended document creation.")
        }

        const tableName = process.env.TASK_EXECUTION_TABLE
        console.log(`Saving task execution with id: ${taskExecution.id} to DynamoDB table ${tableName}`)

        const taskExecutionRecord: TaskExecutionRecord = TaskExecutionMapper.toRecord(taskExecution)

        const params = {
            TableName: tableName,
            Item: taskExecutionRecord,
        }

        await ddbDocClient.send(new PutCommand(params))
        return taskExecution
    }

    async get(taskExecutionId: string): Promise<TaskExecution | null> {
        const tableName = process.env.TASK_EXECUTION_TABLE
        console.log(`Fetching task execution by id: ${taskExecutionId} from DynamoDB table ${tableName}`)
        
        const params = {
            TableName: tableName,
            Key: { id: taskExecutionId },
        }

        const { Item: item } = await ddbDocClient.send(new GetCommand(params))

        if (!item) return null

        const taskExecutionRecord: TaskExecutionRecord = item as TaskExecutionRecord
        return TaskExecutionMapper.toDomain(taskExecutionRecord)
    }

    async getTimelineByProjectId(projectId: string, pagination: PaginationData): Promise<TaskExecution[]> {
        const tableName = process.env.TASK_EXECUTION_TABLE
        console.log(`Fetching task execution timeline for projectId: ${projectId} with pagination: ${JSON.stringify(pagination)}`)
        
        const params = {
            TableName: tableName,
            IndexName: "projectTimelineGSI",
            KeyConditionExpression: "projectId = :projectId",
            ExpressionAttributeValues: {
                ":projectId": projectId,
            },
            ScanIndexForward: false, // Sort in descending order (newest first)
            Limit: pagination.pageSize,
        }

        // If not first page, add ExclusiveStartKey for pagination
        if (pagination.pageNumber > 1) {
            // For simplicity, we'll implement basic pagination
            // In a production environment, you might want to use a more sophisticated approach
            console.warn("Pagination beyond first page not fully implemented for DynamoDB")
        }

        const result = await ddbDocClient.send(new QueryCommand(params))
        const taskExecutionRecords: TaskExecutionRecord[] = result.Items as TaskExecutionRecord[] || []
        
        return TaskExecutionMapper.toDomains(taskExecutionRecords)
    }

    async getTimelineByAccountId(accountId: string, pagination: PaginationData): Promise<TaskExecution[]> {
        const tableName = process.env.TASK_EXECUTION_TABLE
        console.log(`Fetching task execution timeline for accountId: ${accountId} with pagination: ${JSON.stringify(pagination)}`)
        
        const params = {
            TableName: tableName,
            IndexName: "accountTimelineGSI",
            KeyConditionExpression: "accountId = :accountId",
            ExpressionAttributeValues: {
                ":accountId": accountId,
            },
            ScanIndexForward: false, // Sort in descending order (newest first)
            Limit: pagination.pageSize,
        }

        // If not first page, add ExclusiveStartKey for pagination
        if (pagination.pageNumber > 1) {
            // For simplicity, we'll implement basic pagination
            // In a production environment, you might want to use a more sophisticated approach
            console.warn("Pagination beyond first page not fully implemented for DynamoDB")
        }

        const result = await ddbDocClient.send(new QueryCommand(params))
        const taskExecutionRecords: TaskExecutionRecord[] = result.Items as TaskExecutionRecord[] || []
        
        return TaskExecutionMapper.toDomains(taskExecutionRecords)
    }

    async getHeatmap(accountId: string, timeRange: TimeRangeData): Promise<TaskExecutionHeatmap[]> {
        const tableName = process.env.TASK_EXECUTION_TABLE
        console.log(`Searching for heatmap data for accountId: ${accountId}, startDate: ${timeRange.startDate}, endDate: ${timeRange.endDate}`)
        
        const startDate = new Date(timeRange.startDate)
        const endDate = new Date(timeRange.endDate)
        
        // Query DynamoDB for executions in the date range
        const params = {
            TableName: tableName,
            IndexName: "accountTimelineGSI",
            KeyConditionExpression: "accountId = :accountId AND occurredAt BETWEEN :startDate AND :endDate",
            ExpressionAttributeValues: {
                ":accountId": accountId,
                ":startDate": startDate.toISOString(),
                ":endDate": endDate.toISOString(),
            },
        }

        const result = await ddbDocClient.send(new QueryCommand(params))
        const taskExecutionRecords: TaskExecutionRecord[] = result.Items as TaskExecutionRecord[] || []

        // Group by date and count runs per day
        const runsByDate = new Map<string, number>()
        
        // Initialize all dates in range with 0
        const currentDate = new Date(startDate)
        while (currentDate <= endDate) {
            const dateKey = currentDate.toISOString().split('T')[0] // YYYY-MM-DD format
            runsByDate.set(dateKey, 0)
            currentDate.setDate(currentDate.getDate() + 1)
        }
        
        // Count actual runs
        taskExecutionRecords.forEach(execution => {
            const dateKey = new Date(execution.occurredAt).toISOString().split('T')[0]
            const currentCount = runsByDate.get(dateKey) || 0
            runsByDate.set(dateKey, currentCount + 1)
        })
        
        // Convert to TaskExecutionHeatmap format
        const heatmap: TaskExecutionHeatmap[] = Array.from(runsByDate.entries())
            .map(([date, runCount]) => ({
                date,
                runCount
            }))
            .sort((a, b) => a.date.localeCompare(b.date))
        
        return heatmap
    }
} 