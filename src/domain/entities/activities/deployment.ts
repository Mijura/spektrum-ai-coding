import { Activity, ActivityType } from "./activity"

export enum DeploymentStatus {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
}

export interface DeploymentActivityData {
    status: DeploymentStatus
}

export class Deployment extends Activity<DeploymentActivityData> {
    private constructor(
        id: string,
        date: string,
        assignee: string,
        projectId: string,
        ticketId: string,
        data: DeploymentActivityData
    ) {
        super(id, date, assignee, ActivityType.DEPLOY_TO_PRODUCTION, projectId, ticketId, data)
    }

    static create(id: string, date: string, assignee: string, projectId: string, ticketId: string, status: DeploymentStatus): Deployment {
        const data: DeploymentActivityData = {
            status: status
        }
        return new Deployment(id, date, assignee, projectId, ticketId, data)
    }
}