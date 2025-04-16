export enum ActivityInitiatorType {
    HUMAN = "HUMAN",
    AI = "AI"
}
export abstract class Actor {
    abstract type: ActivityInitiatorType
    abstract name: string
}

export class Human extends Actor {

    type: ActivityInitiatorType.HUMAN
    name: string

    constructor(name: string) {
        super()
        this.type = ActivityInitiatorType.HUMAN
        this.name = name
    }

}

export class AIWorker extends Actor {
  type: ActivityInitiatorType.AI
  name: string

  constructor(name: string) {
        super()
        this.type = ActivityInitiatorType.AI
        this.name = name
  }

}