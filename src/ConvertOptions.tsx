import React from "react";
import VideoCroper from "./VideoCropper";
import "./ConvertOptions.css";

class OptionInput extends React.Component<OptionInputProps, OptionInputStates> {
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

    handleClick = () => {
        const { video } = this.props;

        if (video) {
            const { currentTime } = video;

            this.setState({
                value: `${currentTime}`,
            });
            this.props.onUpdate(this.props.option, `${currentTime}`);
        }
    };

    render() {
        const { video } = this.props;
        return (
            <div>
                <input
                    type="number"
                    min={this.props.min}
                    max={this.props.max ? this.props.max : ""}
                    value={this.state.value}
                    onChange={this.handleChange}
                    step={`${this.props.option.includes("Time") ? 0.01 : 1}`}
                />
                {!!video && (
                    <button onClick={this.handleClick} title="Current Time">
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
}

export default class ConvertOptions extends React.Component<
    ConvertOptionsProps,
    ConvertOptionsStates
> {
    options: GifOption;
    size: size;
    constructor(props: ConvertOptionsProps) {
        super(props);

        const { gifOption } = this.props;

        this.options = {
            startTime: gifOption.startTime,
            endTime: gifOption.endTime,
            fps: gifOption.fps,
            scale: gifOption.scale,
        };

        this.size = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        };

        this.state = {
            video: null,
        };
    }

    handleVideoLoad = (
        event: React.SyntheticEvent<HTMLVideoElement, Event>
    ) => {
        if (this.state.video) return;
        const video = event.target as HTMLVideoElement;
        const checkReadyState = () => {
            if (video.readyState === 4) {
                this.options.endTime = `${video.duration}`;
                this.options.scale = `${video.offsetWidth}`;

                this.setState({
                    video: video,
                });
            } else {
                setTimeout(() => {
                    checkReadyState();
                });
            }
        };

        checkReadyState();
    };

    updateOption = (option: optionNames, value: string) => {
        this.options[option] = value;
    };

    setSize = (size: size) => {
        this.size = size;
    };

    convert = () => {
        const { startTime, endTime } = this.options;

        if (startTime >= endTime || endTime === "0") return;

        const { video } = this.state;

        if (video) {
            // Get Exact size
            const { top, right, bottom, left } = this.size;
            if (top + right + bottom + left) {
                const videoScale = video.videoWidth / video.offsetWidth;

                this.size.top = top * videoScale;
                this.size.right = right * videoScale;
                this.size.bottom = bottom * videoScale;
                this.size.left = left * videoScale;

                this.options.crop = `${
                    video.videoWidth - this.size.left - this.size.right
                }:${video.videoHeight - this.size.top - this.size.bottom}:${
                    this.size.left
                }:${this.size.top}`;
            }

            this.props.setGifOption(this.options);

            setTimeout(() => {
                this.props.preConvert(true);
                this.props.convert();
            }, 0);
        }
    };

    render() {
        const { startTime, endTime, fps, scale } = this.options;
        const { video } = this.state;

        return (
            <>
                <div className={`${video ? "loaded " : ""}option`}>
                    <div className="option__preview">
                        <video
                            src={URL.createObjectURL(this.props.input)}
                            onLoadedMetadata={this.handleVideoLoad}
                            autoPlay
                            playsInline
                            muted
                            loop
                            controls
                            draggable="false"
                        ></video>
                        {!!video && (
                            <VideoCroper video={video} setSize={this.setSize} />
                        )}
                    </div>
                    {!!video && (
                        <>
                            <div className="option__input">
                                <div className="title">Start</div>
                                <OptionInput
                                    value={startTime}
                                    min="0"
                                    max={endTime}
                                    option="startTime"
                                    onUpdate={this.updateOption}
                                    video={video}
                                />
                            </div>
                            <div className="option__input">
                                <div className="title">End</div>
                                <OptionInput
                                    value={endTime}
                                    min="0"
                                    max={endTime}
                                    option="endTime"
                                    onUpdate={this.updateOption}
                                    video={video}
                                />
                            </div>
                            <div className="option__input">
                                <div className="title">FPS</div>
                                <OptionInput
                                    min="1"
                                    value={fps}
                                    option="fps"
                                    onUpdate={this.updateOption}
                                />
                            </div>
                            <div className="option__input">
                                <div className="title">Size (width)</div>
                                <OptionInput
                                    min="1"
                                    value={scale}
                                    max={scale}
                                    option="scale"
                                    onUpdate={this.updateOption}
                                />
                            </div>
                            <button>
                                <svg
                                    width="30"
                                    height="30"
                                    viewBox="0 0 256 256"
                                    className="option__convert"
                                    onClick={this.convert}
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
}
