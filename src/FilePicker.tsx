import React from "react";
import "./FilePicker.css";

interface FilePickerProps {
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default class FilePicker extends React.Component<FilePickerProps> {
    constructor(props: FilePickerProps) {
        super(props);
    }

    render() {
        return (
            <>
                <input
                    type="file"
                    name=""
                    id="file"
                    hidden
                    onChange={this.props.handleChange}
                />
                <label className="file__label" htmlFor="file">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="80"
                        height="80"
                        fill="#000000"
                        viewBox="0 0 256 256"
                    >
                        <circle cx="155.99951" cy="100" r="12"></circle>
                        <rect
                            x="32"
                            y="48"
                            width="192"
                            height="160"
                            rx="8"
                            stroke-width="16"
                            stroke="#000000"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            fill="none"
                        ></rect>
                        <polyline
                            points="32 168 88 112 144 168 176 136 224 184"
                            fill="none"
                            stroke="#000000"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="16"
                        ></polyline>
                    </svg>
                    <div>Click or Drop file</div>
                </label>
            </>
        );
    }
}
