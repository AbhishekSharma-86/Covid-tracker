import * as React from "react";

import * as IconPlay from "@material-ui/icons/PlayArrow";
import * as IconPause from "@material-ui/icons/Pause";
import * as IconMenu from "@material-ui/icons/Menu";
import * as IconPalette from "@material-ui/icons/Palette";
import * as IconFlag from "@material-ui/icons/Flag";
import * as IconList from "@material-ui/icons/FormatListBulleted";
import * as IconChart from "@material-ui/icons/Equalizer";
import * as IconHelp from "@material-ui/icons/LocalLibrary";
import * as IconMap from "@material-ui/icons/Public";
import IconButton from '@material-ui/core/IconButton';
// import * as IconHelp from "@material-ui/icons/Help";
// import * as IconHelp from "@material-ui/icons/MenuBook";

import "../data/Extensions";
import { Locations } from "../data/Locations";

import { AppState } from "./AppState"
import { ChartView } from "./ChartView";
import { ChartAxisRange } from "./ChartAxisRange";
import { ListView } from "./ListView";
import { MapView } from "./MapView";
import { DataService, OutbreakStats } from "../data/DataService";
import { Array } from "../data/ArrayUtils";
import { Slider } from "../components/Slider";
import { Tooltip } from "../components/Tooltip";
import { SplashScreen } from "../components/SplashScreen"

import LogoDark from '../assets/images/ignite/dark-background-horizontal.svg';
import LogoLight from '../assets/images/ignite/dark-background-horizontal.svg';
import { IgrShapeDataSource, parseBool } from 'igniteui-react-core';

export class AppView extends React.Component<any, AppState> {

    public themes: any = {
        light: {
            name: "light",
            logo: LogoLight,
            primary:      { color: "#242241", background: "#F6F6F9" },
            tooltip:      { color: "#242241", background: "#F6F6F9" },
            toolbar:      { color: "white", background: "#585397" },
            buttons:      { color: "white", background: "#6B64B2" },
            list:         { color: "#62626E", background: "#FCFCFC" },
            listItem:     { color: "rgba(66, 68, 77, 0.8)", fontWeight: "normal"  },
            listSelected: { color: "rgba(139, 128, 255, 0.2)" },
            listValue:    { color: "#41434D", fontWeight: "bold"  },
            listFlag:     { border: "1px solid #b0b0b0" },

            buttonSelected: { color: "#41434D", background: "#E0DFF2", border: "1px solid #908EB2" },
            buttonNormal:   { color: "#41434D", background: "#FCFBFC", border: "1px solid #C7C6CC" },

            sourceInfo: { color: "#41434D" },
            infections: { color: "#7D73E6" }, // background: "#F9F8F9", borderBottom: "1px solid #C7C6CC" },
            recoveries: { color: "#22994C" }, // background: "#F9F8F9", borderBottom: "1px solid #C7C6CC" },
            deaths:     { color: "#FF3D60" }, // background: "#F9F8F9", borderBottom: "1px solid #C7C6CC" },
        },
        dark:  {
            name: "dark",
            logo: LogoDark,
            primary:      { color: "white", background: "#131416" },
            tooltip:      { color: "white", background: "rgb(33, 34, 38)" },
            toolbar:      { color: "white", background: "#3D3972" },
            buttons:      { color: "#131416", background: "#7f7aca" },
            list:         { color: "#ddddde", background: "#131416", border: "1px solid #222327" },
            listItem:     { color: "rgba(255, 255, 255, 0.7)", fontWeight: "normal"  },
            listSelected: { color: "rgba(139, 128, 255, 0.2)", fontWeight: "bold"  },
            listValue:    { color: "#ddddde", fontWeight: "bold"  },
            listFlag:     { border: "1px solid #5b5858" },

            buttonSelected: { color: "rgba(255, 255, 255, 0.7)", background: "#222327", border: "1px solid #222327" },
            buttonNormal:   { color: "rgba(255, 255, 255, 0.7)", background: "#151519", border: "1px solid #222327" },

            sourceInfo: { color: "#b8b8b9" },
            infections: { color: "#8B80FF" }, // background: "#222327", borderBottom: "1px solid #222327" },
            recoveries: { color: "#4CAF50" }, // background: "#222327", borderBottom: "1px solid #222327" },
            deaths:     { color: "#FF3D60" }, // background: "#222327", borderBottom: "1px solid #222327"},
        },
    }

    public frameInterval: number = -1;
    public chart: ChartView;
    public map: MapView;
    public lists: ListView[] = [];
    public listInfections: ListView;
    public listDeaths: ListView;
    public listsUpdating = false;

    public elementRef: Element;
    public splashScreen: SplashScreen;
    public doReportSize = true;

