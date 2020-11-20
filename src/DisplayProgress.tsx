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
        const { ratio } = this.state;
        if (ratio && ratio !== 1) {
            return <div>{Math.round(this.state.ratio * 100)}%</div>;
        } else {
            return null;
        }
    }
}
