import * as React from "react";
import { Switch, Route } from "react-router-dom"
import { AppView } from "./AppView";
import { LinearSlider } from "../components/LinearSlider";

export class AppRouter extends React.Component<any, any> {

    public Routes: any[];
    public RouteElements:  JSX.Element[];
    public RouteLinks: JSX.Element[];

    constructor(props: any) {
        super(props);
        this.Routes = [];

        let location = window.location;
        // App.baseURL = location.origin + location.pathname;
        // App.TOC = TocUtils.getNodes();
        // App.Tooltips = TocUtils.getTooltips();

        console.log("App origin '" + location.origin + "'");
        console.log("App pathname '" + location.pathname + "'");
        console.log("App URL  " + location.href);
        // console.log("App base " + App.baseURL);

        this.Routes.push(this.create(LinearSlider, "/gauge", true));
        this.Routes.push(this.create(AppView, "/", false));

        this.RouteElements = this.Routes.map(r => r.element );
        this.RouteLinks = this.Routes.map(r => r.link );
    }

    public create(comp: any, path?: string, isExact?: boolean): any {
        if (path === undefined) {
            path = "/" + comp.name.toString();
        }
        // path = "/" + App.basename + path;

        if (isExact === undefined) {
            isExact = true;
        }
        let lbl: string;
        if (comp.name !== undefined) {
            lbl = "/" + comp.name.toString();
        } else {
            lbl = path;
        }

        let data = {
            label: lbl,
            // path: path,
            link: <div key={path}><a href={path}>{path}</a></div>,
            element: <Route exact={isExact} path={path} key={lbl} component={comp}/>
        }
        return data;
    }

    public render() {
        // console.log("AppRouter rendering " + window.location);
        return (
            // <div className="app-root">
                <Switch>
                    {this.RouteElements}
                </Switch>
            // </div>
        );
    }

}