    constructor(props: any) {
        super(props);

        this.parseQuery();
        // this.updateQuery();

        this.onClickStart = this.onClickStart.bind(this);
        this.onClickToggleTheme = this.onClickToggleTheme.bind(this);
        this.onSliderChangeIndex = this.onSliderChangeIndex.bind(this);

        this.onCreatedChart = this.onCreatedChart.bind(this);
        this.onCreatedMap = this.onCreatedMap.bind(this);
        this.onCreatedListView = this.onCreatedListView.bind(this);
        this.onCreatedListViewInfections = this.onCreatedListViewInfections.bind(this);
        this.onCreatedListViewDeaths = this.onCreatedListViewDeaths.bind(this);
        this.onCreatedSplash = this.onCreatedSplash.bind(this);

        this.onResize = this.onResize.bind(this);

        this.onShapesLoaded = this.onShapesLoaded.bind(this);
        this.onCountrySelected = this.onCountrySelected.bind(this);
        this.onSelectedListInfections = this.onSelectedListInfections.bind(this);
        this.onSelectedListDeaths = this.onSelectedListDeaths.bind(this);

        this.onClickTogglePropStats = this.onClickTogglePropStats.bind(this);
        this.onClickToggleFlags = this.onClickToggleFlags.bind(this);
        this.onClickToggleLists = this.onClickToggleLists.bind(this);
        this.onClickToggleChart = this.onClickToggleChart.bind(this);
        this.onClickToggleMap = this.onClickToggleMap.bind(this);

        // this.onClickPlotX_totalInfections  = this.onClickPlotX_totalInfections.bind(this);
        // this.onClickPlotX_weeklyInfections = this.onClickPlotX_weeklyInfections.bind(this);
        this.onClickPlotYAxis = this.onClickPlotYAxis.bind(this);
        this.onClickPlotXAxis = this.onClickPlotXAxis.bind(this);

        this.onClickPlotInfections  = this.onClickPlotInfections.bind(this);
        this.onClickPlotDeaths = this.onClickPlotDeaths.bind(this);
        this.onClickAxisScales = this.onClickAxisScales.bind(this);

        this.updateQuery = this.updateQuery.bind(this);
    }

    public getButtonStyle(color?: string, background?: string): React.CSSProperties{
        let style = {
            color: color === undefined ? "black" : color,
            background: background === undefined ? "transparent" : background,
            marginLeft: "0.25rem", marginRight: "0.25rem",
            padding: "0.25rem",
            width: "2rem", height: "2rem",
            fontSize: "1.2rem", display: "inline-block" } as React.CSSProperties;
        return style;
    }

    public getToggleStyle(isActive: boolean, theme: any): React.CSSProperties{
        let toggleBackground = "rgba(255, 255, 255, 0.2)";
        let style = this.getButtonStyle(theme.toolbar.color);
        style.background = isActive ? toggleBackground : "transparent";
        return style;
    }

