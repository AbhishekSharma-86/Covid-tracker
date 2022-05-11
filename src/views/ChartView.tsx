import * as React from "react";

import { DataService, OutbreakLocation } from "../data/DataService";
import { AppState } from "./AppState"
// types of axis:
import { IgrNumericYAxis } from 'igniteui-react-charts';
import { IgrNumericXAxis } from 'igniteui-react-charts';
// types of scatter series:
import { IgrScatterSeries } from 'igniteui-react-charts';
import { IgrScatterLineSeries } from 'igniteui-react-charts';
// modules of data chart:
import { IgrDataChart } from 'igniteui-react-charts';
import { IgrDataChartCoreModule } from 'igniteui-react-charts';
import { IgrDataChartCategoryModule } from 'igniteui-react-charts';
import { IgrDataChartScatterCoreModule } from 'igniteui-react-charts';
import { IgrDataChartScatterModule } from 'igniteui-react-charts';
// additional modules
import { IgrDataChartInteractivityModule } from 'igniteui-react-charts';
import { IgrNumberAbbreviatorModule } from 'igniteui-react-charts';
import { IgrItemToolTipLayer } from 'igniteui-react-charts';
import { MarkerType } from 'igniteui-react-charts';
// tooltip and marker modules:
import { DataContext } from "igniteui-react-core";
import { DataTemplateRenderInfo } from 'igniteui-react-core';
import { DataTemplateMeasureInfo } from 'igniteui-react-core';
// series highlighting/events
import { IgrDataChartMouseButtonEventArgs } from "igniteui-react-charts";
import { IgrChartMouseEventArgs } from "igniteui-react-charts";
import { IgrSeriesViewer } from "igniteui-react-charts";
import { InteractionState } from "igniteui-react-core";

IgrDataChartCoreModule.register();
IgrDataChartCategoryModule.register();
IgrDataChartScatterCoreModule.register();
IgrDataChartScatterModule.register();
IgrDataChartInteractivityModule.register();
IgrNumberAbbreviatorModule.register();

export class ChartView extends React.Component<any, AppState> {

    public themes: any = {
        light: {
            name: "light",
            // series:     { color: "#7D73E6", fill: "white", text: "black" },

            infections: { color: "#8B80FF", fill: "white" },
            deaths:     { color: "#FF3D60", fill: "white" },

            // primary:    { color: "#242241", background: "#F6F6F9" },
            // infections: { color: "#7D73E6", background: "#F9F8F9", borderBottom: "1px solid #C7C6CC" },
            // recoveries: { color: "#22994C", background: "#F9F8F9", borderBottom: "1px solid #C7C6CC" },
            // deaths:     { color: "#FF3D60", background: "#F9F8F9", borderBottom: "1px solid #C7C6CC" },

            plot:       { color: "#242241", background: "#F6F6F9" }, // background: "#F6F6F9" },
            tooltip:    { color: "#62626E", background: "#FCFCFC", border: "1px solid #BFBFD4" },
            axisTitles: { color: "rgba(98, 98, 111, 0.8)" },
            axisLabels: { color: "rgba(98, 98, 110, 1)" },
            axisLines:  { color: "rgba(98, 98, 110, 1)" },
        },
        dark:  {
            name: "dark",
            // series:     { color: "#8B80FF", fill: "black", text: "rgba(98, 98, 110, 1)" },

            infections: { color: "#8B80FF", fill: "#131416" },
            deaths:     { color: "#FF3D60", fill: "#131416" },

            // primary:    { color: "white", background: "#131416" },
            // infections: { color: "#8B80FF", background: "#222327", borderBottom: "1px solid #222327" },
            // recoveries: { color: "#4CAF50", background: "#222327", borderBottom: "1px solid #222327" },
            // deaths:     { color: "#FF3D60", background: "#222327", borderBottom: "1px solid #222327"},

            plot:       { color: "white", background: "#131416" },
            tooltip:    { color: "rgba(255, 255, 255, 0.6)", background: "#1D1E21", border: "1px solid #565657" },
            axisTitles: { color: "rgba(255, 255, 255, 0.4)" },
            axisLabels: { color: "rgba(255, 255, 255, 0.7)" },
            axisLines:  { color: "rgba(255, 255, 255, 0.7)" },

        },
    }

