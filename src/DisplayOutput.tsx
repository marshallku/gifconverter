import React, { useEffect } from "react";
import "./DisplayOutput.css";

export default function DisplayOutput(props: DisplayOutputProps) {
    const { input, output } = props;
    const inputBlobUrl = URL.createObjectURL(input);
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

    function Output<
        T extends React.DetailedHTMLProps<
            React.ImgHTMLAttributes<HTMLImageElement>,
            | HTMLImageElement
            | React.DetailedHTMLProps<
                  React.VideoHTMLAttributes<HTMLVideoElement>,
                  HTMLVideoElement
              >
        >
    >({ Input, Output }: { Input: T; Output: T }) {
        return (
            <figure className="output">
                <ul>
                    <li>
                        <h2>Original</h2>
                        {Input}
                        <figcaption>{convertData(input.size)}</figcaption>
                    </li>
                    <li>
                        <h2>Converted</h2>
                        {Output}
                        <figcaption>{convertData(blob.size)}</figcaption>
                    </li>
                </ul>
            </figure>
        );
    }

    useEffect(() => {
        window.setRatio(0);

        return () => {
            URL.revokeObjectURL(inputBlobUrl);
        };
    }, []);

    return blob.type === "image/gif" ? (
        <Output
            Input={
                <video
                    className="output__file"
                    src={inputBlobUrl}
                    autoPlay
                    playsInline
                    muted
                    loop
                ></video>
            }
            Output={<img className="output__file" src={url} />}
        />
    ) : (
        <Output
            Input={<img className="output__file" src={inputBlobUrl} />}
            Output={
                <video
                    className="output__file"
                    src={url}
                    autoPlay
                    playsInline
                    muted
                    loop
                ></video>
            }
        />
    );
}
