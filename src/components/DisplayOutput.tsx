import {
    DetailedHTMLProps,
    ImgHTMLAttributes,
    useEffect,
    VideoHTMLAttributes,
} from "react";
import convertData from "../utils/convertFileSize";
import "./DisplayOutput.css";

export default function DisplayOutput({ input, output }: DisplayOutputProps) {
    const inputBlobUrl = URL.createObjectURL(input);
    const { blob, url } = output;

    function Output<
        T extends DetailedHTMLProps<
            ImgHTMLAttributes<HTMLImageElement>,
            | HTMLImageElement
            | DetailedHTMLProps<
                  VideoHTMLAttributes<HTMLVideoElement>,
                  HTMLVideoElement
              >
        >
    >({ Input, Output }: { Input: T; Output: T }) {
        return (
            <figure className="output">
                <ul>
                    <li>
                        <>
                            <h2>Original</h2>
                            {Input}
                            <figcaption>{convertData(input.size)}</figcaption>
                        </>
                    </li>
                    <li>
                        <>
                            <h2>Converted</h2>
                            {Output}
                            <figcaption>{convertData(blob.size)}</figcaption>
                        </>
                    </li>
                </ul>
            </figure>
        );
    }

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(inputBlobUrl);
        };
    }, []);

    if (blob.type === "image/gif") {
        return (
            <Output
                Input={
                    <video
                        className="output__file"
                        src={inputBlobUrl}
                        autoPlay
                        playsInline
                        muted
                        loop
                    />
                }
                Output={<img className="output__file" src={url} />}
            />
        );
    }

    return (
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
                />
            }
        />
    );
}
