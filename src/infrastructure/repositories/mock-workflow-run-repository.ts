import { WorkflowRun } from "@domain/entities/workflow-run"
import { WorkflowRunRepository } from "@domain/repositories/workflow-run-repository"
import { PaginationData } from "@domain/types/activity"
import { TimeRangeData, WorkflowRunHeatmap } from "@domain/types/workflow"

export class MockWorkflowRunRepository implements WorkflowRunRepository {
    private workflowRuns: Map<string, WorkflowRun> = new Map()

    async save(workflowRun: WorkflowRun): Promise<WorkflowRun> {
        if (!workflowRun.id) {
            throw new Error("workflowRun.id is required for saving. Missing ID may cause unintended document creation.")
        }

        // Store the workflow run in the hash map
        this.workflowRuns.set(workflowRun.id, workflowRun)
        
        console.log(`Mock: Saved workflow run with id: ${workflowRun.id}`)
        return workflowRun
    }

    async get(workflowRunId: string): Promise<WorkflowRun | null> {
        console.log(`Mock: Fetching workflow run by id: ${workflowRunId}`)
        
        const workflowRun = this.workflowRuns.get(workflowRunId)
        return workflowRun || null
    }

    async getTimelineByProjectId(projectId: string, pagination: PaginationData): Promise<WorkflowRun[]> {
        console.log(`Mock: Fetching workflow run timeline for projectId: ${projectId} with pagination: ${JSON.stringify(pagination)}`)
        
        // Filter workflow runs by projectId
        const projectWorkflowRuns = Array.from(this.workflowRuns.values())
            .filter(run => run.projectId === projectId)
            .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())

        // Apply pagination
        const from = (pagination.pageNumber - 1) * pagination.pageSize
        const to = from + pagination.pageSize
        
        return projectWorkflowRuns.slice(from, to)
    }

    async getTimelineByAccountId(accountId: string, pagination: PaginationData): Promise<WorkflowRun[]> {
        console.log(`Mock: Fetching workflow run timeline for accountId: ${accountId} with pagination: ${JSON.stringify(pagination)}`)
        
        // Filter workflow runs by accountId
        const accountWorkflowRuns = Array.from(this.workflowRuns.values())
            .filter(run => run.accountId === accountId)
            .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())

        // Apply pagination
        const from = (pagination.pageNumber - 1) * pagination.pageSize
        const to = from + pagination.pageSize
        
        return accountWorkflowRuns.slice(from, to)
    }

    async getHeatmap(accountId: string, timeRange: TimeRangeData): Promise<WorkflowRunHeatmap[]> {
        console.log(`Mock: Searching for heatmap data for accountId: ${accountId}, startDate: ${timeRange.startDate}, endDate: ${timeRange.endDate}`)
        
        const startDate = new Date(timeRange.startDate)
        const endDate = new Date(timeRange.endDate)
        
        // Filter workflow runs by accountId and date range
        const filteredRuns = Array.from(this.workflowRuns.values())
            .filter(run => {
                if (run.accountId !== accountId) return false
                
                const runDate = new Date(run.occurredAt)
                return runDate >= startDate && runDate <= endDate
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
        filteredRuns.forEach(run => {
            const dateKey = new Date(run.occurredAt).toISOString().split('T')[0]
            const currentCount = runsByDate.get(dateKey) || 0
            runsByDate.set(dateKey, currentCount + 1)
        })
        
        // Convert to WorkflowRunHeatmap format
        const heatmap: WorkflowRunHeatmap[] = Array.from(runsByDate.entries())
            .map(([date, runCount]) => ({
                date,
                runCount
            }))
            .sort((a, b) => a.date.localeCompare(b.date))
        
        return heatmap
    }

    // Helper methods for testing and debugging
    clear(): void {
        this.workflowRuns.clear()
        console.log("Mock: Cleared all workflow runs")
    }

    getAll(): WorkflowRun[] {
        return Array.from(this.workflowRuns.values())
    }

    getCount(): number {
        return this.workflowRuns.size
    }

    // Method to seed with test data
    seedWithTestData(testWorkflowRuns: WorkflowRun[]): void {
        testWorkflowRuns.forEach(run => {
            this.workflowRuns.set(run.id, run)
        })
        console.log(`Mock: Seeded with ${testWorkflowRuns.length} test workflow runs`)
    }
} 