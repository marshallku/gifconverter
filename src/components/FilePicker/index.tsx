import { ChangeEvent, DragEvent, useState } from "react";
import { fcls } from "@utils";
import "./index.css";

export default function FilePicker({ updateFile }: FilePickerProps) {
    const [displayInvalid, setDisplayInvalid] = useState(false);

    const checkType = (type: string) => {
        if (type === "image/gif" || type.startsWith("video/")) {
            return true;
        }

        setDisplayInvalid(true);
        setTimeout(() => {
            setDisplayInvalid(false);
        }, 1500);

        return false;
    };

    const checkAndUpdateFile = (file: File) => {
        const { type } = file;

        checkType(type) && updateFile(file, type);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;

        if (!files || !files.length) {
            return;
        }

        checkAndUpdateFile(files[0]);
    };

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();

        const { files } = event.dataTransfer;

        if (!files.length) {
            return;
        }

        checkAndUpdateFile(files[0]);
    };

    const preventDefault = (event: React.DragEvent) => {
        event.preventDefault();
    };

    return (
        <>
            <input
                type="file"
                name=""
                id="file"
                hidden
                onChange={handleChange}
            />
            <label
                className={fcls(
                    "file__label",
                    displayInvalid && "file__label--invalid"
                )}
                htmlFor="file"
                onDragEnter={preventDefault}
                onDragLeave={preventDefault}
                onDragOver={preventDefault}
                onDrop={handleDrop}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    fill={displayInvalid ? "#dc3545" : "#000000"}
                    viewBox="0 0 256 256"
                >
                    <circle cx="155.99951" cy="100" r="12" />
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
                    />
                    <polyline
                        points="32 168 88 112 144 168 176 136 224 184"
                        fill="none"
                        stroke={displayInvalid ? "#dc3545" : "#000000"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="16"
                    />
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
