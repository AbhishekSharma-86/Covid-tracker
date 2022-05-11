
import { DataTemplateRenderInfo } from 'igniteui-react-core';
// import AirplaneImage from '../assets/airplane.png';

export default class MapUtils {

    public static renderCircle(render: DataTemplateRenderInfo, visuals: any) {

        // if (visuals.hidden) { return; }

        const ctx = render.context as CanvasRenderingContext2D;
        const x = render.xPosition;
        const y = render.yPosition;

        if (render.isHitTestRender) {
            // Rough marker rectangle size calculation
            let half = visuals.size / 2;
            ctx.fillStyle = render.data.actualItemBrush.fill;
            ctx.fillRect(x - half, y - half, visuals.size, visuals.size);
        } else {
            ctx.beginPath();
            ctx.arc(x, y, visuals.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = visuals.fillStyle;
            ctx.fill();
            ctx.lineWidth = visuals.strokeWidth;
            ctx.strokeStyle = visuals.strokeStyle;
            ctx.stroke();
            // ctx.closePath();
        }
    }

    public static renderTriangle(render: DataTemplateRenderInfo, size: number, angle?: number) {
        const ctx = render.context; // as CanvasRenderingContext2D;
        const x = render.xPosition;
        const y = render.yPosition;
        const radius = size / 2.0;
        const offset = 10;
        ctx.beginPath();
        // ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.moveTo(offset + radius, offset);
        ctx.lineTo(offset, offset + size);
        ctx.lineTo(offset + size, offset + size);
        ctx.closePath();

        ctx.fillStyle = "rgba(255,0,0,0.2)";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255,0,0,0.7)";
        ctx.stroke();
    }

    public static renderImage(render: DataTemplateRenderInfo, size: number) {
        const ctx = render.context as CanvasRenderingContext2D;
        const data = render.data;
        const radius = size / 2.0;
        const x = render.xPosition - radius;
        const y = render.yPosition - radius;
        const img = document.createElement("img");
        // const img = new HTMLImageElement();
        // img.src = AirplaneImage;

        // console.log("rendering marker1 " + data.item.City);
        // ctx.clearRect(0,0,ctx.width,ctx.height);

        // ctx.save();
        // ctx.translate(x,y);

        ctx.rotate( (Math.PI / 180) * 45);
        ctx.globalAlpha = 0.5;
        ctx.drawImage(img, x, y, size, size);

        // ctx.restore();
        // img.onload = function() {
        //         // ctx.drawImage(img);
        //         ctx.globalAlpha = 0.5
        //         // ctx.drawImage(img, x, y);
        //         // ctx.rotate( (Math.PI / 180) * 45);

        //         ctx.drawImage(img, x, y, size, size);
        //         console.log("rendering marker2 " + data.item.City);
        // }

    }

