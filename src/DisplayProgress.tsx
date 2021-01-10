import React from "react";
import Loader from "./Loader";
import "./DisplayProgress.css";

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

        return (
            <div className="progress">
                <Loader />
                <div>{Math.round(ratio * 100)} %</div>
            </div>
        );
    }
}
