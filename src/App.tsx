import React, { useState, useEffect } from "react";
import FilePicker from "./FilePicker";
import DisplayProgress from "./DisplayProgress";
import DisplayOutput from "./DisplayOutput";
import ResetButton from "./ResetButton";
import Loader from "./Loader";
import DownloadButton from "./DownloadButton";
import ConvertOptions from "./ConvertOptions";
import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import "./App.css";

export interface Output {
    blob: Blob;
    url: string;
}

export interface GifOption {
    startTime: string;
    endTime: string;
    scale: string;
    fps: string;
}

const ffmpeg: FFmpeg = createFFmpeg({ progress: progressRatio });

function progressRatio(status: { ratio: number }) {
    window.displayProgress.setState({
        ratio: status.ratio,
    });
}

function App() {
    const loadable = !!window.SharedArrayBuffer;
    const [ready, setReady] = useState<boolean>(false);
    const [input, setInput] = useState<{
        file: File;
        type: string;
    }>();
    const [output, setOutput] = useState<Output>();
    const [converting, setConverting] = useState<boolean>(false);
    const [gifOption, setGifOption] = useState<GifOption>({
        startTime: "0",
        endTime: "0",
        scale: "0",
        fps: "25",
    });

    const load = async () => {
        if (loadable) {
            await ffmpeg.load();
            setReady(true);
        }
    };

    const updateFile = (file: File, type: string) => {
        setInput({
            file,
            type,
        });
    };

    const convertFile = async () => {
        if (input === undefined) return;
        const { file, type } = input;

        if (type === "image/gif") {
            // convert gif to mp4

            ffmpeg.FS("writeFile", "input.gif", await fetchFile(file));
            await ffmpeg.run(
                "-f",
                "gif",
                "-i",
                "input.gif",
                "-movflags",
                "+faststart",
                "-pix_fmt",
                "yuv420p",
                "-vf",
                "scale=trunc(iw/2)*2:trunc(ih/2)*2",
                "output.mp4"
            );

            const data = ffmpeg.FS("readFile", "output.mp4");
            const blob = new Blob([data.buffer], { type: "video/mp4" });
            const url = URL.createObjectURL(blob);

            setOutput({
                blob,
                url,
            });
        } else {
            // convert mp4 to gif
            const { startTime, endTime, scale, fps } = gifOption;

            ffmpeg.FS("writeFile", "input.mp4", await fetchFile(file));
            await ffmpeg.run(
                "-f",
                "mp4",
                "-i",
                "input.mp4",
                `${startTime ? "-ss" : ""}`,
                `${startTime ? startTime : ""}`,
                "-t",
                `${endTime ? endTime : "10"}`,
                "-loop",
                "0",
                "-filter_complex",
                `fps=${fps},scale=${scale}:-1:flags=lanczos,split [a][b];[a] palettegen [p];[b][p] paletteuse`,
                "output.gif",
                "-pix_fmt",
                "rgb24"
            );

            const data = ffmpeg.FS("readFile", "output.gif");
            const blob = new Blob([data.buffer], { type: "image/gif" });
            const url = URL.createObjectURL(blob);

            setOutput({
                blob,
                url,
            });
            setConverting(false);
        }
    };

    const reset = () => {
        setGifOption({
            startTime: "0",
            endTime: "0",
            scale: "0",
            fps: "25",
        });
        setInput(undefined);
        setOutput(undefined);
    };

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (input && input.type !== "video/mp4") {
            convertFile();
        }
    }, [input]);

    return (
        <>
            {ready ? (
                <>
                    {input ? (
                        output ? (
                            <>
                                <DisplayOutput output={output} />
                                <div className="output__control">
                                    <DownloadButton
                                        fileName={input.file.name}
                                        fileExtension={input.file.type}
                                        outputUrl={output.url}
                                    />
                                    <ResetButton reset={reset} />
                                </div>
                            </>
                        ) : input.type === "video/mp4" ? (
                            converting ? (
                                <DisplayProgress />
                            ) : (
                                <ConvertOptions
                                    input={input.file}
                                    preConvert={setConverting}
                                    convert={convertFile}
                                    gifOption={gifOption}
                                    setGifOption={setGifOption}
                                />
                            )
                        ) : (
                            <DisplayProgress />
                        )
                    ) : (
                        <FilePicker updateFile={updateFile} />
                    )}
                </>
            ) : loadable ? (
                <Loader />
            ) : (
                <div>
                    <h2 style={{ fontSize: "3rem" }}>
                        Browser not supported 😥
                    </h2>
                </div>
            )}
        </>
    );
}

export default App;
