import React from "react";

interface AppProps {}

export default class DisplayProgress extends React.Component<
    AppProps,
    { ratio: number }
> {
    constructor(props: AppProps) {
        super(props);
        window.displayProgress = this;
        this.state = {
            ratio: 0,
        };
    }

    render() {
        return <div>{Math.round(this.state.ratio * 100)}%</div>;
    }
}
