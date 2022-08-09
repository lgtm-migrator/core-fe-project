import React from "react";
import { ActionCreators } from "../module";
import { Module } from "./Module";
export declare class ModuleProxy<M extends Module<any, any>> {
    private module;
    private actions;
    constructor(module: M, actions: ActionCreators<M>);
    getActions(): ActionCreators<M>;
    attachLifecycle<P extends object>(ComponentType: React.ComponentType<P>): React.ComponentType<P>;
}
//# sourceMappingURL=ModuleProxy.d.ts.map