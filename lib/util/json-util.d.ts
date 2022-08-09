/**
 * Data whose key matches any of the @maskedKeywords RegExp, will be serialized as mask.
 * Useful to serialize sensitive data, e.g. password.
 * Function & Symbol are also discarded in the serialization.
 */
export declare function stringifyWithMask(maskedKeywords: RegExp[], maskedOutput: string, ...args: any[]): string | undefined;
/**
 * If an ISO format date (2018-05-24T12:00:00.123Z) appears in the JSON, it will be transformed to JS Date type.
 */
export declare function parseWithDate(data: string): any;
//# sourceMappingURL=json-util.d.ts.map