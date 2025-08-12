import { TaskExecution } from "@domain/entities/task-execution"
import { TaskExecutionRecord } from "@infrastructure/records/task-execution"
import { TaskExecutionHeatmap } from "@domain/value-objects/task-execution"

export type HeatmapBucket = {
    key_as_string: string // ISO date string
    key: number // Timestamp in milliseconds
    doc_count: number
  };
  
  export type OpenSearchHeatmapResponse = {
    aggregations?: {
      activities_per_day: {
        buckets: HeatmapBucket[]
      }
    }
  }

export class TaskExecutionMapper {

    static toRecord(taskExecution: TaskExecution): TaskExecutionRecord {
        return {
            id: taskExecution.id,
            title: taskExecution.title,
            projectId: taskExecution.projectId,
            taskId: taskExecution.taskId,
            accountId: taskExecution.accountId,
            status: taskExecution.status,
            occurredAt: taskExecution.occurredAt,
            error: taskExecution.error
        }
    }

    static toDomain(record: TaskExecutionRecord): TaskExecution {
        return new TaskExecution(
            record.id,
            record.title,
            record.projectId,
            record.taskId,
            record.accountId,
            record.status,
            record.occurredAt,
            record.error
        )
    }

    static toDomains(records: TaskExecutionRecord[]): TaskExecution[] {
        return records.map(record => this.toDomain(record))
    }
	
	// Formats timestamp as "Dec 14, 2024"
    static formatDate(timestamp: number): string {
        return new Intl.DateTimeFormat("en-US", { 
          month: "short", day: "2-digit", year: "numeric" 
        }).format(new Date(timestamp))
      }
    
      // Parses OpenSearch histogram response
      static parseHistogram(response: OpenSearchHeatmapResponse): TaskExecutionHeatmap[] {
        return response?.aggregations?.activities_per_day?.buckets.map(bucket => ({
          date: TaskExecutionMapper.formatDate(bucket.key),
          runCount: bucket.doc_count,
        })) || []
      }

}
