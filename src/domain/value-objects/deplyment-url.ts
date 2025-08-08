export class DeploymentUrl {
    constructor(public readonly value: string) {}
  
    static generate(projectId: string): DeploymentUrl {
      return new DeploymentUrl(`${projectId}-${crypto.randomUUID()}.jigjoy.io`);
    }
  }