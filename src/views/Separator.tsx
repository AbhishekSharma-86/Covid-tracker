import * as React from "react";

export class Separator extends React.Component<any, any> {

    constructor(props: any) {
      super(props);

    }

    public render() {

        let isVertical = this.props.isVertical;
        // let style = { background: bg, bottom: 3, left: 3 } as React.CSSProperties;
        // if (isVertical) {
        //     style = { height: "1rem", width: "100%", left: 3 };
        // }

        return (
        <div  >
            Separator
        </div>
        );
    }

    public componentDidMount() {
        //
    }
}