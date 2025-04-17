export enum ActorType {
    HUMAN = "HUMAN",
    AI = "AI"
}
export abstract class Actor {
    abstract type: ActorType
    abstract name: string
}

export class Human extends Actor {

    type: ActorType.HUMAN
    name: string

    constructor(name: string) {
        super()
        this.type = ActorType.HUMAN
        this.name = name
    }

}

export class AIWorker extends Actor {
  type: ActorType.AI
  name: string

  constructor(name: string) {
        super()
        this.type = ActorType.AI
        this.name = name
  }

}