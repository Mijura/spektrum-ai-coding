export enum ActivityInitiatorType {
    HUMAN = "HUMAN",
    AI = "AI"
}
export abstract class ActivityInitiator {
    abstract type: ActivityInitiatorType
    abstract name: string
}

export class Human extends ActivityInitiator {

    type: ActivityInitiatorType.HUMAN
    name: string

    constructor(name: string) {
        super()
        this.type = ActivityInitiatorType.HUMAN
        this.name = name
    }

}

export class AIWorker extends ActivityInitiator {
  type: ActivityInitiatorType.AI
  name: string

  constructor(name: string) {
        super()
        this.type = ActivityInitiatorType.AI
        this.name = name
  }

}