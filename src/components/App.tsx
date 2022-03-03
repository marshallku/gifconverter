import React, { useState, useEffect } from "react";
import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import FilePicker from "./FilePicker";
import DisplayProgress from "./DisplayProgress";
import DisplayOutput from "./DisplayOutput";
import ResetButton from "./ResetButton";
import Loader from "./Loader";
import DownloadButton from "./DownloadButton";
import ConvertOptions from "./ConvertOptions";
import "./App.css";

const ffmpeg: FFmpeg = createFFmpeg({ progress: progressRatio });

declare global {
    interface Window {
        setRatio: React.Dispatch<React.SetStateAction<number>>;
        videoCropper: React.Component<VideoCropperProps, VideoCropperStates>;
    }
}

function progressRatio(status: {
    duration?: number;
    ratio: number;
    time?: number;
}) {
    if (status.duration) {
        return;
    }

    window.setRatio(status.ratio);
}

function App() {
    const [loadable, setLoadable] = useState<boolean>(
        !!window.SharedArrayBuffer
    );
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
        if (!loadable) {
            return;
        }

        try {
            await ffmpeg.load();
            setReady(true);
        } catch (error) {
            console.error(error);
            setLoadable(false);
        }
    };

    const updateFile = (file: File, type: string) => {
        setInput({
            file,
            type,
        });
    };

    const convertFile = async () => {
        if (!input) {
            return;
        }

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

            return;
        }

        // convert mp4 to gif
        const { startTime, endTime, scale, fps, crop } = gifOption;

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
            // "-filter:v",
            // `crop=${crop}`,
            // "-c:a",
            // "copy",
            "-filter_complex",
            `fps=${fps}${
                crop ? `,crop=${crop}` : ""
            },scale=${scale}:-1:flags=lanczos,split [a][b];[a] palettegen [p];[b][p] paletteuse`,
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
    };

    const reset = () => {
        setGifOption({
            startTime: "0",
            endTime: "0",
            scale: "0",
            fps: "25",
        });
        output && URL.revokeObjectURL(output.url);
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

    if (!loadable) {
        return (
            <div>
                <h2 style={{ fontSize: "3rem" }}>Browser not supported 😥</h2>
            </div>
        );
    }

    if (!ready) {
        return <Loader />;
    }

    if (!input) {
        return <FilePicker updateFile={updateFile} />;
    }

    return (
        <>
            {output ? (
                <>
                    <DisplayOutput input={input.file} output={output} />
                    <div className="output__control">
                        <DownloadButton
                            fileName={input.file.name}
                            fileExtension={output.blob.type}
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
            )}
        </>
    );
}

export default App;
