import React from "react";
import type { Output } from "./App";
import "./DisplayOutput.css";

interface DisplayOutputProps {
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
        const { output } = this.props;
        const { blob, url } = output;

        return blob.type === "image/gif" ? (
            <figure className="output">
                <img className="output__file" src={url} />
                <figcaption>{this.convertData(blob.size)}</figcaption>
            </figure>
        ) : (
            <figure className="output">
                <video
                    className="output__file"
                    src={url}
                    autoPlay
                    playsInline
                    muted
                    loop
                ></video>
                <figcaption>{this.convertData(blob.size)}</figcaption>
            </figure>
        );
    }
}