    public render() {

        // let splash = this.state.isLoading ? "app-splash-loading" : "app-splash-complete";
        let theme = this.themes[this.state.theme];

        let playStyle = this.getButtonStyle(theme.buttons.color, theme.buttons.background);

        let toggleListStyle = this.getToggleStyle(this.state.showLists, theme);
        let toggleChartStyle = this.getToggleStyle(this.state.showChart, theme);
        let toggleFlagStyle = this.getToggleStyle(this.state.showFlags, theme);
        let toggleMapStyle = this.getToggleStyle(this.state.showMap, theme);

        let toggleBackground = "rgba(255, 255, 255, 0.2)";
        let toggleThemeStyle = this.getButtonStyle(theme.toolbar.color);
        toggleThemeStyle.background = this.state.theme === "light" ? toggleBackground : "transparent";

        let toggleHelpStyle = this.getButtonStyle(theme.buttons.color);
        toggleHelpStyle.background = "transparent";
        toggleHelpStyle.color = "white";

        let togglePropStyle = this.getButtonStyle(theme.buttons.color);
        togglePropStyle.background = this.state.usePropStats ? toggleBackground : "transparent";
        togglePropStyle.fontSize = "1rem";
        togglePropStyle.fontWeight = 700;

        let toolbarStyle = { color: theme.toolbar.color, background: theme.toolbar.background } as React.CSSProperties;
        let contentStyle = { color: theme.primary.color, background: theme.primary.background } as React.CSSProperties;
        let footerStyle = { color: theme.primary.color, background: "transparent" } as React.CSSProperties;

        let tdButtonStyle = this.state.xAxisMemberPath === "totalDeaths" ? theme.buttonSelected : theme.buttonNormal;
        let tiButtonStyle = this.state.xAxisMemberPath === "totalInfections" ? theme.buttonSelected : theme.buttonNormal;

        let logButtonStyle = theme.buttonNormal;

        let tabStyle = { } as React.CSSProperties;
        tabStyle.display = (this.state.showChart || this.state.showMap) ? "flex" : "none";

        let tipBackground = theme.tooltip.background;
        let tipForeground = theme.tooltip.color;

        return (
            <div className="app-root" >
                {/* <div className="app-sidebar-menu">menu</div> */}

                <div className="app-main" style={contentStyle}>
                    <div className="app-toolbar" style={toolbarStyle}>
                        {/* <IconButton onClick={this.onClickMenu} style={menuStyle} edge="start" >
                             <IconMenu.default />
                        </IconButton> */}
                        <img className="app-toolbar-logo" src={theme.logo}/>
                        <div className="app-toolbar-title">COVID-19 Dashboard</div>

                        <Tooltip background={tipBackground} color={tipForeground}
                         message="Toggle between actual statistics or statistics divided by population in each country and 1M people. This way, statistics are normalized and countries are easier to compare." >
                            <IconButton onClick={this.onClickTogglePropStats} style={togglePropStyle} edge="start" >
                                <span className="app-toolbar-1m">1M</span>
                            </IconButton>
                        </Tooltip>
                        <Tooltip background={tipBackground} color={tipForeground}
                         message="Toggle visibility of flags of countries in React data tables / lists on left side and right side of this application" >
                            <IconButton onClick={this.onClickToggleFlags} style={toggleFlagStyle} edge="start" >
                                <IconFlag.default style={{fontSize: "1.2rem"}} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip background={tipBackground} color={tipForeground}
                         message="Toggle visibility of React data tables / lists on left side and right side in this application" >
                            <IconButton onClick={this.onClickToggleLists} style={toggleListStyle} edge="start" >
                                <IconList.default style={{fontSize: "1.2rem"}}  />
                            </IconButton>
                        </Tooltip>
                        <Tooltip background={tipBackground} color={tipForeground}
                         message="Toggle visibility of React geographic map in this application" >
                            <IconButton onClick={this.onClickToggleMap} style={toggleMapStyle} edge="start" >
                                <IconMap.default style={{fontSize: "1.2rem"}}  />
                            </IconButton>
                        </Tooltip>
                        <Tooltip background={tipBackground} color={tipForeground}
                         message="Toggle visibility of React data chart in this application" >
                            <IconButton onClick={this.onClickToggleChart} style={toggleChartStyle} edge="start" >
                                <IconChart.default style={{fontSize: "1.2rem"}}  />
                            </IconButton>
                        </Tooltip>
                        <Tooltip background={tipBackground} color={tipForeground}
                         message="Toggle between light theme and dark theme view of this application" >
                            <IconButton onClick={this.onClickToggleTheme} style={toggleThemeStyle} edge="start" >
                                <IconPalette.default style={{fontSize: "1.2rem"}}  />
                            </IconButton>
                        </Tooltip>
                        <Tooltip background={tipBackground} color={tipForeground}
                        message="Open website about React components used to build this dashboard application">
                            <IconButton onClick={this.onClickHelpButton} style={toggleHelpStyle} edge="start" >
                                <IconHelp.default style={{fontSize: "1.2rem"}}  />
                            </IconButton>
                        </Tooltip>
                    </div>

                    <div className="app-content" >
                        {this.state.showLists &&
                            <ListView
                            valuePropertyPath="totalDeaths"
                            indexPropertyPath="indexDeaths"
                            imagePropertyPath="flag"
                            codePropertyPath="iso"
                            namePropertyPath="country"
                            showFlags={this.state.showFlags}
                            showCodes={this.state.showCodes}
                            showIndex={this.state.showIndex}
                            usePropStats={this.state.usePropStats}
                            selectedItemKeys={this.state.countriesSelected}
                            ref={this.onCreatedListViewDeaths}
                            onSelected={this.onSelectedListDeaths}
                            theme={theme}
                            style={theme.list}/>
                        }

                        <div className="app-center">

                            <div className="app-button-row" style={tabStyle}>
                                <div className="app-button-tab" style={tdButtonStyle}
                                     onClick={() => this.onClickPlotDeaths()}>
                                    {/* {DataService.GetDisplayName("totalDeaths", this.state.usePropStats)} */}
                                    <span>Total Deaths</span>
                                </div>
                                <div className="app-button-tab" style={tiButtonStyle}
                                    onClick={() => this.onClickPlotInfections()}>
                                    {/* {DataService.GetDisplayName("totalInfections", this.state.usePropStats)} */}
                                    <span>Total Infections</span>
                                </div>
                            </div>

                            <div className="app-stack" style={{flexDirection: this.state.displayMode}}>
                                <MapView ref={this.onCreatedMap}
                                isVisible={this.state.showMap}
                                theme={this.state.theme}
                                usePropStats={this.state.usePropStats}
                                bubbleMemberPath={this.state.bubbleMemberPath}
                                bubbleIsLogarithmic={this.state.yAxisIsLogarithmic}
                                highlighted={this.state.highlighted}/>

                                {/* {this.state.showChart && */}
                                <ChartView ref={this.onCreatedChart}
                                isVisible={this.state.showChart}
                                style={theme.list}
                                theme={this.state.theme}
                                usePropStats={this.state.usePropStats}
                                xAxisMemberPath={this.state.xAxisMemberPath}
                                yAxisMemberPath={this.state.yAxisMemberPath}
                                xAxisIsLogarithmic={this.state.xAxisIsLogarithmic}
                                yAxisIsLogarithmic={this.state.yAxisIsLogarithmic}
                                xAxisMinimumValue={this.state.xAxisMinimumValue}
                                xAxisMaximumValue={this.state.xAxisMaximumValue}
                                yAxisMinimumValue={this.state.yAxisMinimumValue}
                                yAxisMaximumValue={this.state.yAxisMaximumValue}
                                updateInterval={this.state.updateInterval} />
                                {/* } */}
                            </div>
                        </div>

                        {this.state.showLists &&
                            <ListView
                            valuePropertyPath="totalInfections"
                            indexPropertyPath="indexInfections"
                            imagePropertyPath="flag"
                            codePropertyPath="iso"
                            namePropertyPath="country"
                            showFlags={this.state.showFlags}
                            showCodes={this.state.showCodes}
                            showIndex={this.state.showIndex}
                            usePropStats={this.state.usePropStats}
                            selectedItemKeys={this.state.countriesSelected}
                            ref={this.onCreatedListViewInfections}
                            onSelected={this.onSelectedListInfections}
                            theme={theme}
                            style={theme.list}/>
                        }
                    </div>

                    <div className="app-actionbar" style={footerStyle}>

                        <div className="app-actionbar-source-box" style={theme.sourceInfo}>
                            <div className="app-actionbar-source-link" onClick={this.onClickDataSource}>Data Source: Johns Hopkins University</div>
                            <div className="app-actionbar-source-info">Data Last Updated on {this.state.updateDate}</div>
                        </div>

                        <IconButton onClick={this.onClickStart} style={playStyle} edge="start" >
                            {this.state.updateActive ? <IconPause.default /> : <IconPlay.default />}
                        </IconButton>

                        <Slider
                          min={this.state.dataIndexMin}
                          max={this.state.dataIndexMax}
                        value={this.state.currentIndex}
                        width="100%" theme={this.state.theme}
                        onChange={this.onSliderChangeIndex} />

                        <div className="app-actionbar-date" style={theme.sourceInfo}>{this.state.currentDate}</div>

                        <div className="app-button-logScale" style={logButtonStyle}
                             onClick={() => this.onClickAxisScales()}>
                            {this.state.xAxisIsLogarithmic ? <span>Log Axes</span> : <span>Linear Axes</span>}
                        </div>

                    </div>
                </div>
                {/* isLoading={this.state.isLoading} */}
                <SplashScreen ref={this.onCreatedSplash}  />
            </div>
        );
    }

