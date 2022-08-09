/**
 * For *onTick() action only, to specify to tick interval in second.
 */
export function Interval(second) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.tickInterval = second;
        return descriptor;
    };
}
//# sourceMappingURL=Interval.js.map