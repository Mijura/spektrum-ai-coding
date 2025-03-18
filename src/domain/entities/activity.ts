enum ActivityType {
    COMMENT = "COMMENT",
    BUILD = "BUILD",
    DEPLOY_ON_PRODUCTION = "DEPLOY_ON_PRODUCTION",
}

enum ActivityStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
}

export interface CommentActivityData {
    content: string // Comment content
  }
  
  export interface BuildActivityData {
    buildId: string
    status: "SUCCESS" | "FAILURE"
    duration: number
  }
  
  export interface DeploymentActivityData {
    deploymentId: string
    environment: string
    version: string
  }

export class Activity<T> {
    public readonly id: string
    public date: string
    public assignee: string
    public type: ActivityType
    public status: ActivityStatus
    public projectId: string
    public ticketId: string
    public data: T // Extra fields for each activity type
  
    constructor(
      id: string,
      date: string,
      assignee: string,
      type: ActivityType,
      status: ActivityStatus,
      projectId: string,
      ticketId: string,
      data: T
    ) {
      this.id = id
      this.date = date
      this.assignee = assignee
      this.type = type 
      this.status = status
      this.projectId = projectId
      this.ticketId = ticketId
      this.data = data
    }
  }
  