    public onCreatedChart(chart: ChartView) {
        this.chart = chart;
    }

    public onCreatedMap(map: MapView) {
        this.map = map;
    }

    public onCreatedSplash(splash: SplashScreen) {
        this.splashScreen = splash;
    }

    public onCreatedListViewInfections(listView: ListView) {
        // this.lists.push(listView);
        this.listInfections = listView;
    }
    public onCreatedListViewDeaths(listView: ListView) {
        // this.lists.push(listView);
        this.listDeaths = listView;
    }

    public onCreatedListView(listView: ListView) {
        this.lists.push(listView);
    }

    public validateSize() {
        if (window.innerWidth !== this.state.width){
            if (window.innerWidth < 950) {
                this.setState( { width: window.innerWidth, showCodes: true, showIndex: false, showFlags: false, displayMode: "column" });
            } else if (window.innerWidth < 1250) {
                this.setState( { width: window.innerWidth, showCodes: false, showIndex: false, showFlags: false, displayMode: "column" });
            } else if (window.innerWidth < 1600) {
                this.setState( { width: window.innerWidth, showCodes: false, showIndex: true, showFlags: false, displayMode: "column" });
            } else {
                this.setState( { width: window.innerWidth, showCodes: false, showIndex: true, showFlags: true, displayMode: "row" });
            }
        }
    }

    public onResize() {
        this.validateSize();
    }

    public componentDidUpdate() {
        this.validateSize();
    }

    public componentDidMount() {
        window.addEventListener("resize", this.onResize);

        const sds = new IgrShapeDataSource();
        sds.importCompleted = this.onShapesLoaded;
        sds.shapefileSource = DataService.SHAPE_URL + 'world_countries_all.shp';
        sds.databaseSource  = DataService.SHAPE_URL + 'world_countries_all.dbf';
        sds.dataBind();
    }