    public chart: IgrDataChart;
    public markerSeries: IgrScatterSeries;
    public highlightSeries: IgrScatterLineSeries;
    public historySeries: IgrScatterLineSeries[] = [];
    public tooltipLayer: IgrItemToolTipLayer;
    public historySeriesCount: number = 1;
    public firstMarker = true;

    public selectedCountries: OutbreakLocation[];

    constructor(props: any) {
        super(props);

        this.state = {
            theme: props.theme,
            countriesStats: [],
        };

        this.onChartRef = this.onChartRef.bind(this);
        this.onSeriesMouseEnter = this.onSeriesMouseEnter.bind(this);
        this.onSeriesMouseLeave = this.onSeriesMouseLeave.bind(this);

        this.getTooltip = this.getTooltip.bind(this);
    }

    public getProp(propName: string, defaultValue: any): any {
        return this.props[propName] !== undefined ? this.props[propName] : defaultValue;
    }


    public render() {

        let theme = this.themes[this.props.theme || "light"];

        let usePropStats = this.getProp("usePropStats", false);
        let xAxisMemberPath = this.getProp("xAxisMemberPath", "weeklyInfections");
        let yAxisMemberPath = this.getProp("yAxisMemberPath", "weeklyInfections");

        let xAxisIsLogarithmic = this.getProp("xAxisIsLogarithmic", true);
        let yAxisIsLogarithmic = this.getProp("yAxisIsLogarithmic", true);

        let xAxisMinimumValue = this.getProp("xAxisMinimumValue", 1);
        let xAxisMaximumValue = this.getProp("xAxisMaximumValue", 100);

        let yAxisMinimumValue = this.getProp("yAxisMinimumValue", 1);
        let yAxisMaximumValue = this.getProp("yAxisMaximumValue", 100);

        let style = { } as React.CSSProperties;
        style.display = this.props.isVisible ? "block" : "none";

        return (
        <div className="app-stack-chart" style={style}>
            <IgrDataChart ref={this.onChartRef}
                isHorizontalZoomEnabled={true}
                isVerticalZoomEnabled={true}
                plotAreaBackground={theme.plot.background}
                seriesMouseEnter={this.onSeriesMouseEnter}
                seriesMouseLeave={this.onSeriesMouseLeave}
                subtitleTextColor={theme.axisLabels.color}
                width="100%"
                height="100%">

                <IgrNumericXAxis name="xAxis"
                    tickLength="5"
                    tickStrokeThickness="0.5"
                    tickStroke={theme.axisLines.color}
                    labelTextColor={theme.axisLabels.color}
                    titleTextColor={theme.axisLabels.color}
                    majorStroke={theme.axisLines.color}
                    majorStrokeThickness="0.5"
                    stroke={theme.axisLines.color}
                    strokeThickness="0.75"
                    abbreviateLargeNumbers={true}
                    isLogarithmic={xAxisIsLogarithmic}
                    minimumValue={xAxisMinimumValue}
                    maximumValue={xAxisMaximumValue}
                    title={ DataService.GetDisplayName(this.props.xAxisMemberPath, this.props.usePropStats)}
                    titleBottomMargin="0"
                    />

                <IgrNumericYAxis name="yAxis"
                    tickLength="5"
                    tickStrokeThickness="0.5"
                    tickStroke={theme.axisLines.color}
                    labelTextColor={theme.axisLabels.color}
                    titleTextColor={theme.axisLabels.color}
                    majorStroke={theme.axisLines.color}
                    majorStrokeThickness="0.5"
                    stroke={theme.axisLines.color}
                    strokeThickness="0.75"
                    abbreviateLargeNumbers={true}
                    isLogarithmic={yAxisIsLogarithmic}
                    minimumValue={yAxisMinimumValue}
                    maximumValue={yAxisMaximumValue}
                    title={ DataService.GetDisplayName(this.props.yAxisMemberPath, this.props.usePropStats)}
                    titleLeftMargin={0}
                    titleRightMargin={0}
                    labelLeftMargin={0}
                    />


            </IgrDataChart>
        </div>
        );
    }

    public onSeriesMouseEnter(s: IgrSeriesViewer, e: IgrChartMouseEventArgs) {
        let location = e.item as OutbreakLocation;
        if (location === null || location === undefined) { return; }
        // console.log("Chart onSeriesMouseEnter " + location.iso);

        this.highlightSeries.dataSource = [];

        for (let i = 0; i < this.selectedCountries.length; i++) {
            let item = this.selectedCountries[i];
            if (item.iso === location.iso) {
                this.highlightSeries.dataSource = item.progress;
                break;
            }
        }
    }

