import * as React from "react";

import { IgrGeographicMap } from 'igniteui-react-maps';
import { IgrGeographicMapModule } from 'igniteui-react-maps';
import { IgrGeographicShapeSeries } from 'igniteui-react-maps';
import { IgrGeographicSymbolSeries } from 'igniteui-react-maps';
import { IgrGeographicProportionalSymbolSeries } from 'igniteui-react-maps';
import { IgrDataChartInteractivityModule } from 'igniteui-react-charts';
import { DataContext } from "igniteui-react-core";
import { MarkerType } from 'igniteui-react-charts';
import { IgrSizeScale } from 'igniteui-react-charts';
import { DataService, OutbreakLocation } from "../data/DataService";

import { AppState } from "./AppState"

IgrGeographicMapModule.register();
IgrDataChartInteractivityModule.register();

export class MapView extends React.Component<any, AppState> {

    public themes: any = {
        light: {
            name: "light",
            shapes:     { color: "black", fill: "#eaeaea", highlight: "#ffffff"  },

            infections: { color: "#8B80FF", fill: "rgba(138, 128, 255, 0.5)" },
            deaths:     { color: "#FF3D60", fill: "rgba(255, 61, 97, 0.5)" },

            map:        { background: "transparent" },
            tooltip:    { color: "#62626E", background: "#FCFCFC", border: "1px solid #BFBFD4" },

        },
        dark:  {
            name: "dark",

            shapes:     { color: "black", fill: "#3f3f41", highlight: "#58585c" },

            infections: { color: "#8B80FF", fill: "rgba(138, 128, 255, 0.5)" },
            deaths:     { color: "#FF3D60", fill: "rgba(255, 61, 97, 0.5)" },

            map:        { background: "transparent" },
            tooltip:    { color: "rgba(255, 255, 255, 0.6)", background: "#1D1E21", border: "1px solid #565657" },
        },
    }

    public geoMap: IgrGeographicMap;
    public geoShapeSeries: IgrGeographicShapeSeries;
    public geoSymbolSeries: IgrGeographicSymbolSeries;
    public geoBubbleSeries: IgrGeographicProportionalSymbolSeries;
    public geoBubbleScale: IgrSizeScale;

    constructor(props: any) {
      super(props);

      this.getTooltip = this.getTooltip.bind(this);

      this.onMapReferenced = this.onMapReferenced.bind(this);
    }

    public render() {

        let theme = this.themes[this.props.theme || "light"];
        let style = { } as React.CSSProperties;
        style.background = theme.map.background;
        style.display = this.props.isVisible ? "block" : "none";

        return (
        <div className="app-stack-map" style={style}>
            <IgrGeographicMap
                ref={this.onMapReferenced}
                width="100%"
                height="100%"
                zoomable="true">
                <IgrGeographicShapeSeries
                name="shapeSeries"
                tooltipTemplate={this.getTooltip}
                showDefaultTooltip={false}
                brush={theme.shapes.fill}
                outline={theme.shapes.color}
                thickness="0.5"/>

                <IgrGeographicProportionalSymbolSeries
                name="bubbleSeries"
                 latitudeMemberPath="latitude"
                longitudeMemberPath="longitude"
                tooltipTemplate={this.getTooltip}
                  markerBrush={theme.infections.fill}
                markerOutline={theme.infections.color}
                markerType="Circle"
                thickness="1" />

                </IgrGeographicMap>
        </div>
        );
    }

    public onMapReferenced(map: IgrGeographicMap) {

        // if (this.geoMap === null) { return; }
        // if (this.geoMap === undefined) { return; }

        this.geoMap = map;
        this.geoMap.backgroundContent = undefined;
        this.geoMap.windowRect = { left: 0.25, top: 0.0, width: 0.7, height: 0.45 };

        this.geoShapeSeries  = this.geoMap.actualSeries[0] as IgrGeographicShapeSeries;
        this.geoBubbleSeries = this.geoMap.actualSeries[1] as IgrGeographicProportionalSymbolSeries;

        this.geoBubbleScale = new IgrSizeScale({});
        this.geoBubbleScale.minimumValue = 5;
        this.geoBubbleScale.maximumValue = 70;

        this.geoBubbleSeries.markerType = MarkerType.Circle;
        this.geoBubbleSeries.radiusScale = this.geoBubbleScale;
        this.updateColumns();
    }

    public componentDidMount() {
        // console.log('Map mounted ');
    }