    public onShapesLoaded(sds: IgrShapeDataSource, e: any) {

        const shapes = sds.getPointData();
        console.log('App shapes ' + shapes.length);

        DataService.getOutbreakReport(shapes).then(outbreak => {

            // console.log("App locations: " + outbreak.locations.length);
            console.log("App countries: " + outbreak.countries.length);
            console.log("App history: " + outbreak.countries[0].history.length);

            let last = outbreak.countries[0].history.length - 1;
            this.setState( {
                countriesStats: outbreak.countries,
                dataIndexMin: 0,
                dataIndexMax: last,
                currentIndex: last,
                updateDate: outbreak.date,
                isLoading: false,
            }, () => {
                this.updateRanges(this.state.countriesSelected);
                this.updateData(last);
                this.refreshLists();
            } );
        });
    }

    public onSliderChangeIndex = (e: any) => {
        if (this.state.updateActive) { return; }

        let index = e.target.value = parseInt(e.target.value, 10);

        // console.log("App onSliderChanged " + index);
        this.updateData(index);
    }

    public onClickMenu(event: React.MouseEvent) {
        // this.toggleAnimation();
    }

    public onClickStart(event: React.MouseEvent) {
        this.toggleAnimation();
    }

    public onClickToggleTheme(event: React.MouseEvent) {

        let theme = this.state.theme === "dark" ? "light" : "dark";
        // console.log("theme " + this.state.theme  + " -> " + theme);

        this.setState( {theme: theme },
            () => { this.updateTheme(theme); } );
    }

    public updateTheme(theme: string) {

        if (this.listInfections) { this.listInfections.updateTheme(theme); }
        if (this.listDeaths) { this.listDeaths.updateTheme(theme); }
        if (this.chart) { this.chart.updateTheme(theme); }

        this.updateQuery();
    }

    public onClickToggleFlags(event: React.MouseEvent) {
        this.setState( { showFlags: !this.state.showFlags }, this.refreshAll );
    }

    public onClickToggleChart(event: React.MouseEvent) {
        this.setState( { showChart: !this.state.showChart }, this.refreshAll );
    }

    public onClickToggleMap(event: React.MouseEvent) {
        this.setState( { showMap: !this.state.showMap }, this.refreshAll );
    }

    public onClickToggleLists(event: React.MouseEvent) {
        this.setState( { showLists: !this.state.showLists },
            () => {
                this.updateQuery();
                this.refreshAll();
            } );
    }

    public onClickHelpButton(event: React.MouseEvent) {
        window.open("https://www.infragistics.com/products/ignite-ui-react/react/components/general-getting-started.html", "_blank")
    }

    public onClickDataSource(event: React.MouseEvent) {
        window.open("https://github.com/CSSEGISandData/COVID-19/blob/master/README.md", "_blank")
    }

    public onClickTogglePropStats(event: React.MouseEvent) {
        let usePropStats = !this.state.usePropStats;

        // console.log('App usePropStats ' + usePropStats.toString());
        this.setState( { usePropStats: usePropStats }, () => {
            this.updateRanges(this.state.countriesSelected, usePropStats);
            this.updateData(null, usePropStats);
        });
    }

    public onClickAxisScales(){
        this.setState( {
            xAxisIsLogarithmic: !this.state.xAxisIsLogarithmic,
            yAxisIsLogarithmic: !this.state.yAxisIsLogarithmic,
            bubbleIsLogarithmic: !this.state.bubbleIsLogarithmic,
        },
        this.updateColumns );
    }
    public onClickPlotDeaths() {
        this.setState( {
            yAxisMemberPath: "weeklyDeaths",
            xAxisMemberPath: "totalDeaths",
            bubbleMemberPath: "totalDeaths",
        },
        this.updateColumns );
    }
    public onClickPlotInfections() {
        this.setState( {
            yAxisMemberPath: "weeklyInfections",
            xAxisMemberPath: "totalInfections",
            bubbleMemberPath: "totalInfections",
        },
        this.updateColumns );
    }

    public onClickPlotXAxis(memberPath: string) {
        this.setState( {xAxisMemberPath: memberPath }, this.refreshAll );
    }
    public onClickPlotYAxis(memberPath: string) {
        this.setState( {yAxisMemberPath: memberPath }, this.refreshAll );
    }

    public onUpdateState(stateName: string, stateValue: any) {
        this.setState( {[stateName]: stateValue }, this.refreshAll );
    }

    public toggleAnimation(): void {
        this.setState({ updateActive: !this.state.updateActive });

        if (this.frameInterval >= 0) {
            window.clearInterval(this.frameInterval);
            this.frameInterval = -1;
            console.log("App animation stopped");
            this.updateQuery();

        } else {
            console.log("App animation starting");
            let index = this.state.currentIndex;
            if (index >= this.state.dataIndexMax) {
                index = 0;
            }
            this.updateData(index);
            this.frameInterval = window.setInterval(() => this.tick(), this.state.updateInterval);
        }
    }

