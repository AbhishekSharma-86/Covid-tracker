export class TimeUtils {

    public static log(msg: string) {
        let date = new Date();
        let hh = date.getHours();
        let mm = date.getMinutes();
        let ss = date.getSeconds();
        console.log(hh + ':' +  mm + ':' + ss + ' ' +  msg);
    }

    public static addDays(date: Date, days: number): Date {
        return this.addHours(date, days * 24);
    }

    public static addHours(date: Date, hours: number): Date {
        return this.addMinutes(date, hours * 60);
    }

    public static addMinutes(date: Date, minutes: number): Date {
        return new Date(date.getTime() + minutes * 60 * 1000);
    }

    public static getDate(str: string): Date {
        const parts = str.split('/');
        const month = parseInt(parts[0], 10) - 1;
        const day = parseInt(parts[1], 10);
        const year = 2000 + parseInt(parts[2], 10);
        return new Date(year, month, day);
    }

    public static getString(date: Date, format?: string): string {

        if (format === undefined) { format = 'MM/dd, yyyy'}

        if (format.contains('MM')) {
            let mm = date.getMonth();
            format = format.replaceAll('MM', this.months[mm]);
        }

        if (format.contains('dd')) {
            let dd = date.getDate().toString();
            format = format.replaceAll('dd', dd);
        }

        if (format.contains('yyyy')) {
            let yy = date.getFullYear().toString();
            format = format.replaceAll('yyyy', yy);
        }

        if (format.contains('hh')) {
            let hh = date.getHours().toString();
            format = format.replaceAll('hh', hh);
        }

        if (format.contains('mm')) {
            let mm = date.getMinutes().toString();
            format = format.replaceAll('mm', mm);
        }
        if (format.contains('ss')) {
            let ss = date.getMinutes().toString();
            format = format.replaceAll('ss', ss);
        }

        return format;
    }

    // public static getDateTimeString(date: Date): string {
    //     return this.getDateString(date, false) + ' ' + this.getTimeString(date);
    // }

    // public static getTimeString(date: Date): string {
    //     if (date === undefined) { return ''; }
    //     let hh = date.getHours();
    //     let mm = date.getMinutes();
    //     let ss = date.getSeconds();
    //     return this.pad(hh, 2) + ':' + this.pad(mm, 2) + ':' + this.pad(ss, 2);
    // }

    public static getTimeInterval(date1: Date, date2: Date): TimeInterval {
        let totalMS = date1.getTime() - date2.getTime();
        return new TimeInterval(totalMS);
    }

    public static pad(num: number, size: number): string {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }

    private static months: string[] = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ];

}

export class TimeInterval {
    public milliseconds: number;
    public seconds: number;
    public minutes: number;
    public hours: number;
    public days: number;
    public years: number;

    constructor(milliseconds: number) {
        this.milliseconds = milliseconds;
        this.seconds = this.milliseconds / 1000;
        this.minutes = this.seconds / 60;
        this.hours = this.minutes / 60;
        this.days = this.hours / 24;
        this.years = this.days / 365;
    }

}