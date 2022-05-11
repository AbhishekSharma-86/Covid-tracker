
import * as React from "react";
import "./LinearSlider.css";

import { IgrValueBrushScale } from 'igniteui-react-charts';
import { IgrLinearGauge } from 'igniteui-react-gauges';
import { IgrLinearGaugeModule } from 'igniteui-react-gauges';
import { IgrLinearGraphRange } from 'igniteui-react-gauges';
import { IgrFormatLinearGraphLabelEventArgs } from 'igniteui-react-gauges';

IgrLinearGaugeModule.register();

export class LinearSlider extends React.Component<any, any> {

    public themes: any = {
        light: {
            name: "light",
            track:   { color: "#6B64B2", background: "#6B64B2" },
            thumb:   { color: "#6B64B2", background: "#FFFFFF" },
            label:   { color: "#41434d",   },
            ticks:   { color: "#41434d",   },
        },
        dark:  {
            name: "dark",
            track:   { color: "#9991FF", background: "#131416" },
            thumb:   { color: "#9991FF", background: "#000000" },
            label:   { color: "#a2a2a2",   },
            ticks:   { color: "#a2a2a2",   },
        },
    }

    public onChange?: React.EventHandler<React.ChangeEvent<HTMLElement>>;
    // public onClick?: React.EventHandler<React.MouseEvent<HTMLElement>>;

    formatLabel: (e: IgrFormatLinearGraphLabelEventArgs) => void;

    constructor(props: any) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.onOutputClick = this.onOutputClick.bind(this);
        this.onFormat = this.onFormat.bind(this);

        const min = this.props.min === undefined ? 0 : this.props.min;
        const max = this.props.max === undefined ? 100 : this.props.max;
        const value = this.props.value === undefined ? 0 : this.props.value;

        // const brushScale = new IgrValueBrushScale({});
        // brushScale.brushes = ["#FFFFFF", "#b56ffc"];
        // brushScale.minimumValue = 10;
        // brushScale.maximumValue = 60;
        // brushScale.getBrush(value_of_field_in_a_record);

