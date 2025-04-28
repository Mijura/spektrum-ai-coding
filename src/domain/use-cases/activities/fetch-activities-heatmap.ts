import { Activity } from "@domain/entities/activity";
import { ActivityMetadata, TimeRangeData } from "@domain/types/activity";

export interface FetchActivitiesHeatmap {
    execute(userId: string, timeRange: TimeRangeData): Promise<Activity<ActivityMetadata>[]>
}