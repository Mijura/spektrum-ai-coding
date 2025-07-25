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