    public onSeriesMouseLeave(s: IgrSeriesViewer, e: IgrChartMouseEventArgs) {

        this.highlightSeries.dataSource = [];

        let location = e.item as OutbreakLocation;
        if (location === null || location === undefined) { return; }

        // console.log("onSeriesMouseLeave " + location.iso);
    }

    public onChartRef(chart: IgrDataChart) {
        this.chart = chart;
        if (this.chart === null) { return; }
        if (this.chart === undefined) { return; }

        this.chart.series.clear();

        for (let i = 0; i < this.historySeriesCount; i++) {
            let series = this.createHistorySeries();
            this.chart.series.add(series);
            this.historySeries.push(series);
        }

        this.highlightSeries = this.createHistorySeries();
        this.highlightSeries.thickness = 4;
        this.chart.series.add(this.highlightSeries);

        this.markerSeries = this.createMarkerSeries("Large Countries");
        // this.markerSeries.showDefaultTooltip = true;
        this.chart.series.add(this.markerSeries);

        this.updateMarkers();
        // this.tooltipLayer = new IgrItemToolTipLayer({ name: "itemTooltipLayer" });
        // this.chart.series.add(this.tooltipLayer);
    }

    public createMarkerSeries(title: string): IgrScatterSeries
    {
        // let theme = this.themes[this.props.theme || "light"];

        let xAxisMemberPath = this.props.xAxisMemberPath || "totalInfections";
        let yAxisMemberPath = this.props.yAxisMemberPath || "weeklyInfections";

        // console.log("Chart createMarkerSeries " );
        const id = "series" + this.chart.series.count;
        const series = new IgrScatterSeries({ name: id });
        series.title = title;
        series.markerType = MarkerType.Circle;
        // series.markerOutline = theme.series.color;
        // series.markerBrush = theme.series.fill;
        series.xMemberPath = xAxisMemberPath;
        series.yMemberPath = yAxisMemberPath;
        series.xAxisName = "xAxis";
        series.yAxisName = "yAxis";
        series.showDefaultTooltip = false;
        series.tooltipTemplate = this.getTooltip;
        // series.transitionDuration = this.props.updateInterval || 500;
        // series.markerTemplate = this.getMarker(theme.series, false);
        // series.markerTemplate = this.markersWithISO;
        return series;
    }

    public createHistorySeries(): IgrScatterLineSeries
    {
        let xAxisMemberPath = this.props.xAxisMemberPath || "totalInfections";
        let yAxisMemberPath = this.props.yAxisMemberPath || "weeklyInfections";

        const id = "series" + this.chart.series.count;
        const series = new IgrScatterLineSeries({ name: id });
        series.markerType = MarkerType.None;
        // series.brush = theme.infections.color;
        series.brush = "gray";
        series.thickness = 2;
        series.xMemberPath = xAxisMemberPath;
        series.yMemberPath = yAxisMemberPath;
        series.xAxisName = "xAxis";
        series.yAxisName = "yAxis";
        series.showDefaultTooltip = false;
        return series;
    }

    public updateMarkers() {

        let theme = this.themes[this.props.theme || "light"];
        let xAxisMemberPath = this.props.xAxisMemberPath || "totalInfections";

        if (xAxisMemberPath === "totalInfections") {
            this.markerSeries.markerTemplate = this.getMarker(theme.infections, false);
            this.highlightSeries.brush = theme.infections.color;
        } else {
            this.markerSeries.markerTemplate = this.getMarker(theme.deaths, false);
            this.highlightSeries.brush = theme.deaths.color;
        }
    }

    public updateColumns() {
        // if (this.selectedCountries === undefined ||
        //     this.selectedCountries.length === 0) { return; }

        let xAxisMemberPath = this.props.xAxisMemberPath || "totalInfections";
        let yAxisMemberPath = this.props.yAxisMemberPath || "weeklyInfections";
        let useFlags = this.props.useFlags;

        this.updateMarkers();

        // console.log("Chart updateColumns x=" + xAxisMemberPath + " y=" + yAxisMemberPath);
        this.markerSeries.xMemberPath = xAxisMemberPath;
        this.markerSeries.yMemberPath = yAxisMemberPath;

        this.highlightSeries.xMemberPath = xAxisMemberPath;
        this.highlightSeries.yMemberPath = yAxisMemberPath;

        for (let i = 0; i < this.historySeries.length; i++) {
            this.historySeries[i].xMemberPath = xAxisMemberPath;
            this.historySeries[i].yMemberPath = yAxisMemberPath;
        }

    }

