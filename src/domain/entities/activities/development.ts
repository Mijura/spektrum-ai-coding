import { Activity, ActivityType } from "./activity"

export enum DevelopmentStatus {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
}

export interface DevelopmentActivityData {
    status: DevelopmentStatus
}

export class Development extends Activity<DevelopmentActivityData> {
    private constructor(
        id: string,
        date: string,
        assignee: string,
        projectId: string,
        ticketId: string,
        data: DevelopmentActivityData
    ) {
        super(id, date, assignee, ActivityType.DEVELOPMENT, projectId, ticketId, data)
    }

    static create(id: string, date: string, assignee: string, projectId: string, ticketId: string, status: DevelopmentStatus): Development {
        const data: DevelopmentActivityData = {
            status: status
        }
        return new Development(id, date, assignee, projectId, ticketId, data)
    }
}