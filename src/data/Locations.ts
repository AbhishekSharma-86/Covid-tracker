import "./Extensions";

export class Locations {

    // parses search query in location of website, e.g.
    // "?components=map&shapes=line+dot&functions=all&keyword=bubble" to
    // a filter object:
    // filter.component: "map",
    // filter.shape: "line+dot",
    // filter.functions: "all",
    // filter.keyword: "bubble",
    public static parse(location: any): any {

        let ret = { };
        let query = location.search; // ?components=gauge&shapes=circle&functions=all&keyword=anim
        if (query !== undefined) {
            query = query.replace("?","");

            // console.log("Locations query " + query);
            let parameters: string[];
            if (query.contains("&")) {
                parameters = query.split("&");
            } else {
                parameters = [query];
            }

            for (const part of parameters) {
                let pair = part.split("=");
                if (pair.length >= 2) {
                    const name = pair[0];
                    const value = pair[1];
                    ret[name] = value;

                    // console.log("Locations parse " + name + " " + value);
                }
            }
        }
        return ret;
    }
}
