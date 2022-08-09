import { Location } from "history";
import React from "react";
import { LoggerConfig } from "../Logger";
import { ErrorListener } from "../module";
import { SagaGenerator } from "../typed-saga";
/**
 * Configuration for frontend version check.
 * If the `versionCheckURL` API response changes, `onRemind` will be executed.
 */
interface VersionCheckConfig {
    onRemind: () => SagaGenerator;
    versionCheckURL: string;
    frequencyInSecond?: number;
}
/**
 * Configuration for browser related features.
 * - onIE: Alert to user or redirect when using IE browser, because framework does not support IE.
 * - onLocationChange: A global event handler for any location change events.
 * - navigationPreventionMessage: Only useful if you are leaving some page, whose "setNavigationPrevented" is toggled as true.
 */
interface BrowserConfig {
    onIE?: () => void;
    onLocationChange?: (location: Location) => void;
    navigationPreventionMessage?: string;
}
interface BootstrapOption {
    componentType: React.ComponentType;
    errorListener: ErrorListener;
    rootContainer?: HTMLElement;
    browserConfig?: BrowserConfig;
    loggerConfig?: LoggerConfig;
    versionConfig?: VersionCheckConfig;
    idleTimeoutInSecond?: number;
}
export declare const LOGGER_ACTION = "@@framework/logger";
export declare const VERSION_CHECK_ACTION = "@@framework/version-check";
export declare const GLOBAL_ERROR_ACTION = "@@framework/global";
export declare const GLOBAL_PROMISE_REJECTION_ACTION = "@@framework/promise-rejection";
export declare function bootstrap(option: BootstrapOption): void;
export declare function sendEventLogs(): Promise<void>;
export {};
//# sourceMappingURL=bootstrap.d.ts.map