import React from "react";
import { Exception } from "../Exception";
interface Props {
    render: (exception: Exception) => React.ReactElement | null;
    children: React.ReactNode;
}
interface State {
    exception: Exception | null;
}
export declare class ErrorBoundary extends React.PureComponent<Props, State> {
    static displayName: string;
    static defaultProps: Pick<Props, "render">;
    constructor(props: Props);
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    render(): string | number | true | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | null;
}
export {};
//# sourceMappingURL=ErrorBoundary.d.ts.map