    public tick(): void {
        let index = this.state.currentIndex + 1;
        if (index > this.state.dataIndexMax) {
            this.toggleAnimation();
        } else {
            this.updateData(index);
        }

        // let time = TimeUtils.addMinutes(this.data.flightsMinDate, index * 10);
        // // updating state and calling updateFlights
        // this.setState({ currentIndex: index, currentTime: time }, this.updateFlights);

        // this.frameCount++;
        // const timeCurrent = new Date();
        // const timeElapsed = (timeCurrent.getTime() - this.frameTime.getTime());
        // if (timeElapsed > 2000) {
        //     const fps = this.frameCount / (timeElapsed / 1000.0);
        //     this.frameTime = timeCurrent;
        //     this.frameCount = 0;
        //     this.setState({ frameInfo: "FPS: " + Math.round(fps).toString() });
        // }

        // if (index > this.data.flightsMaxSteps) {
        //     this.toggleAnimation();
        // }
    }

    public onCountrySelected = (event: any) => {

        const country = event.currentTarget.id;

        let newSelection = this.state.countriesSelected;
        // console.log('App countriesSelected "' + newSelection.join(', ') + '"');
        // console.log('App onCountrySelected "' + country + '"');
        if (newSelection.indexOf(country) >= 0) {
            // newSelection =
            newSelection.remove(country);
        } else {
            newSelection.push(country);
        }

        console.log("on Selected Country     " + newSelection.join(' '));
        this.setState({ countriesSelected: newSelection, },
            () => {
                this.listInfections.selectData(newSelection);
                this.listDeaths.selectData(newSelection);
                // this.refreshLists(newSelection)
                this.updateData(); });
    };

    public onSelectedListInfections(s: ListView, items: string[]) {
        if (this.state.updateActive) { return; }
        if (this.listsUpdating) { return; }

        this.listsUpdating = true;
        console.log("App SelectedList " + items.join(' '));

        this.setState({ countriesSelected: items, },
             () => {
                 this.listDeaths.selectData(items);
                 this.updateRanges(items);
                 this.updateData();  });
    }

    public onSelectedListDeaths(s: ListView, items: string[]) {
        if (this.state.updateActive) { return; }
        if (this.listsUpdating) { return; }

        this.listsUpdating = true;
        console.log("App SelectedList " + items.join(' '));

        this.setState({ countriesSelected: items, },
            () => {
                this.listInfections.selectData(items);
                this.updateRanges(items);
                this.updateData(); });
    }

    public updateRanges(selectedCountries: string[], usePropStats?: boolean) {

        if (usePropStats === undefined || usePropStats === null) {
            usePropStats = this.state.usePropStats;
        }

        if (selectedCountries.length === 0) { return; }

        let minTotalInfections = Number.MAX_VALUE;
        let maxTotalInfections = Number.MIN_VALUE;
        let minTotalDeaths = Number.MAX_VALUE;
        let maxTotalDeaths = Number.MIN_VALUE;

        let minWeekInfections = Number.MAX_VALUE;
        let maxWeekInfections = Number.MIN_VALUE;
        let minWeekDeaths = Number.MAX_VALUE;
        let maxWeekDeaths = Number.MIN_VALUE;

        for (let outbreak of this.state.countriesStats) {

            let last = outbreak.history.length;
            let scale = 1;
            if (usePropStats) {
                scale = outbreak.population / 1000000; // 1M
            }

            let isCountrySelected = selectedCountries.indexOf(outbreak.iso) >= 0;
            if (isCountrySelected) {
                for (let i = 0; i < last; i++) {
                    minWeekInfections = Math.min(minWeekInfections, outbreak.history[i].weeklyInfections / scale);
                    maxWeekInfections = Math.max(maxWeekInfections, outbreak.history[i].weeklyInfections / scale);
                    minWeekDeaths = Math.min(minWeekDeaths, outbreak.history[i].weeklyDeaths / scale);
                    maxWeekDeaths = Math.max(maxWeekDeaths, outbreak.history[i].weeklyDeaths / scale);

                    minTotalInfections = Math.min(minTotalInfections, outbreak.history[i].totalInfections / scale);
                    maxTotalInfections = Math.max(maxTotalInfections, outbreak.history[i].totalInfections / scale);
                    minTotalDeaths = Math.min(minTotalDeaths, outbreak.history[i].totalDeaths / scale);
                    maxTotalDeaths = Math.max(maxTotalDeaths, outbreak.history[i].totalDeaths / scale);
               }
            }
        }

        let xAxisRange: ChartAxisRange;
        let yAxisRange: ChartAxisRange;

        if (this.state.xAxisMemberPath === "totalInfections") {
            xAxisRange = ChartAxisRange.calculate(minTotalInfections, maxTotalInfections, this.state.xAxisIsLogarithmic);
            yAxisRange = ChartAxisRange.calculate(minWeekInfections,  maxWeekInfections,  this.state.yAxisIsLogarithmic);
        }  else {
            xAxisRange = ChartAxisRange.calculate(minTotalDeaths, maxTotalDeaths, this.state.xAxisIsLogarithmic);
            yAxisRange = ChartAxisRange.calculate(minWeekDeaths,  maxWeekDeaths,  this.state.yAxisIsLogarithmic);
        }

        xAxisRange.minimum = usePropStats ? 0.1 : 1;
        yAxisRange.minimum = usePropStats ? 0.1 : 1;

        this.setState({
            xAxisMinimumValue: xAxisRange.minimum,
            xAxisMaximumValue: xAxisRange.maximum,
            yAxisMinimumValue: yAxisRange.minimum,
            yAxisMaximumValue: yAxisRange.maximum,
        });
    }


