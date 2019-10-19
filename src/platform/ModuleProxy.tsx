import React from "react";
import {RouteComponentProps} from "react-router";
import {SagaIterator, Task} from "redux-saga";
import {delay} from "redux-saga/effects";
import {app} from "../app";
import {ActionCreators, ActionHandler, executeAction, LifecycleDecoratorFlag} from "../module";
import {navigationPreventionAction, setStateAction} from "../reducer";
import {Module, ModuleLifecycleListener} from "./Module";

interface AttachLifecycleOption {
    retainStateOnLeave?: boolean;
}

export class ModuleProxy<M extends Module<any>> {
    public constructor(private module: M, private actions: ActionCreators<M>) {}

    public getActions(): ActionCreators<M> {
        return this.actions;
    }

    public attachLifecycle<P extends {}>(ComponentType: React.ComponentType<P>, config: AttachLifecycleOption = {}): React.ComponentType<P> {
        const moduleName = this.module.name;
        const initialState = (this.module as any).initialState;
        const lifecycleListener = this.module as ModuleLifecycleListener;
        const actions = this.actions as any;

        return class extends React.PureComponent<P> {
            public static displayName = `ModuleBoundary(${moduleName})`;
            private readonly lifecycleSagaTask: Task;
            private successTickCount: number = 0;
            private mountedTime: number = Date.now();

            constructor(props: P) {
                super(props);
                this.lifecycleSagaTask = app.sagaMiddleware.run(this.lifecycleSaga.bind(this));
            }

            componentDidUpdate(prevProps: Readonly<P>) {
                const prevLocation = (prevProps as any).location;
                const currentLocation = (this.props as any).location;
                const currentRouteParams = (this.props as any).match ? (this.props as any).match.params : null;
                if (currentLocation && currentRouteParams && prevLocation !== currentLocation && lifecycleListener.onRender.isLifecycle) {
                    // Only trigger onRender if current component is connected to <Route>
                    app.logger.info(`${moduleName}/@@LOCATION_CHANGE_RENDER`, {locationParams: JSON.stringify(currentRouteParams)});
                    app.store.dispatch(actions.onRender(currentRouteParams, currentLocation));
                    app.store.dispatch(navigationPreventionAction(false));
                }
            }

            componentWillUnmount() {
                if (lifecycleListener.onDestroy.isLifecycle) {
                    app.store.dispatch(actions.onDestroy());
                }

                // TODO: remove next version
                if (!config.retainStateOnLeave) {
                    app.store.dispatch(setStateAction(moduleName, initialState, `@@${moduleName}/@@reset`));
                }

                const currentLocation = (this.props as any).location;
                if (currentLocation) {
                    // Only cancel navigation prevention if current component is connected to <Route>
                    app.store.dispatch(navigationPreventionAction(false));
                }

                this.lifecycleSagaTask.cancel();
                app.logger.info(`${moduleName}/@@DESTROY`, {
                    successTickCount: this.successTickCount.toString(),
                    stayingSecond: ((Date.now() - this.mountedTime) / 1000).toFixed(2),
                });
            }

            private *lifecycleSaga(): SagaIterator {
                const props = this.props as (RouteComponentProps | {});

                if (lifecycleListener.onEnter.isLifecycle) {
                    const startTime = Date.now();
                    yield* executeAction(lifecycleListener.onEnter.bind(lifecycleListener));
                    app.logger.info(`${moduleName}/@@ENTER`, {componentProps: JSON.stringify(props)}, Date.now() - startTime);
                } else {
                    app.logger.info(`${moduleName}/@@ENTER`, {componentProps: JSON.stringify(props)});
                }

                if (lifecycleListener.onRender.isLifecycle) {
                    if ("match" in props && "location" in props) {
                        const startTime = Date.now();
                        yield* executeAction(lifecycleListener.onRender.bind(lifecycleListener), props.match.params, props.location);
                        app.logger.info(`${moduleName}/@@INITIAL_RENDER`, {locationParams: JSON.stringify(props.match.params)}, Date.now() - startTime);
                    } else {
                        const startTime = Date.now();
                        console.warn(`Module [${moduleName}] is not attached to routers, use onEnter() lifecycle instead`);
                        yield* executeAction(lifecycleListener.onRender.bind(lifecycleListener), {}, app.browserHistory);
                        app.logger.info(`${moduleName}/@@INITIAL_RENDER`, {locationParams: "[Not Route Component]"}, Date.now() - startTime);
                    }
                }

                if (lifecycleListener.onTick.isLifecycle) {
                    const tickIntervalInMillisecond = (lifecycleListener.onTick.tickInterval || 5) * 1000;
                    const boundTicker = lifecycleListener.onTick.bind(lifecycleListener);
                    while (true) {
                        yield* executeAction(boundTicker);
                        this.successTickCount++;
                        yield delay(tickIntervalInMillisecond);
                    }
                }
            }

            render() {
                return <ComponentType {...this.props} />;
            }
        };
    }
}
