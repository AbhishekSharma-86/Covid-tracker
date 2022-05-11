
import { DataService } from "../data/DataService";

export class ChartAxisRange {

    public static calculate(min: number, max: number, isLogarithmic: boolean): ChartAxisRange {

        let axis = new ChartAxisRange();

        if (isLogarithmic) {
            let minLog = Math.log10(min);
            let maxLog = Math.log10(max);

            if (!Number.isFinite(minLog)) { minLog = 0.1; }
            // console.log("minLog " + minLog);
            // console.log("maxLog " + maxLog);

            axis.minimum = Math.pow(10, Math.floor(minLog));
            axis.maximum = Math.pow(10, Math.ceil(maxLog));
            // if (axis.minimum <= 1) {
            //     axis.minimum = 0.1;
            // }
            // axis.minimum = Math.max(0.1, axis.minimum);
            // console.log("minAxis " + DataService.abbreviate(axis.minimum));
            // console.log("maxAxis " + DataService.abbreviate(axis.maximum));

        } else {
            let span = max - min;
            let step = Math.pow(10.0, Math.floor(Math.log10(span)) - 1.0);

            // console.log("___RangeInfections " + span);
            // console.log("___Step_Infections " + step);

            let ceil = Math.ceil(max / step);

            axis.minimum = step * Math.floor(min / step);
            axis.maximum = step * ceil;
            // console.log("minAxis " + DataService.abbreviate(axis.minimum));
            // console.log("maxAxis " + DataService.abbreviate(axis.maximum));
        }
        return axis;
    }

    public minimum: number;
    public maximum: number;
}