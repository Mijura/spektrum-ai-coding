function issueUpdated(target: Object, propertyKey: string | Symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = function(...args: any[]) {
        const result = originalMethod.apply(this)


    }
}