export enum ActivityType {
    COMMENT = "COMMENT",
    BUILD = "BUILD",
    DEPLOY_TO_PRODUCTION = "DEPLOY_TO_PRODUCTION",
}

export class Activity<T> {
    public readonly id: string
    public date: string
    public assignee: string
    public type: ActivityType
    public projectId: string
    public ticketId: string
    public data: T // Extra fields for each activity type
  
    constructor(
      id: string,
      date: string,
      assignee: string,
      type: ActivityType,
      projectId: string,
      ticketId: string,
      data: T
    ) {
      this.id = id
      this.date = date
      this.assignee = assignee
      this.type = type 
      this.projectId = projectId
      this.ticketId = ticketId
      this.data = data
    }
  }
  