        this.state = {
            theme: props.theme,
            value: value,
            min: min,
            max: max,

            needleStrokeThickness:2.5,
            needleBreadth:1,
            needleInnerExtent:0.35,
            needleOuterExtent:0.65,
            needleOuterPointExtent:0.75,
            needleInnerPointExtent:0.35,
            needleOuterPointWidth:0.25,
            needleInnerPointWidth:0,
            needleOuterBaseWidth:0,
            needleInnerBaseWidth:0,
        };
    }

    onFormat(s: IgrLinearGauge, e: IgrFormatLinearGraphLabelEventArgs) {
        if (this.formatLabel !== undefined) {
            this.formatLabel(e);
        } else {
            e.label = e.value + "w";
        }
    }

    render() {

        // const units = this.props.units === undefined ? "" : this.props.units;
        const min = this.props.min === undefined ? 0 : this.props.min;
        const max = this.props.max === undefined ? 40 : this.props.max;
        const value = this.props.value === undefined ? 0 : this.props.value;
        const interval = this.props.interval === undefined ? (max - min) / 4 : this.props.interval;

        const width = this.props.width === undefined ? "100%" : this.props.width;

        const themeName = this.props.theme === undefined ? "light" : this.props.theme;
        let theme = this.themes[themeName];

        const sliderClass = "app-slider-" + themeName
        const sliderStyle = { width: width } as React.CSSProperties;

        return (
            <div className="app-slider-container">
                {/* <input type="range" style={sliderStyle}
                    className={sliderClass} id="myRange"
                    min={min}
                    max={max}
                    value={value}
                    onChange={this.onValueChange}/>
                <div className="app-slider-value">{value} {units}</div> */}
                <div className="app-slider">
                    <IgrLinearGauge
                    height="100%"
                    width="100%"
                    minimumValue={min} value={value}
                    maximumValue={max} interval={interval}

                    font="11px Verdana"
                    fontBrush={theme.label.color}
                    formatLabel={this.onFormat}
                    ticksPreTerminal={0}
                    ticksPostInitial={0}
                    tickStrokeThickness={1}
                    tickStartExtent={0.3}
                    tickEndExtent={0.05}
                    tickBrush={theme.ticks.color}
                    minorTickBrush={theme.ticks.color}
                    minorTickCount={9}
                    minorTickStartExtent={0.15}
                    minorTickEndExtent={0.05}
                    minorTickStrokeThickness={1}
                    backingBrush="Transparent"
                    backingOutline="Transparent"

                    isNeedleDraggingEnabled={true}
                    needleShape="Custom"
                    needleBrush={theme.thumb.background}
                    needleOutline={theme.thumb.color}
                    needleStrokeThickness={this.state.needleStrokeThickness}
                    needleBreadth={this.state.needleBreadth}
                    needleInnerExtent={this.state.needleInnerExtent}
                    needleOuterExtent={this.state.needleOuterExtent}
                    needleOuterPointExtent={this.state.needleOuterPointExtent}
                    needleInnerPointExtent={this.state.needleInnerPointExtent}

                    needleOuterPointWidth={this.state.needleOuterPointWidth}
                    needleInnerPointWidth={this.state.needleInnerPointWidth}

                    needleOuterBaseWidth={this.state.needleOuterBaseWidth}
                    needleInnerBaseWidth={this.state.needleInnerBaseWidth} >

                    {/* rangeBrushes="#a4bd29"
                    rangeOutlines="#a4bd29"  */}
                    <IgrLinearGraphRange name="range1"
                        startValue={min} endValue={max}
                        brush={theme.track.background}
                        outline={theme.track.color}
                        innerStartExtent={0.5} innerEndExtent={0.5}
                        outerStartExtent={0.6} outerEndExtent={0.6} />
                </IgrLinearGauge>

                </div>

                <div className="app-slider-settings">
                    <div className="app-slider-settings-row">
                        <input type="range" style={sliderStyle}
                        className={sliderClass}
                        min={0} max={2} step={0.05}
                        defaultValue={this.state.needleOuterBaseWidth}
                        onChange={(e) => this.setState( {needleOuterBaseWidth: e.target.value })} />
                        <div className="app-slider-settings-value">{this.state.needleOuterBaseWidth}</div>
                        <div className="app-slider-settings-label">needleOuterBaseWidth</div>
                    </div>
                    <div className="app-slider-settings-row">
                        <input type="range" style={sliderStyle}
                        className={sliderClass}
                        min={0} max={2} step={0.05}
                        defaultValue={this.state.needleInnerBaseWidth}
                        onChange={(e) => this.setState( {needleInnerBaseWidth: e.target.value })} />
                        <div className="app-slider-settings-value">{this.state.needleInnerBaseWidth}</div>
                        <div className="app-slider-settings-label">needleInnerBaseWidth</div>
                    </div>

                    <div className="app-slider-settings-row">
                        <input type="range" style={sliderStyle}
                        className={sliderClass}
                        min={0} max={2} step={0.05}
                        defaultValue={this.state.needleOuterPointWidth}
                        onChange={(e) => this.setState( {needleOuterPointWidth: e.target.value })} />
                        <div className="app-slider-settings-value">{this.state.needleOuterPointWidth}</div>
                        <div className="app-slider-settings-label">needleOuterPointWidth</div>
                    </div>
                    <div className="app-slider-settings-row">
                        <input type="range" style={sliderStyle}
                        className={sliderClass}
                        min={0} max={2} step={0.05}
                        defaultValue={this.state.needleInnerPointWidth}
                        onChange={(e) => this.setState( {needleInnerPointWidth: e.target.value })} />
                        <div className="app-slider-settings-value">{this.state.needleInnerPointWidth}</div>
                        <div className="app-slider-settings-label">needleInnerPointWidth</div>
                    </div>

                    <div className="app-slider-settings-row">
                        <input type="range" style={sliderStyle}
                        className={sliderClass}
                        min={0} max={2} step={0.05}
                        defaultValue={this.state.needleOuterPointExtent}
                        onChange={(e) => this.setState( {needleOuterPointExtent: e.target.value })} />
                        <div className="app-slider-settings-value">{this.state.needleOuterPointExtent}</div>
                        <div className="app-slider-settings-label">needleOuterPointExtent</div>
                    </div>
                    <div className="app-slider-settings-row">
                        <input type="range" style={sliderStyle}
                        className={sliderClass}
                        min={0} max={2} step={0.05}
                        defaultValue={this.state.needleInnerPointExtent}
                        onChange={(e) => this.setState( {needleInnerPointExtent: e.target.value })} />
                        <div className="app-slider-settings-value">{this.state.needleInnerPointExtent}</div>
                        <div className="app-slider-settings-label">needleInnerPointExtent</div>
                    </div>

                    <div className="app-slider-settings-row">
                        <input type="range" style={sliderStyle}
                        className={sliderClass}
                        min={0} max={2} step={0.05}
                        defaultValue={this.state.needleInnerExtent}
                        onChange={(e) => this.setState( {needleInnerExtent: e.target.value })} />
                        <div className="app-slider-settings-value">{this.state.needleInnerExtent}</div>
                        <div className="app-slider-settings-label">needleInnerExtent</div>
                    </div>
                    <div className="app-slider-settings-row">
                        <input type="range" style={sliderStyle}
                        className={sliderClass}
                        min={0} max={2} step={0.05}
                        defaultValue={this.state.needleOuterExtent}
                        onChange={(e) => this.setState( {needleOuterExtent: e.target.value })} />
                        <div className="app-slider-settings-value">{this.state.needleOuterExtent}</div>
                        <div className="app-slider-settings-label">needleOuterExtent</div>
                    </div>

                    <div className="app-slider-settings-row">
                        <input type="range" style={sliderStyle}
                        className={sliderClass}
                        min={0} max={15} step={0.5}
                        defaultValue={this.state.needleStrokeThickness}
                        onChange={(e) => this.setState( {needleStrokeThickness: e.target.value })} />
                        <div className="app-slider-settings-value">{this.state.needleStrokeThickness}</div>
                        <div className="app-slider-settings-label">Thickness</div>
                    </div>
                    <div className="app-slider-settings-row">
                        <input type="range" style={sliderStyle}
                        className={sliderClass}
                        min={0} max={2} step={0.5}
                        defaultValue={this.state.needleBreadth}
                        onChange={(e) => this.setState( {needleBreadth: e.target.value })} />
                        <div className="app-slider-settings-value">{this.state.needleBreadth}</div>
                        <div className="app-slider-settings-label">Breadth</div>
                    </div>
                    <button onClick={this.onOutputClick}>Output</button>
                </div>
            </div>
        );
    }

    public onOutputClick = (e: any) => {

        let str = "";
        str += "needleStrokeThickness={" + this.state.needleStrokeThickness + "} \n";
        str += "needleBreadth={" + this.state.needleBreadth + "} \n";
        str += "needleInnerExtent={" + this.state.needleInnerExtent + "} \n";
        str += "needleOuterExtent={" + this.state.needleOuterExtent + "} \n";
        str += "needleOuterPointExtent={" + this.state.needleOuterPointExtent + "} \n";
        str += "needleInnerPointExtent={" + this.state.needleInnerPointExtent + "} \n";
        str += "needleOuterPointWidth={" + this.state.needleOuterPointWidth + "} \n";
        str += "needleInnerPointWidth={" + this.state.needleInnerPointWidth + "} \n";
        str += "needleOuterBaseWidth={" + this.state.needleOuterBaseWidth + "} \n";
        str += "needleInnerBaseWidth={" + this.state.needleInnerBaseWidth + "} \n";
        console.log("\n" + str + "\n");
        str = str.replaceAll("={", ":").replaceAll("}", ",")
        console.log("\n" + str + "\n");
    }

    public onUpdate(stateName: string, e: any) {
        this.setState( {[stateName]: e.target.value } );
    }

    public onValueChange = (e: any) => {
        let precision = this.props.precision === undefined ? 10 : this.props.precision;
        let value = e.target.value = parseInt(e.target.value, precision);
        // console.log("Slider onValueChange " + e.target.value);

        this.setState( { value: value } );

        if (this.props.onChange !== undefined) {
            // console.log("onSlider onChange" + crr);
            this.props.onChange(e);
        }
    }
}
