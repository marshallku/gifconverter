import React from "react";
import "./DisplayOutput.css";

export default class DisplayOutput extends React.Component<DisplayOutputProps> {
    constructor(props: DisplayOutputProps) {
        super(props);
    }

    convertData(byte: number) {
        const KB = 1024;
        const MB = KB * KB;

        if (byte > MB) {
            return `${(byte / MB).toFixed(3)} MB`;
        } else if (byte > KB) {
            return `${(byte / KB).toFixed(3)} KB`;
        } else {
            return `${byte.toFixed(3)} B`;
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
