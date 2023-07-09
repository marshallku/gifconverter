import { useState, useEffect } from "react";
import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import { useOption, useProgress } from "@store";
import {
    FilePicker,
    DisplayProgress,
    DisplayOutput,
    ResetButton,
    ConvertOptions,
    DownloadButton,
    Loader,
} from "@components";
import { getFileExtension } from "@utils";
import "./index.css";

const ffmpeg: FFmpeg = createFFmpeg({
    progress: ({ ratio }) => {
        const { setProgress } = useProgress.getState();

        console.log(ratio);
        setProgress(Math.max(0, ratio));
    },
});

function App() {
    const { option, setOption } = useOption();
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

        // convert video to gif
        const {
            option: { startTime, endTime, scale, fps, crop },
        } = useOption.getState();
        const extension = getFileExtension(file.name) || "mp4";

        ffmpeg.FS("writeFile", `input.${extension}`, await fetchFile(file));
        await ffmpeg.run(
            "-f",
            extension,
            "-i",
            `input.${extension}`,
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
        setOption({
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
        console.log(input);
        if (input && !input.type.startsWith("video")) {
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
            ) : input.type.startsWith("video") ? (
                converting ? (
                    <DisplayProgress />
                ) : (
                    <ConvertOptions
                        input={input.file}
                        preConvert={setConverting}
                        convert={convertFile}
                    />
                )
            ) : (
                <DisplayProgress />
            )}
        </>
    );
}

export default App;
