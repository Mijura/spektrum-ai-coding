import { Activity, ActivityType } from "./activity"

export enum BuildStatus {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
}

export interface BuildActivityData {
    status: BuildStatus
}

export class Build extends Activity<BuildActivityData> {
    private constructor(
        id: string,
        date: string,
        assignee: string,
        projectId: string,
        ticketId: string,
        data: BuildActivityData
    ) {
        super(id, date, assignee, ActivityType.COMMENT, projectId, ticketId, data)
    }

    static create(id: string, date: string, assignee: string, projectId: string, ticketId: string, status: BuildStatus): Build {
        const data: BuildActivityData = {
            status: status
        }
        return new Build(id, date, assignee, projectId, ticketId, data)
    }
}