    public updateData(index?: number, usePropStats?: boolean) {

        // console.log("on updateData           " + this.state.countriesSelected.join(' '));

        if (index === undefined || index === null) {
            index = this.state.currentIndex;
        }

        if (usePropStats === undefined || usePropStats === null) {
            usePropStats = this.state.usePropStats;
        }

        let thresholdProp = "totalInfections";
        let thresholdValue = 1;
        if (this.state.xAxisMemberPath === "totalInfections") {
            thresholdProp = "totalInfections";
            thresholdValue = usePropStats ? 1 : 1;
        }  else {
            thresholdProp = "totalDeaths";
            thresholdValue = usePropStats ? 1 : 1;
        }

        let date = "";
        for (let outbreak of this.state.countriesStats) {

            let scale = 1;
            if (usePropStats) {
                scale = outbreak.population / 1000000;
            }

            let last = outbreak.history.length;
            if (last > index) {
                outbreak.totalInfections = outbreak.history[index].totalInfections / scale;
                outbreak.totalRecoveries = outbreak.history[index].totalRecoveries / scale;
                outbreak.totalDeaths     = outbreak.history[index].totalDeaths / scale;

                outbreak.dailyInfections = outbreak.history[index].dailyInfections / scale;
                outbreak.dailyRecoveries = outbreak.history[index].dailyRecoveries / scale;
                outbreak.dailyDeaths     = outbreak.history[index].dailyDeaths / scale;

                outbreak.weeklyInfections = outbreak.history[index].weeklyInfections / scale;
                outbreak.weeklyRecoveries = outbreak.history[index].weeklyRecoveries / scale;
                outbreak.weeklyDeaths     = outbreak.history[index].weeklyDeaths / scale;

                if (usePropStats) {
                    outbreak.weeklyDeaths     = Math.max(0.11, outbreak.weeklyDeaths);
                    outbreak.weeklyInfections = Math.max(0.11, outbreak.weeklyInfections);
                } else {
                    outbreak.weeklyDeaths     = Math.max(1, outbreak.weeklyDeaths);
                    outbreak.weeklyInfections = Math.max(1, outbreak.weeklyInfections);
                }

                outbreak.date = outbreak.history[index].date;

                if (date === "" && outbreak.history[index].totalInfections > 1) {
                    date = outbreak.history[index].date;
                }
            }

            outbreak.progress = [];

            // updating history progress only for selected countries
            let isCountrySelected = this.state.countriesSelected.indexOf(outbreak.iso) >= 0;
            if (isCountrySelected) {
                for (let i = 0; i <= index; i++) {

                    if (outbreak.history[i][thresholdProp] >= thresholdValue) {
                        let stats = new OutbreakStats();
                        stats.date = outbreak.history[i].date;
                        stats.totalInfections  = outbreak.history[i].totalInfections / scale;
                        stats.totalRecoveries  = outbreak.history[i].totalRecoveries / scale;
                        stats.totalDeaths      = outbreak.history[i].totalDeaths / scale;
                        stats.dailyInfections  = outbreak.history[i].dailyInfections / scale;
                        stats.dailyRecoveries  = outbreak.history[i].dailyRecoveries / scale;
                        stats.dailyDeaths      = outbreak.history[i].dailyDeaths / scale;
                        stats.weeklyInfections = outbreak.history[i].weeklyInfections / scale;
                        stats.weeklyRecoveries = outbreak.history[i].weeklyRecoveries / scale;
                        stats.weeklyDeaths     = outbreak.history[i].weeklyDeaths / scale;

                        if (usePropStats) {
                            stats.weeklyDeaths     = Math.max(0.11, stats.weeklyDeaths);
                            stats.weeklyInfections = Math.max(0.11, stats.weeklyInfections);
                        } else {
                            stats.weeklyDeaths     = Math.max(1, stats.weeklyDeaths);
                            stats.weeklyInfections = Math.max(1, stats.weeklyInfections);
                        }
                        outbreak.progress.push(stats);
                    }
                }
            }
        }

        // console.log('App updateData ' + index + '  ' + usePropStats + '  ' + date);

        this.setState({
            currentIndex: index,
            currentDate: date,
            countriesStats: this.state.countriesStats
            }, this.refreshAll );
    }

    public updateColumns() {
        if (this.chart) {
            this.chart.updateColumns();
        }
        if (this.map) {
            this.map.updateColumns();
        }
        this.updateRanges(this.state.countriesSelected);
        this.updateData();
        this.updateQuery();
    }

