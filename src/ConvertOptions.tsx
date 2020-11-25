import React from "react";
import type { GifOption } from "./App";

interface ConvertOptionsProps {
    input: File;
    convert: () => Promise<void>;
    gifOption: GifOption;
    setGifOption: React.Dispatch<React.SetStateAction<GifOption>>;
    preConvert: React.Dispatch<React.SetStateAction<boolean>>;
}

interface OptionInputProps {
    value: string;
    onUpdate: (string: string) => void;
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

        this.props.onUpdate(value);
    };

    render() {
        return <input value={this.state.value} onChange={this.handleChange} />;
    }
}

export default class ConvertOptions extends React.Component<
    ConvertOptionsProps
> {
    options: GifOption;
    constructor(props: ConvertOptionsProps) {
        super(props);

        const { gifOption } = this.props;

        this.options = {
            t: gifOption.t,
            fps: gifOption.fps,
            scale: gifOption.scale,
        };
    }

    updateFps = (string: string) => {
        this.options.fps = string;
        console.log(string);
    };

    updateScale = (string: string) => {
        this.options.scale = string;
    };

    convert = () => {
        this.props.setGifOption({
            t: this.options.t,
            fps: this.options.fps,
            scale: this.options.scale,
        });

        setTimeout(() => {
            console.log(this.options);
            this.props.preConvert(true);
            this.props.convert();
        }, 0);
    };

    render() {
        const { fps, scale } = this.options;

        return (
            <div className="option">
                <div className="option__preview">
                    <video
                        src={URL.createObjectURL(this.props.input)}
                        autoPlay
                        playsInline
                        muted
                        loop
                    ></video>
                </div>
                <div>
                    <OptionInput value={fps} onUpdate={this.updateFps} />
                </div>
                <div>
                    <OptionInput value={scale} onUpdate={this.updateScale} />
                </div>
                <button onClick={this.convert}>Convert!</button>
            </div>
        );
    }
}
