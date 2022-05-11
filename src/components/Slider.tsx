
import * as React from "react";
import "./Slider.css";

export class Slider extends React.Component<any, any> {

    public onChange?: React.EventHandler<React.ChangeEvent<HTMLElement>>;
    // public onClick?: React.EventHandler<React.MouseEvent<HTMLElement>>;

    constructor(props: any) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);

        const min = this.props.min === undefined ? 0 : this.props.min;
        const max = this.props.max === undefined ? 100 : this.props.max;
        const value = this.props.value === undefined ? 0 : this.props.value;
        // const width = this.props.width === undefined ? "150px" : this.props.width;
        this.state = {
            value: value,
            min: min,
            max: max,
            // width: width
        };
    }

    render() {
        // const units = this.props.units === undefined ? "" : this.props.units;
        const value = this.props.value === undefined ? 0 : this.props.value;
        const min = this.props.min === undefined ? 0 : this.props.min;
        const max = this.props.max === undefined ? 100 : this.props.max;
        const width = this.props.width === undefined ? "100%" : this.props.width;

        const theme = this.props.theme === undefined ? "light" : this.props.theme;
        const sliderClass = "app-slider-" + theme
        const sliderStyle = { width: width } as React.CSSProperties;

        return (
            <div className="app-slider-container">
                <input type="range" style={sliderStyle}
                    className={sliderClass} id="myRange"
                    min={min}
                    max={max}
                    value={value}
                    onChange={this.onValueChange}/>
                {/* <div className="app-slider-value">{value} {units}</div> */}
            </div>
        );
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