    public updateColumns() {
        // if (this.selectedCountries === undefined ||
        //     this.selectedCountries.length === 0) { return; }

        let theme = this.themes[this.props.theme || "light"];
        let bubbleMemberPath = this.props.bubbleMemberPath || "totalInfections";
        let bubbleIsLogarithmic = this.props.bubbleIsLogarithmic;

        // this.geoBubbleScale.isLogarithmic = bubbleIsLogarithmic;
        // console.log("Map updateColumns r=" + bubbleMemberPath );
        // this.geoBubbleScale.isLogarithmic = bubbleIsLogarithmic;
        // this.geoBubbleSeries.radiusScale = this.geoBubbleScale;
        this.geoBubbleSeries.radiusMemberPath = bubbleMemberPath;

        if (bubbleMemberPath === "totalInfections") {
            // this.geoBubbleScale.minimumValue = 8;
            // this.geoBubbleScale.maximumValue = 75;
            this.geoBubbleSeries.radiusScale = this.geoBubbleScale;
            this.geoBubbleSeries.markerBrush   = theme.infections.fill;
            this.geoBubbleSeries.markerOutline = theme.infections.color;
        } else {
            // this.geoBubbleScale.minimumValue = 8;
            // this.geoBubbleScale.maximumValue = 75;
            this.geoBubbleSeries.radiusScale = this.geoBubbleScale;
            this.geoBubbleSeries.markerBrush   = theme.deaths.fill;
            this.geoBubbleSeries.markerOutline = theme.deaths.color;
        }
    }

    public updateData(allCountries: OutbreakLocation[], selectedCountries: string[]) {

        // console.log('Map updateData ');
        // if (this.geoMap === null) { return; }
        if (this.geoMap === undefined) { return; }

        let currentCountries = [];
        for (let country of allCountries) {
            // if (country.population >= 100000) {
            if (country.totalInfections >= 1 ||
                country.totalDeaths >= 1) {
                currentCountries.push(country);
            }
        }

        this.geoBubbleSeries.dataSource = currentCountries;

        this.geoShapeSeries.dataSource = allCountries;
        this.geoShapeSeries.shapeMemberPath = "shapes";

    }

    public updateTheme(themeName: string) {
        // let theme = this.themes[themeName || "light"];
        // this.highlightSeries.brush      = theme.series.color;
        // this.markerSeries.markerOutline = theme.series.color;
        // this.markerSeries.markerBrush   = theme.series.fill;
        // // this.markerSeries.tooltipTemplate = this.getTooltip;
        // this.markerSeries.markerTemplate = this.getMarker(theme.series, false);
    }

    public getTooltip(context: any) {
        const dataContext = context.dataContext as DataContext;
        if (!dataContext) return null;

        const dataItem = dataContext.item as OutbreakLocation;
        if (!dataItem) return null;

        let theme = this.themes[this.props.theme || "light"];
        let infections = { color: theme.infections.color } as React.CSSProperties;
        let deaths = { color: theme.deaths.color } as React.CSSProperties;
        // let recoveries = { color: theme.recoveries.color } as React.CSSProperties;
        // let title = { color: seriesBrush } as React.CSSProperties;

        let wkInfectionName = DataService.GetDisplayName("weeklyInfections", this.props.usePropStats);
        let totInfectionName = DataService.GetDisplayName("totalInfections", this.props.usePropStats);
        let totDeathsName = DataService.GetDisplayName("totalDeaths", this.props.usePropStats);
        let wkDeathsName = DataService.GetDisplayName("weeklyDeaths", this.props.usePropStats);

        return <div>
            <div className="tooltip" style={theme.tooltip}>
                {/* <div className="tooltipTitle" style={title}>{dataItem.country}</div> */}
                <div className="tooltipHeader">
                    <img className="tooltipFlag" src={dataItem.flag}/>
                    <div className="tooltipTitle" >{dataItem.country}</div>
                </div>
                <div className="tooltipBox">

                    <div className="tooltipRow">
                        <div className="tooltipLbl" >{wkInfectionName}:</div>
                        <div className="tooltipVal">{DataService.format(dataItem.weeklyInfections)}</div>
                    </div>
                    <div className="tooltipRow">
                        <div className="tooltipLbl" style={infections}>{totInfectionName}:</div>
                        <div className="tooltipVal">{DataService.format(dataItem.totalInfections)}</div>
                    </div>
                    {/* <div className="tooltipRow">
                        <div className="tooltipLbl" style={recoveries}>Total Recoveries:</div>
                        <div className="tooltipVal">{DataService.format(dataItem.totalRecoveries)}</div>
                    </div> */}
                    <div className="tooltipRow">
                        <div className="tooltipLbl" >{wkDeathsName}:</div>
                        <div className="tooltipVal">{DataService.format(dataItem.weeklyDeaths)}</div>
                    </div>
                    <div className="tooltipRow">
                        <div className="tooltipLbl" style={deaths}>{totDeathsName}:</div>
                        <div className="tooltipVal">{DataService.format(dataItem.totalDeaths)}</div>
                    </div>
                    <div className="tooltipRow">
                        <div className="tooltipLbl">Date</div>
                        <div className="tooltipVal">{dataItem.date}</div>
                    </div>

                </div>
            </div>
        </div>
    }

}