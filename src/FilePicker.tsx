import React from "react";
import "./FilePicker.css";

interface FilePickerProps {
    updateFile: (file: File, type: string) => void;
}

export default class FilePicker extends React.Component<
    FilePickerProps,
    { displayInvalid: boolean }
> {
    constructor(props: FilePickerProps) {
        super(props);
        this.state = {
            displayInvalid: false,
        };
    }

    checkType(type: string) {
        if (type === "image/gif" || type === "video/mp4") {
            return true;
        } else {
            this.setState({
                displayInvalid: true,
            });
            setTimeout(() => {
                this.setState({
                    displayInvalid: false,
                });
            }, 1500);
            return false;
        }
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;

        if (files !== null && files[0]) {
            const file = files[0];
            const { type } = file;

            this.checkType(type) && this.props.updateFile(files[0], type);
        }
    };

    handleDrop = (event: React.DragEvent) => {
        event.preventDefault();

        const dt = event.dataTransfer;
        const files = dt.files;

        if (!files.length) return;

        const file = files[0];
        const { type } = file;

        this.checkType(type) && this.props.updateFile(file, type);
    };

    handleDragOver(event: React.DragEvent) {
        event.preventDefault();
    }

    preventDefault(event: React.DragEvent) {
        event.preventDefault();
    }

    render() {
        const { displayInvalid } = this.state;

        return (
            <>
                <input
                    type="file"
                    name=""
                    id="file"
                    hidden
                    onChange={this.handleChange}
                />
                <label
                    className={`${displayInvalid ? "invalid " : ""}file__label`}
                    htmlFor="file"
                    onDragEnter={this.preventDefault}
                    onDragLeave={this.preventDefault}
                    onDragOver={this.handleDragOver}
                    onDrop={this.handleDrop}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="80"
                        height="80"
                        fill={displayInvalid ? "#dc3545" : "#000000"}
                        viewBox="0 0 256 256"
                    >
                        <circle cx="155.99951" cy="100" r="12"></circle>
                        <rect
                            x="32"
                            y="48"
                            width="192"
                            height="160"
                            rx="8"
                            strokeWidth="16"
                            stroke={displayInvalid ? "#dc3545" : "#000000"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        ></rect>
                        <polyline
                            points="32 168 88 112 144 168 176 136 224 184"
                            fill="none"
                            stroke={displayInvalid ? "#dc3545" : "#000000"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="16"
                        ></polyline>
                    </svg>
                    <div>
                        {displayInvalid
                            ? "Upload GIF or MP4 file"
                            : "Click or Drop file"}
                    </div>
                </label>
            </>
        );
    }
}
