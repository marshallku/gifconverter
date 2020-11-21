import React from "react";
import "./DisplayOutput.css";

interface DisplayOutputProps {
    type: string;
    outputUrl: string;
}

export default class DisplayOutput extends React.Component<DisplayOutputProps> {
    constructor(props: DisplayOutputProps) {
        super(props);
    }

    render() {
        const { outputUrl, type } = this.props;

        return type !== "image/gif" ? (
            <img className="output" src={outputUrl} />
        ) : (
            <video
                className="output"
                src={outputUrl}
                autoPlay
                playsInline
                muted
                loop
            ></video>
        );
    }
}