    public static renderAirplane(render: DataTemplateRenderInfo, size: number) {

        const ctx = render.context; // as CanvasRenderingContext2D;
        const x = render.xPosition;
        const y = render.yPosition;
        const radius = size / 2.0;
        const scale = size / 400;

        // ctx.miterLimit=4;
        // ctx.font="15px / 21.4286px ''";
        // ctx.font="   15px ";
        // ctx.scale(0.2,0.2);
        // ctx.save();
        // ctx.font="   15px ";

        // ctx.translate(-147.06733,-109.44716);
        // ctx.save();
        // ctx.strokeStyle="rgba(0,0,0,0)";
        // ctx.font="   15px ";

        ctx.beginPath();
        ctx.moveTo(157.98695,184.38488);
        ctx.lineTo(173.37483,168.20017);
        ctx.bezierCurveTo(182.38616,159.18884,197.56012,162.31477,197.56012,162.31477);
        ctx.lineTo(242.58958,168.47612);
        ctx.lineTo(265.39575,146.16045);
        ctx.bezierCurveTo(277.41087,134.35989,288.26269,152.4142,283.54247,158.63631);
        ctx.lineTo(271.83305,172.24635);
        ctx.lineTo(320.32641,181.22794);
        ctx.lineTo(336.78707,162.03882);
        ctx.bezierCurveTo(354.38063,141.01237,367.47041,159.95529,359.53185,171.11218);
        ctx.lineTo(348.89521,184.56906);
        ctx.lineTo(421.75804,194.07153);
        ctx.bezierCurveTo(484.40828,133.78139,509.98537,108.77262,526.46939,123.63021);
        ctx.bezierCurveTo(543.05967,138.5836,513.71315,168.38877,456.64135,227.17701);
        ctx.lineTo(467.00204,302.24678);
        ctx.lineTo(482.26714,289.52597);
        ctx.bezierCurveTo(491.27847,282.01653,507.27901,294.06392,490.75822,309.72648);
        ctx.lineTo(469.76089,329.52825);
        ctx.lineTo(478.61969,378.66527);
        ctx.lineTo(491.73923,368.58052);
        ctx.bezierCurveTo(503.32523,359.35463,517.39476,371.55518,501.7322,388.29052);
        ctx.lineTo(480.88803,409.28786);
        ctx.bezierCurveTo(480.02981,409.93153,487.69305,452.38631,487.69305,452.38631);
        ctx.bezierCurveTo(492.41327,473.19821,480.67347,480.80195,480.67347,480.80195);
        ctx.lineTo(466.35838,493.27782);
        ctx.lineTo(411.97962,339.67439);
        ctx.bezierCurveTo(407.47395,326.15738,396.0546,311.47862,376.97351,313.22076);
        ctx.bezierCurveTo(366.8894,314.29354,341.41552,331.49026,337.98263,335.56682);
        ctx.lineTo(279.00579,392.27531);
        ctx.bezierCurveTo(277.5039,393.34809,288.07915,465.99635,288.07915,465.99635);
        ctx.bezierCurveTo(288.07915,468.14191,269.38054,492.66454,269.38054,492.66454);
        ctx.lineTo(232.01433,426.14725);
        ctx.lineTo(213.56128,434.7301);
        ctx.lineTo(224.35108,417.93211);
        ctx.lineTo(157.06733,379.9526);
        ctx.lineTo(182.29502,361.49956);
        ctx.bezierCurveTo(194.31014,364.28878,257.3034,371.36975,258.59073,370.72608);
        ctx.bezierCurveTo(258.59073,370.72608,309.88762,319.85344,312.81633,316.77643);
        ctx.bezierCurveTo(329.76623,298.96831,335.46935,292.31456,338.04402,283.51778);
        ctx.bezierCurveTo(340.6208,274.71377,336.23117,261.81195,309.62838,245.4769);
        ctx.bezierCurveTo(272.93937,222.94855,157.98695,184.38488,157.98695,184.38488);
        // ctx.closePath();
        ctx.scale(scale,scale);

        ctx.fillStyle = "rgba(255,0,0,0.2)";
        ctx.fill();

        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255,0,0,0.7)";
        ctx.stroke();

        // http://demo.qunee.com/svg2canvas/
    }

}


// http://jsfiddle.net/scollins/xnn7a42j/

// <script>
// drawCircle();
// </script>

// function drawCircle() {
//     var c = document.getElementById("myCanvas");
//     var R = c.width/2;
//     var ctx = c.getContext("2d");
//    var size = 100;
//    var half = size / 2;
//    var offset = 10;

//    /* ctx.rotate( (Math.PI / 180) * 44) */;  //rotate 25 degrees.
//      ctx.beginPath();
//    ctx.moveTo(offset + half, offset);
//    ctx.lineTo(offset, offset + size);
//    ctx.lineTo(offset + size, offset + size);
//     ctx.closePath();

//    // the outline
//    ctx.lineWidth = 4;
//    ctx.strokeStyle = '#666666';
//    ctx.stroke();

//    // the fill color
//    ctx.fillStyle = "#FFCC00";
//    ctx.fill();

//    }