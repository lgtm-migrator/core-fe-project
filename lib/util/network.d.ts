import { AxiosRequestConfig, Method } from "axios";
export declare type PathParams<T extends string> = string extends T ? {
    [key: string]: string | number;
} : T extends `${infer Start}:${infer Param}/${infer Rest}` ? {
    [k in Param | keyof PathParams<Rest>]: string | number;
} : T extends `${infer Start}:${infer Param}` ? {
    [k in Param]: string | number;
} : {};
export interface APIErrorResponse {
    id?: string | null;
    errorCode?: string | null;
    message?: string | null;
}
export declare function ajax<Request, Response, Path extends string>(method: Method, path: Path, pathParams: PathParams<Path>, request: Request, extraConfig?: Partial<AxiosRequestConfig>): Promise<Response>;
export declare function uri<Request>(path: string, request: Request): string;
export declare function urlParams(pattern: string, params: object): string;
//# sourceMappingURL=network.d.ts.map