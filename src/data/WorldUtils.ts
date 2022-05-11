
// import * as World from "./WorldModels";

export default class WorldUtils {

    // public static AirplaneSpeed: number = 850; // in km/h
    // public static EarthRadius: number = 6371.0; // in km

    // /** calculate geo-paths between two locations using great circle formula */
    // public static getPath(flight: World.Flight): any[][] {
    //     // let interval = this.AirplaneSpeed * 0.2;
    //     // let interval = this.AirplaneSpeed * (1 / 3);
    //     let interval = this.AirplaneSpeed / 2;
    //     // let interval = this.AirplaneSpeed;
    //     let paths: any[] = [[]];
    //     let pathID = 0;
    //     let origin = flight.origin;
    //     let dest = flight.dest;

    //     let distance = flight.distance;
    //     if (distance === undefined) {
    //         distance = this.getDistance(origin, dest);
    //         console.log("getPath " + flight.origin.name + " " + distance);
    //     }

    //     if (distance <= interval) {
    //         paths[pathID].push({ x: origin.x, y: origin.y });
    //         paths[pathID].push({ x: dest.x, y: dest.y });
    //     } else {
    //         let current = origin;
    //         let previous = origin;

    //         for (let dist = interval; dist <= distance; dist += interval)
    //         {
    //             previous = current
    //             paths[pathID].push({ x: current.x, y: current.y });

    //             let bearing = this.getBearing(current, dest);
    //             current = this.getDestination(current, bearing, interval);
    //             // ensure geo-path wrap around the world through a location on the new date-line
    //             if (previous.x > 150 && current.x < -150) {
    //                 paths[pathID].push({ x: 180, y: current.y });
    //                 paths.push([]);
    //                 pathID++
    //                 current = { x: -180, y: current.y }
    //             } else if (previous.x < -150 && current.x > 150) {
    //                 paths[pathID].push({ x: -180, y: current.y });
    //                 paths.push([]);
    //                 pathID++
    //                 current = { x: 180, y: current.y }
    //             }
    //         }
    //         paths[pathID].push({ x: dest.x, y: dest.y });
    //     }

    //     // let pointsCount = 0;
    //     // for (const path of paths) {
    //     //     pointsCount += path.length;
    //     // }
    //     // console.log("getPath " + flight.origin.name + " " + pointsCount);
    //     return paths;
    // }

    // /** calculate bearing angle between two locations */
    // public static getBearing(origin: World.Location, dest: World.Location) : number
    // {
    //     let start = this.toRadianLocation(origin);
    //     let stop = this.toRadianLocation(dest);

    //     let range = (stop.x - start.x);
    //     let y = Math.sin(range) * Math.cos(stop.y);
    //     let x = Math.cos(start.y) * Math.sin(stop.y) -
    //             Math.sin(start.y) * Math.cos(stop.y) * Math.cos(range);
    //     let angle = Math.atan2(y, x);
    //     return this.toDegreesNormalized(angle);
    // }

    // /** calculate destination for origin location and travel distance */
    // public static getDestination(origin: World.Location, bearing: number, distance: number): World.Location {

    //     // const originRadX = this.toRadians(origin.x);
    //     // const originRadY = this.toRadians(origin.y);
    //     const start = this.toRadianLocation(origin);
    //     bearing = this.toRadians(bearing);
    //     distance = distance / this.EarthRadius; // angular distance in radians

    //     let lat = Math.asin(Math.sin(start.y) * Math.cos(distance) +
    //               Math.cos(start.y) * Math.sin(distance) * Math.cos(bearing));

    //     let x = Math.sin(bearing) * Math.sin(distance) * Math.cos(start.y);
    //     let y = Math.cos(distance) - Math.sin(start.y) * Math.sin(start.y);
    //     let lon = start.x + Math.atan2(x, y);
    //     // normalize lon to coordinate between -180º and +180º
    //     lon = (lon + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

    //     return { x: this.toDegrees(lon), y: this.toDegrees(lat) };
    // }

    // /** calculate distance between two locations */
    // public static getDistance(origin: World.Location, dest: World.Location) : number {
    //     const start = this.toRadianLocation(origin);
    //     const stop = this.toRadianLocation(dest);

    //     // const originRadX = this.toRadians(origin.x);
    //     // const originRadY = this.toRadians(origin.y);

    //     // const destRadX = this.toRadians(dest.x);
    //     // const destRadY = this.toRadians(dest.y);

    //     let sinProd = Math.sin(start.y) * Math.sin(stop.y);
    //     let cosProd = Math.cos(start.y) * Math.cos(stop.y);
    //     let lonDelta = (stop.x - start.x);

    //     let angle = Math.acos(sinProd + cosProd * Math.cos(lonDelta));
    //     let distance = angle * this.EarthRadius;
    //     return distance; // in km
    // }

    // public static toRadianLocation(geoPoint: World.Location) : World.Location {
    //     // let x = this.toRadians(geoPoint.x);
    //     // let y = this.toRadians(geoPoint.y);
    //     return {
    //         x: this.toRadians(geoPoint.x),
    //         y: this.toRadians(geoPoint.y)
    //     };
    // }

    public static toRadians(degrees: number) : number
    {
        return degrees * Math.PI / 180;
    }

    public static toDegrees(radians: number) : number {
        return (radians * 180.0 / Math.PI);
    }

    public static toDegreesNormalized(radians: number) : number
    {
        let degrees = this.toDegrees(radians);
        degrees = (degrees + 360) % 360;
        return degrees;
    }

    /** converts latitude coordinate to a string */
    public static toStringLat(latitude: number) : string {
        let str = Math.abs(latitude).toFixed(1) + "°";
        return latitude > 0 ? str + "N" : str + "S";
    }

    /** converts longitude coordinate to a string */
    public static toStringLon(coordinate: number) : string {
        let val = Math.abs(coordinate);
        let str = val < 100 ? val.toFixed(1) : val.toFixed(0);
        return coordinate > 0 ? str + "°E" : str + "°W";
    }

    /** converts a number to abbreviated string, e.g. 1000 -> 1K */
    public static toStringAbbr(value: number) : string {
        if (value > 1000000000000) {
            return (value / 1000000000000).toFixed(1) + "T"
        } else if (value > 1000000000) {
            return (value / 1000000000).toFixed(1) + "B"
        } else if (value > 1000000) {
            return (value / 1000000).toFixed(1) + "M"
        } else if (value > 1000) {
            return (value / 1000).toFixed(1) + "K"
        }
        return value.toFixed(0);
    }

    // /** gets bounding rectangle for all specified geographic locations */
    // public static getBounds(locations: World.Location[]) : any {
    //     let minLat = 90;
    //     let maxLat = -90;
    //     let minLon = 180;
    //     let maxLon = -180;

    //     for (const location of locations) {
    //         const crrLon = location.x;
    //         if (!Number.isNaN(crrLon)) {
    //             minLon = Math.min(minLon, crrLon);
    //             maxLon = Math.max(maxLon, crrLon);
    //         }

    //         const crrLat = location.y;
    //         if (!Number.isNaN(crrLat)) {
    //             minLat = Math.min(minLat, crrLat);
    //             maxLat = Math.max(maxLat, crrLat);
    //         }
    //     }

    //     const geoBounds = {
    //         left: minLon,
    //         top:  minLat,
    //         width: Math.abs(maxLon - minLon),
    //         height: Math.abs(maxLat - minLat)
    //     };
    //     return geoBounds;
    // }



}
