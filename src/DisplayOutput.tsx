import React from "react";
import "./DisplayOutput.css";

export default function DisplayOutput(props: DisplayOutputProps) {
    const { output } = props;
    const { blob, url } = output;

    const convertData = (byte: number) => {
        const KB = 1024;
        const MB = KB * KB;

        if (byte > MB) {
            return `${Math.round(byte / MB)} MB`;
        } else if (byte > KB) {
            return `${Math.round(byte / KB)} KB`;
        } else {
            return `${Math.round(byte)} B`;
        }
    };

    return blob.type === "image/gif" ? (
        <figure className="output">
            <img className="output__file" src={url} />
            <figcaption>{convertData(blob.size)}</figcaption>
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
            <figcaption>{convertData(blob.size)}</figcaption>
        </figure>
    );
}
