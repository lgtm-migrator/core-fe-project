import React from "react";
import { DispatchProp } from "react-redux";
import { State } from "../reducer";
interface OwnProps {
    message: string;
}
interface StateProps {
    isPrevented: boolean;
}
interface Props extends OwnProps, StateProps, DispatchProp {
}
declare class Component extends React.PureComponent<Props, State> {
    componentDidUpdate(prevProps: Readonly<Props>): void;
    render(): JSX.Element;
}
export declare const NavigationGuard: import("react-redux").ConnectedComponent<typeof Component, import("react-redux").Omit<React.ClassAttributes<Component> & Props, "isPrevented" | "dispatch">>;
export {};
//# sourceMappingURL=NavigationGuard.d.ts.map