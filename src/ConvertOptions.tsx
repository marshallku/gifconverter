import React from "react";
import type { GifOption } from "./App";
import "./ConvertOptions.css";

type optionNames = "startTime" | "endTime" | "fps" | "scale";

interface ConvertOptionsProps {
    input: File;
    convert: () => Promise<void>;
    gifOption: GifOption;
    setGifOption: React.Dispatch<React.SetStateAction<GifOption>>;
    preConvert: React.Dispatch<React.SetStateAction<boolean>>;
}

interface OptionInputProps {
    value: string;
    option: optionNames;
    onUpdate: (optionName: optionNames, value: string) => void;
    min: string;
    max?: string;
}

class OptionInput extends React.Component<OptionInputProps, { value: string }> {
    constructor(props: OptionInputProps) {
        super(props);
        this.state = {
            value: this.props.value,
        };
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        this.setState({
            value: value,
        });

        this.props.onUpdate(this.props.option, value);
    };

    render() {
        return (
            <input
                type="number"
                min={this.props.min}
                max={this.props.max ? this.props.max : ""}
                value={this.state.value}
                onChange={this.handleChange}
                step={`${this.props.option.includes("Time") ? 0.01 : 1}`}
            />
        );
    }
}

export default class ConvertOptions extends React.Component<
    ConvertOptionsProps,
    { videoMounted: boolean }
> {
    options: GifOption;
    constructor(props: ConvertOptionsProps) {
        super(props);

        const { gifOption } = this.props;

        this.options = {
            startTime: gifOption.startTime,
            endTime: gifOption.endTime,
            fps: gifOption.fps,
            scale: gifOption.scale,
        };

        this.state = {
            videoMounted: false,
        };
    }

    handleVideoLoad = (
        event: React.SyntheticEvent<HTMLVideoElement, Event>
    ) => {
        if (this.state.videoMounted) return;
        const video = event.target as HTMLVideoElement;

        this.options.endTime = `${video.duration}`;
        this.options.scale = `${video.offsetWidth}`;

        this.setState({
            videoMounted: true,
        });
    };

    updateOption = (option: optionNames, value: string) => {
        this.options[option] = value;
    };

    convert = () => {
        const { startTime, endTime, scale, fps } = this.options;

        if (startTime >= endTime || endTime === "0") return;

        this.props.setGifOption({
            startTime: startTime,
            endTime: endTime,
            fps: fps,
            scale: scale,
        });

        setTimeout(() => {
            this.props.preConvert(true);
            this.props.convert();
        }, 0);
    };

    render() {
        const { startTime, endTime, fps, scale } = this.options;

        return (
            <div
                className={`${this.state.videoMounted ? "loaded " : ""}option`}
            >
                <div className="option__preview">
                    <video
                        src={URL.createObjectURL(this.props.input)}
                        onTimeUpdate={this.handleVideoLoad}
                        autoPlay
                        playsInline
                        muted
                        loop
                    ></video>
                </div>
                {this.state.videoMounted && (
                    <>
                        <div className="option__input">
                            <div>Start</div>
                            <OptionInput
                                value={startTime}
                                min="0"
                                max={endTime}
                                option="startTime"
                                onUpdate={this.updateOption}
                            />
                        </div>
                        <div className="option__input">
                            <div>End</div>
                            <OptionInput
                                value={endTime}
                                min="0"
                                max={endTime}
                                option="endTime"
                                onUpdate={this.updateOption}
                            />
                        </div>
                        <div className="option__input">
                            <div>FPS</div>
                            <OptionInput
                                min="1"
                                value={fps}
                                option="fps"
                                onUpdate={this.updateOption}
                            />
                        </div>
                        <div className="option__input">
                            <div>Size (width)</div>
                            <OptionInput
                                min="1"
                                value={scale}
                                max={scale}
                                option="scale"
                                onUpdate={this.updateOption}
                            />
                        </div>
                        <div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                viewBox="0 0 256 256"
                                className="option__convert"
                                onClick={this.convert}
                            >
                                <rect width="256" height="256" fill="none" />
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
                        </div>
                    </>
                )}
            </div>
        );
    }
}
