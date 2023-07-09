import { useEffect, useMemo } from "react";
import { convertData } from "@utils";
import "./index.css";

function Output<T extends MediaProps>({
    Input,
    Output,
    input,
    output,
}: OutputProps<T>) {
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
                        <figcaption>{convertData(output.blob.size)}</figcaption>
                    </>
                </li>
            </ul>
        </figure>
    );
}

export default function DisplayOutput({ input, output }: DisplayOutputProps) {
    const inputBlobUrl = useMemo(() => URL.createObjectURL(input), [input]);
    const { blob, url } = output;

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(inputBlobUrl);
        };
    }, [inputBlobUrl]);

    if (blob.type === "image/gif") {
        return (
            <Output
                input={input}
                output={output}
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
                Output={
                    <img className="output__file" src={url} alt="컨버팅 결과" />
                }
            />
        );
    }

    return (
        <Output
            input={input}
            output={output}
            Input={
                <img
                    className="output__file"
                    src={inputBlobUrl}
                    alt="입력 파일"
                />
            }
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
