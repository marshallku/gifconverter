import {
    ChangeEvent,
    SyntheticEvent,
    useCallback,
    useEffect,
    useState,
} from "react";
import { useOption } from "@store";
import { VideoCropper } from "@components";
import { fcls } from "@utils";
import "./index.css";

function OptionInput({ optionKey, video, min, max }: OptionInputProps) {
    const { option, setIndividualOption } = useOption();
    const handleChange = useCallback(
        ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
            setIndividualOption(optionKey, value);
        },
        []
    );
    const handleClick = useCallback(() => {
        if (!video) {
            return;
        }

        const { currentTime } = video;

        setIndividualOption(optionKey, `${currentTime}`);
    }, [video]);

    return (
        <div>
            <input
                type="number"
                min={min}
                max={max}
                value={option[optionKey]}
                onChange={handleChange}
                step={`${optionKey.includes("Time") ? 0.01 : 1}`}
            />
            {!!video && (
                <button onClick={handleClick} title="Current Time">
                    <svg viewBox="0 0 256 256">
                        <circle
                            cx="128"
                            cy="128"
                            r="96"
                            fill="none"
                            stroke="#000"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="24"
                        />
                        <polyline
                            points="128 72 128 128 184 128"
                            fill="none"
                            stroke="#000"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="24"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}

export default function ConvertOptions({
    input,
    convert,
    preConvert,
}: ConvertOptionsProps) {
    const { option, size, setSize, setIndividualOption } = useOption();
    // It won't be updated
    const [inputBlobUrl, setInputBlobUrl] = useState(
        URL.createObjectURL(input)
    );
    const [video, setVideo] = useState<HTMLVideoElement>();
    const handleVideoLoad = useCallback(
        ({ target }: SyntheticEvent<HTMLVideoElement, Event>) => {
            const loadedVideo = target as HTMLVideoElement;
            const checkReadyState = () => {
                if (loadedVideo.readyState !== 4) {
                    window.requestAnimationFrame(checkReadyState);
                    return;
                }

                setIndividualOption("endTime", `${loadedVideo.duration}`);
                setIndividualOption("scale", `${loadedVideo.offsetWidth}`);
                setVideo(loadedVideo);
            };

            checkReadyState();
        },
        []
    );

    useEffect(() => {
        setInputBlobUrl(URL.createObjectURL(input));

        return () => {
            URL.revokeObjectURL(inputBlobUrl);
        };
    }, [input]);

    return (
        <>
            <div className={fcls("option", video && "loaded")}>
                <div className="option__preview">
                    <video
                        src={inputBlobUrl}
                        onLoadedMetadata={handleVideoLoad}
                        autoPlay
                        playsInline
                        muted
                        loop
                        controls
                        draggable="false"
                    />
                    {!!video && <VideoCropper video={video} />}
                </div>
                {!!video && (
                    <>
                        <div className="option__input">
                            <div className="title">Start</div>
                            <OptionInput
                                min="0"
                                max={option.endTime}
                                optionKey="startTime"
                                video={video}
                            />
                        </div>
                        <div className="option__input">
                            <div className="title">End</div>
                            <OptionInput
                                min="0"
                                max={option.endTime}
                                optionKey="endTime"
                                video={video}
                            />
                        </div>
                        <div className="option__input">
                            <div className="title">FPS</div>
                            <OptionInput min="1" optionKey="fps" />
                        </div>
                        <div className="option__input">
                            <div className="title">Size (width)</div>
                            <OptionInput
                                min="1"
                                max={option.scale}
                                optionKey="scale"
                            />
                        </div>
                        <button
                            onClick={() => {
                                const { startTime, endTime } = option;

                                if (startTime >= endTime || endTime === "0") {
                                    return;
                                }

                                if (video) {
                                    // Get Exact size
                                    const { top, right, bottom, left } = size;

                                    if (top + right + bottom + left) {
                                        const videoScale =
                                            video.videoWidth /
                                            video.offsetWidth;

                                        setSize({
                                            top: top * videoScale,
                                            right: right * videoScale,
                                            bottom: bottom * videoScale,
                                            left: left * videoScale,
                                        });

                                        setIndividualOption(
                                            "crop",
                                            `${
                                                video.videoWidth - left - right
                                            }:${
                                                video.videoHeight - top - bottom
                                            }:${left}:${top}`
                                        );
                                    }

                                    setTimeout(() => {
                                        preConvert(true);
                                        convert();
                                    }, 0);
                                }
                            }}
                        >
                            <svg
                                width="30"
                                height="30"
                                viewBox="0 0 256 256"
                                className="option__convert"
                            >
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="96"
                                    fill="none"
                                    stroke="#000"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="24"
                                />
                                <polyline
                                    points="134.059 161.941 168 128 134.059 94.059"
                                    fill="none"
                                    stroke="#000"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="24"
                                />
                                <line
                                    x1="88"
                                    y1="128"
                                    x2="168"
                                    y2="128"
                                    fill="none"
                                    stroke="#000"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="24"
                                />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
