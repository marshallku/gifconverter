import React from "react";

interface DisplayProgressProps {}

export default class DisplayProgress extends React.Component<
    DisplayProgressProps,
    { ratio: number }
> {
    constructor(props: DisplayProgressProps) {
        super(props);
        window.displayProgress = this;
        this.state = {
            ratio: 0,
        };
    }

    render() {
        const { ratio } = this.state;

        if (ratio && ratio !== 1) {
            return <div>{Math.round(ratio * 100)}%</div>;
        } else {
            return <div>0%</div>;
        }
    }
}
