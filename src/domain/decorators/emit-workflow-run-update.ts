import { eventBus } from "@domain/services/event-bus"

export function EmitWorkflowRunUpdate() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args);

      const maybePromise = result instanceof Promise ? result : Promise.resolve(result);

      return maybePromise.then((res) => {
        eventBus.emit("workflow-run:update", this);
        return res;
      });
    };

    return descriptor;
  };
}
