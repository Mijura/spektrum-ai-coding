import { eventBus } from "@domain/services/event-bus";

export function EmitIssueUpdate() {
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
        const worker = args[0]; // Assume user is always first argument
        eventBus.emit("issue:update", {
          node: worker,
          issue: this
        });
        return res;
      });
    };

    return descriptor;
  };
}