    public updateData(allCountries: OutbreakLocation[], selectedNames: string[], date: string) {
        // const countries = this.props.countries === undefined ? [] : this.props.countries;
        // const history = countries === undefined || countries.length === 0 ? [] : countries[0].history;

        if (this.chart === undefined) { return; }

        this.chart.subtitle = "Current Date: " + date;

        if (selectedNames.length > this.historySeriesCount) {
            // this.chart.series.remove(this.markerSeries);
            for (let i = 0; i < selectedNames.length - this.historySeriesCount; i++) {
                let series = this.createHistorySeries();
                this.chart.series.insert(0, series);
                // this.chart.series.add(series);
                this.historySeries.push(series);
            }
            // this.chart.series.add(this.markerSeries);
            this.historySeriesCount = selectedNames.length;
        }

        this.selectedCountries = [];
        for (const item of allCountries) {
            if (
                selectedNames.indexOf(item.iso) >= 0) {
                this.selectedCountries.push(item);
            }
        }

        this.markerSeries.dataSource = this.selectedCountries;

        for (let i = 0; i < this.historySeries.length; i++) {

            if (i < this.selectedCountries.length) {
                let historyData = this.selectedCountries[i].progress;
                this.historySeries[i].dataSource = historyData;
            } else {
                this.historySeries[i].dataSource = [];
            }
        }

        // this.chart.notifyClearItems(history);
    }

    public updateTheme(themeName: string) {
        // let theme = this.themes[themeName || "light"];

        this.updateMarkers();
        // this.highlightSeries.brush      = theme.series.color;
        // this.markerSeries.markerOutline = theme.series.color;
        // this.markerSeries.markerBrush   = theme.series.fill;
        // this.markerSeries.tooltipTemplate = this.getTooltip;
        // this.markerSeries.markerTemplate = this.getMarker(theme.series, false);
        // for (let i = 0; i < this.historySeries.length; i++) {
        //     this.historySeries[i].brush = theme.infections.color;
        // }

    }


    public getTooltip(context: any) {
        const dataContext = context.dataContext as DataContext;
        if (!dataContext) return null;

        const dataItem = dataContext.item as OutbreakLocation;
        if (!dataItem) return null;

        // let seriesBrush = dataContext.series.actualBrush;

        // console.log("getTooltip " + dataItem.country);

        let theme = this.themes[this.props.theme || "light"];
        let infections = { color: theme.infections.color } as React.CSSProperties;
        let deaths = { color: theme.deaths.color } as React.CSSProperties;
        // let recoveries = { color: theme.recoveries.color } as React.CSSProperties;
        // let title = { color: seriesBrush } as React.CSSProperties;

        let xDataMember = this.props.xAxisMemberPath || "totalInfections";
        let yDataMember = this.props.yAxisMemberPath || "weeklyInfections";
        let xDataValue = DataService.format(dataItem[xDataMember]);
        let yDataValue = DataService.format(dataItem[yDataMember]);
        // let xDataHeader = DataService.dataColumns[xDataMember];
        // let yDataHeader = DataService.dataColumns[yDataMember];

        let yDataHeader = DataService.GetDisplayName(yDataMember, this.props.usePropStats);
        let xDataHeader = DataService.GetDisplayName(xDataMember, this.props.usePropStats);

        return <div>
            <div className="tooltip" style={theme.tooltip}>
                <div className="tooltipHeader">
                    <img className="tooltipFlag" src={dataItem.flag}/>
                    <div className="tooltipTitle" >{dataItem.country}</div>
                </div>
                <div className="tooltipBox">

                    <div className="tooltipRow">
                        <div className="tooltipLbl">{yDataHeader}</div>
                        <div className="tooltipVal">{yDataValue}</div>
                    </div>
                    <div className="tooltipRow">
                        <div className="tooltipLbl">{xDataHeader}</div>
                        <div className="tooltipVal">{xDataValue}</div>
                    </div>
                    <div className="tooltipRow">
                        <div className="tooltipLbl">Date</div>
                        <div className="tooltipVal">{dataItem.date}</div>
                    </div>

                    {/* <div className="tooltipRow">
                        <div className="tooltipLbl" style={recoveries}>Total Recoveries:</div>
                        <div className="tooltipVal">{DataService.format(dataItem.totalRecoveries)}</div>
                    </div> */}

                </div>
            </div>
        </div>
    }

