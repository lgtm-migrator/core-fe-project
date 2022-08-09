import { Exception } from "./Exception";
interface Log {
    date: Date;
    action: string;
    result: "OK" | "WARN" | "ERROR";
    elapsedTime: number;
    context: {
        [key: string]: string;
    };
    info: {
        [key: string]: string;
    };
    stats: {
        [key: string]: number;
    };
    errorCode?: string | undefined;
    errorMessage?: string | undefined;
}
interface InfoLogEntry {
    action: string;
    elapsedTime?: number;
    info?: {
        [key: string]: string | undefined;
    };
    stats?: {
        [key: string]: number | undefined;
    };
}
interface ErrorLogEntry extends InfoLogEntry {
    errorCode: string;
    errorMessage: string;
}
/**
 * If eventLogger config is provided in non-DEV environment.
 * All collected logs will automatically sent to {serverURL} in a regular basis.
 *
 * The request will be PUT to the server in the following format:
 *      {events: Log[]}
 */
export interface LoggerConfig {
    serverURL: string;
    slowStartupThresholdInSecond?: number;
    frequencyInSecond?: number;
    maskedKeywords?: RegExp[];
}
export interface Logger {
    addContext(context: {
        [key: string]: string | (() => string);
    }): void;
    removeContext(key: string): void;
    info(entry: InfoLogEntry): void;
    warn(data: ErrorLogEntry): void;
    error(data: ErrorLogEntry): void;
}
export declare class LoggerImpl implements Logger {
    private contextMap;
    private logQueue;
    private collectPosition;
    constructor();
    addContext(context: {
        [key: string]: string | (() => string);
    }): void;
    removeContext(key: string): void;
    info(entry: InfoLogEntry): void;
    warn(entry: ErrorLogEntry): void;
    error(entry: ErrorLogEntry): void;
    exception(exception: Exception, extraInfo: {
        [key: string]: string | undefined;
    }, action: string): void;
    collect(maxSize?: number): ReadonlyArray<Log>;
    emptyLastCollection(): void;
    private createLog;
}
export {};
//# sourceMappingURL=Logger.d.ts.map