import { TaskExecution } from "@domain/entities/task-execution"
import { TaskExecutionRepository } from "@domain/repositories/task-execution-repository"
import { PaginationData } from "@domain/types/activity"
import { TimeRangeData, TaskExecutionHeatmap } from "@domain/types/task-execution"

export class MockTaskExecutionRepository implements TaskExecutionRepository {
    private taskExecutions: Map<string, TaskExecution> = new Map()

    async save(taskExecution: TaskExecution): Promise<TaskExecution> {
        if (!taskExecution.id) {
            throw new Error("taskExecution.id is required for saving. Missing ID may cause unintended document creation.")
        }

        // Store the task execution in the hash map
        this.taskExecutions.set(taskExecution.id, taskExecution)
        
        console.log(`Mock: Saved task execution with id: ${taskExecution.id}`)
        return taskExecution
    }

    async get(taskExecutionId: string): Promise<TaskExecution | null> {
        console.log(`Mock: Fetching task execution by id: ${taskExecutionId}`)
        
        const taskExecution = this.taskExecutions.get(taskExecutionId)
        return taskExecution || null
    }

    async getTimelineByProjectId(projectId: string, pagination: PaginationData): Promise<TaskExecution[]> {
        console.log(`Mock: Fetching task execution timeline for projectId: ${projectId} with pagination: ${JSON.stringify(pagination)}`)
        
        // Filter task executions by projectId
        const projectTaskExecutions = Array.from(this.taskExecutions.values())
            .filter(execution => execution.projectId === projectId)
            .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())

        // Apply pagination
        const from = (pagination.pageNumber - 1) * pagination.pageSize
        const to = from + pagination.pageSize
        
        return projectTaskExecutions.slice(from, to)
    }

    async getTimelineByAccountId(accountId: string, pagination: PaginationData): Promise<TaskExecution[]> {
        console.log(`Mock: Fetching task execution timeline for accountId: ${accountId} with pagination: ${JSON.stringify(pagination)}`)
        
        // Filter task executions by accountId
        const accountTaskExecutions = Array.from(this.taskExecutions.values())
            .filter(execution => execution.accountId === accountId)
            .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())

        // Apply pagination
        const from = (pagination.pageNumber - 1) * pagination.pageSize
        const to = from + pagination.pageSize
        
        return accountTaskExecutions.slice(from, to)
    }

    async getHeatmap(accountId: string, timeRange: TimeRangeData): Promise<TaskExecutionHeatmap[]> {
        console.log(`Mock: Searching for heatmap data for accountId: ${accountId}, startDate: ${timeRange.startDate}, endDate: ${timeRange.endDate}`)
        
        const startDate = new Date(timeRange.startDate)
        const endDate = new Date(timeRange.endDate)
        
        // Filter task executions by accountId and date range
        const filteredExecutions = Array.from(this.taskExecutions.values())
            .filter(execution => {
                if (execution.accountId !== accountId) return false
                
                const executionDate = new Date(execution.occurredAt)
                return executionDate >= startDate && executionDate <= endDate
            })

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
        filteredExecutions.forEach(execution => {
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

    // Helper methods for testing and debugging
    clear(): void {
        this.taskExecutions.clear()
        console.log("Mock: Cleared all task executions")
    }

    getAll(): TaskExecution[] {
        return Array.from(this.taskExecutions.values())
    }

    getCount(): number {
        return this.taskExecutions.size
    }

    // Method to seed with test data
    seedWithTestData(testTaskExecutions: TaskExecution[]): void {
        testTaskExecutions.forEach(execution => {
            this.taskExecutions.set(execution.id, execution)
        })
        console.log(`Mock: Seeded with ${testTaskExecutions.length} test task executions`)
    }
} 