    public getMarker(style: any, useFlags: boolean): any
    {
        if (style === undefined) style = { color: "#7D73E6", fill: "white", text: "black" };

        // console.log("Chart getMarker " + style.color + ", useFlags " + useFlags);

        const size = 12;
        const radius = size / 2;
        return {
            measure: function (measureInfo: DataTemplateMeasureInfo) {
                // measureInfo.width  = size;
                // measureInfo.height = size;
                const data = measureInfo.data;
                const context = measureInfo.context;
                let name = "null";
                let item = data.item as OutbreakLocation;
                if (item != null) {
                    name = item.iso.toString().toUpperCase();
                }
                const height = context.measureText("M").width;
                const width = context.measureText("USA").width;
                measureInfo.width = width;
                measureInfo.height = height + size;
            },
            render: function (renderInfo: DataTemplateRenderInfo) {
                const location = renderInfo.data.item as OutbreakLocation;
                const name = location.iso.toString().toUpperCase();

                const ctx = renderInfo.context as CanvasRenderingContext2D;
                let x = renderInfo.xPosition;
                let y = renderInfo.yPosition;
                let halfWidth = renderInfo.availableWidth / 2.0;
                let halfHeight = renderInfo.availableHeight / 2.0;

                if (renderInfo.isHitTestRender) {
                    ctx.fillStyle = renderInfo.data.actualItemBrush.fill;
                    ctx.fillRect(x, y, renderInfo.availableWidth, renderInfo.availableHeight);
                    return;
                } else {
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
                    ctx.fillStyle = style.fill;
                    ctx.fill();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = style.color;
                    ctx.stroke();
                    ctx.closePath();
                }

                x = renderInfo.xPosition + 5;
                y = renderInfo.yPosition + 7.5;
                if (y < 0) {
                    y -= renderInfo.availableHeight + 7.5;
                }

                let bottomEdge = renderInfo.passInfo.viewportTop + renderInfo.passInfo.viewportHeight;
                if (y + renderInfo.availableHeight > bottomEdge) {
                    y -= renderInfo.availableHeight + 5;
                }


                let rightEdge = renderInfo.passInfo.viewportLeft + renderInfo.passInfo.viewportWidth;
                if (x + renderInfo.availableWidth > rightEdge) {
                    x -= renderInfo.availableWidth + 12;
                }

                ctx.beginPath();
                ctx.fillStyle = style.color;
                ctx.fillRect(x - 2, y - 2, renderInfo.availableWidth + 8, halfHeight + 6);
                ctx.closePath();

                ctx.font = '8pt Verdana';
                ctx.textBaseline = "top";
                ctx.fillStyle = style.fill;
                ctx.fillText(name, x + 2, y + 1);


                    // if (useFlags) {
                    //     const image = new Image();
                    //     image.src = location.flag;
                    //     // image.onload = () => { };
                    //     ctx.drawImage(image, x + 10, y, imageW, imageH);
                    //     // flag border
                    //     ctx.beginPath();
                    //     ctx.rect(x + 10, y, imageW, imageH);
                    //     ctx.lineWidth = 1;
                    //     ctx.strokeStyle = "#575757";
                    //     ctx.stroke();
                    //     ctx.closePath();
                    //     // leader line
                    //     ctx.beginPath();
                    //     ctx.moveTo(x, y);
                    //     ctx.lineTo(x + 10, y);
                    //     ctx.lineWidth = 2;
                    //     ctx.strokeStyle = style.color;
                    //     ctx.stroke();
                    //     ctx.closePath();
                    // } else {
                    //     ctx.font = '8pt Verdana';
                    //     ctx.textBaseline = "middle";
                    //     ctx.fillStyle = style.color;
                    //     ctx.fillText(name, x + 10, y);
                    // }

                    // ctx.beginPath();
                    // ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
                    // ctx.fillStyle = style.fill;
                    // ctx.fill();
                    // ctx.lineWidth = 2;
                    // ctx.strokeStyle = style.color;
                    // ctx.stroke();
                    // ctx.closePath();

                // }
            }
        }
    }

}