    public refreshLists(newItems?: string[]) {
        if (newItems === undefined) {
            newItems = this.state.countriesSelected;
        }

        // console.log("App refreshLists " + newItems.join(" "));

        if (this.listDeaths) {
            this.listDeaths.selectData(newItems);
        }
        if (this.listInfections) {
            this.listInfections.selectData(newItems);
        }
    }

    public refreshAll() {
        if (this.chart) {
            this.chart.updateData(this.state.countriesStats, this.state.countriesSelected, this.state.currentDate);
        }

        if (this.map) {
            this.map.updateData(this.state.countriesStats, this.state.countriesSelected);
        }

        if (this.listDeaths) {
            this.listDeaths.updateData(this.state.countriesStats, this.state.countriesSelected, this.state.showFlags);
        }
        if (this.listInfections) {
            this.listInfections.updateData(this.state.countriesStats, this.state.countriesSelected, this.state.showFlags);
        }

        this.listsUpdating = false;

        if (!this.state.updateActive) {
            this.updateQuery();
        }
    }

    public parseQuery() {
        // http://localhost:3500/?prop=false&log=true&show=totalInfections&items=USA+CHN+POL+ITA+KOR+URY

        let query = this.props.location;
        let parameters = Locations.parse(query);

        console.log("DV parse query.pathname '" + query.pathname + "'");
        console.log("DV parse query.search '" + query.search + "'");

        // let index = parameters.index !== undefined ? parseInt(parameters.index, 10) : 60;
        let usePropStats = parameters["1m"] !== undefined ? parseBool(parameters["1m"]) : false;
        let logScale = parameters.log !== undefined ? parseBool(parameters.log) : true;
        let showMap = parameters.map !== undefined ? parseBool(parameters.map) : true;
        let showChart = parameters.chart !== undefined ? parseBool(parameters.chart) : true;
        let showLists = parameters.list !== undefined ? parseBool(parameters.list) : true;
        let showFlags = parameters.flags !== undefined ? parseBool(parameters.flags) : window.innerWidth >= 1600;
        let themeName = parameters.theme !== undefined ? parameters.theme : "dark";

        let xAxisMemberPath = parameters.show !== undefined ? parameters.show : "totalInfections";
        xAxisMemberPath = xAxisMemberPath === "deaths" ? "totalDeaths" : "totalInfections";
        let yAxisMemberPath = xAxisMemberPath === "totalDeaths" ? "weeklyDeaths" : "weeklyInfections";

        let selection = ["USA", "RUS", "GBR", "ITA", "KOR", "CHN"];
        if (parameters.items !== undefined) {
            let items = parameters.items.toString();
            selection = items.split("+");
        }

        this.state = {
            theme: themeName,
            updateInterval: 200,
            updateActive: false,
            updateDate: '',
            dataIndexMin: 0,
            dataIndexMax: 200,
            currentIndex: 0,
            currentDate: "",
            isLoading: true,

            frameInfo: "",
            countriesStats: [],
            countriesSelected: selection,
            highlighted: [],
            usePropStats: usePropStats,
            showChart: showChart,
            showMap: showMap,
            showLists: showLists,
            showFlags: showFlags,
            showCodes: true,
            showIndex: false,
            width: 0,

            bubbleMemberPath: xAxisMemberPath,
            bubbleIsLogarithmic: logScale,
            xAxisIsLogarithmic: logScale,
            yAxisIsLogarithmic: logScale,
            yAxisMemberPath: yAxisMemberPath,
            xAxisMemberPath: xAxisMemberPath,
            xAxisMinimumValue: 1,
            xAxisMaximumValue: 10000000,
            yAxisMinimumValue: 1,
            yAxisMaximumValue: 10000,
        };
    }

    public updateQuery() {

        let parameters = [];

        // parameters.push("index=" + this.state.currentIndex);
        parameters.push("theme=" + this.state.theme);
        parameters.push("1m=" + this.state.usePropStats);
        parameters.push("map=" + this.state.showMap);
        parameters.push("chart=" + this.state.showChart);
        parameters.push("list=" + this.state.showLists);
        parameters.push("flags=" + this.state.showFlags);
        parameters.push("log=" + this.state.xAxisIsLogarithmic);
        parameters.push("show=" + this.state.xAxisMemberPath.replaceAll("total", "").toLowerCase());
        if (this.state.countriesSelected.length > 0) {
            parameters.push("items=" + this.state.countriesSelected.join("+"));
        }

        // parameters.push("index=" + this.state.currentIndex);
        // http://localhost:3500/?prop=false&log=true&show=totalInfections&items=USA+CHN+POL+ITA+KOR+URY

        const query = "?" + parameters.join("&");
        if (parameters.length !== 0 && query !== window.location.search) {
            // console.log("DV query " + query);
            this.props.history.push(`${query}`);
        }

    }

}

