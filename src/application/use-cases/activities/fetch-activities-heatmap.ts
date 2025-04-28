import { Activity } from "@domain/entities/activity"
import { ActivityRepository } from "@domain/repositories/activity-repository"
import { ActivityMetadata, TimeRangeData } from "@domain/types/activity"
import { FetchActivitiesHeatmap } from "@domain/use-cases/activities/fetch-activities-heatmap"

export class FetchActivitiesHeatmapUseCase implements FetchActivitiesHeatmap {
    constructor(private readonly activityRepository: ActivityRepository) {}

    async execute(userId: string, timeRange: TimeRangeData): Promise<Activity<ActivityMetadata>[]> {
        return this.activityRepository.fetchActivitiesHeatmap(userId, timeRange)
    }
}