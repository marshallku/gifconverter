import React from "react";
import type { Output } from "./App";
import "./DisplayOutput.css";

interface DisplayOutputProps {
    type: string;
    output: Output;
}

export default class DisplayOutput extends React.Component<DisplayOutputProps> {
    constructor(props: DisplayOutputProps) {
        super(props);
    }

    convertData(byte: number) {
        const KB = 1024;
        const MB = KB * KB;

        if (byte > MB) {
            return `${Math.round(byte / MB)} MB`;
        } else if (byte > KB) {
            return `${Math.round(byte / KB)} KB`;
        } else {
            return `${Math.round(byte)} B`;
        }
    }

    render() {
        const { output, type } = this.props;

        return type !== "image/gif" ? (
            <figure className="output">
                <img className="output__file" src={output.url} />
                <figcaption>{this.convertData(output.blob.size)}</figcaption>
            </figure>
        ) : (
            <figure className="output">
                <video
                    className="output__file"
                    src={output.url}
                    autoPlay
                    playsInline
                    muted
                    loop
                ></video>
                <figcaption>{this.convertData(output.blob.size)}</figcaption>
            </figure>
        );
    }
}
