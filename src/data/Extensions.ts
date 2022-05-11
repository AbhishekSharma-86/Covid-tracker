interface String {
    isEmpty(): boolean;
    contains(findStr: string): boolean;
    endsWith(findStr: string): boolean;
    startsWith(findStr: string): boolean;
    replaceAll(oldStr: string, newStr: string): string;
}

String.prototype.isEmpty = function (): boolean {
    const crrStr = this.trim();
    return crrStr.length === 0;
}

String.prototype.contains = function (findStr: string): boolean {
    if (this.length === 0) {
        return false;
    }
    return this.indexOf(findStr, 0) > -1;
}

String.prototype.startsWith = function ( findStr: string): boolean {
    const crrStr = this.trim();
    if (crrStr.length === 0) {
        return false;
    }
    return crrStr.indexOf(findStr, 0) === 0;
}

String.prototype.endsWith = function ( findStr: string): boolean {
    const crrStr = this.trim();
    if (crrStr.length === 0) {
        return false;
    }
    return crrStr.indexOf(findStr, this.length - 1) > -1;
}

String.prototype.replaceAll = function (oldStr: string, newStr: string): string {
    return this.split(oldStr).join(newStr);
}

interface Array<T> {
    contains(item: any): boolean;
    matches(str: string): boolean;
    matchFirst(str: string, defaultTo: string): string;
    combine(array: any[]): void;
    remove(item: any): void, // : any[],
}

Array.prototype.contains = function (item: any): boolean {
    // tslint:disable-next-line:array-type
    const _self = this as Array<any>;
    return _self.indexOf(item, 0) >= 0;
};

Array.prototype.matchFirst = function (str: string, defaultTo: string): string {
    // tslint:disable-next-line:array-type
    const _self = this as Array<any>;
    for (const name of _self) {
        // if (str.includes(name)) {
        if (str.contains(name)) {
            return name;
        }
    }
    return defaultTo;
};

Array.prototype.matches = function (subString: string): boolean {
    // tslint:disable-next-line:array-type
    const _self = this as Array<any>;
    for (const item of _self) {
        if (item.toLowerCase().contains(subString)) {
        // if (item.toLowerCase().includes(subString)) {
            return true;
        }
    }
    return false;
};

Array.prototype.combine = function (array: any[]): void {
    if (array === undefined) {
        return;
    }
    // tslint:disable-next-line:array-type
    const _self = this as Array<any>;
    for (const item of array) {
        if (!_self.contains(item)) {
             _self.push(item);
        }
    }
};

Array.prototype.remove = function (item: any): void { // }: any[] {
    // tslint:disable-next-line:array-type
    const _self = this as Array<any>;
    for (let i = _self.length - 1; i >= 0; i--) {
        if (_self[i] === item) {
            _self.splice(i, 1);
        }
    }
    // return _self.filter((arrayItem, i, arr) => arrayItem !== item);
}

// if (!Array.prototype.remove) {
//     Array.prototype.remove = function<T>(this: T[], elem: T): T[] {
//       return this.filter(e => e !== elem);
//     }
//   }

// interface Date {
//     format(strFormat: string): string;
// }

// Date.prototype.format = function (strFormat: string): string {
//     // tslint:disable-next-line:array-type
//     const _self = this as Date;
//     if (strFormat.indexOf('MM') > 0) {

//     }
//     return _self.filter((arrayItem, i, arr) => arrayItem !== item);
// }

// public static getDateString(date: Date, showYear?: boolean): string {
//     if (showYear === undefined) { showYear = true; }
//     let ret = '';
//     let mm = date.getMonth();
//     let dd = date.getDate();
//     let yy = date.getFullYear();

//     ret += this.months[mm] + ' ' + this.pad(dd, 2);
//     if (showYear) {
//         ret += ', ' + yy;
//     }
//     return ret;
// }
