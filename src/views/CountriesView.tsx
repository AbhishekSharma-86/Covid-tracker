import * as React from "react";

import { AppState } from "./AppState"
export class CountriesView extends React.Component<any, AppState> {


    constructor(props: any) {
      super(props);

    }

    public render() {

        return (
        <div className="app-list-country-infections">
            CountriesView
        </div>
        );
    }

    public componentDidMount() {
        //
    }
}