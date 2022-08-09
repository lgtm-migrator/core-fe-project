import React from "react";
import { RouteComponentProps, RouteProps } from "react-router-dom";
interface Props extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    withErrorBoundary: boolean;
    accessCondition: boolean;
    unauthorizedRedirectTo: string;
    notFound: boolean;
}
export declare class Route extends React.PureComponent<Props> {
    static defaultProps: Pick<Props, "exact" | "sensitive" | "withErrorBoundary" | "accessCondition" | "unauthorizedRedirectTo" | "notFound">;
    renderRegularRouteComponent: (props: RouteComponentProps<any>) => React.ReactElement;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Route.d.ts.map