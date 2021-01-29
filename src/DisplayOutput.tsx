import React from "react";
import "./DisplayOutput.css";

export default function DisplayOutput(props: DisplayOutputProps) {
    const { output } = props;
    const { blob, url } = output;

    const convertData = (byte: number) => {
        const KB = 1024;
        const MB = KB * KB;

        if (byte > MB) {
            return `${(byte / MB).toFixed(3)} MB`;
        } else if (byte > KB) {
            return `${(byte / KB).toFixed(3)} KB`;
        } else {
            return `${byte.toFixed(3)} B`;
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
