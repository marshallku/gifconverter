import React from "react";
import "./DownloadButton.css";

export default function DownloadButton(props: DownloadButtonProps) {
    const formatFileName = () =>
        `${props.fileName.replace(/\.(gif|mp4)/, "")}.${
            props.fileExtension === "image/gif" ? "mp4" : "gif"
        }`;

    return (
        <a
            className="output__control__download button"
            href={props.outputUrl}
            download={formatFileName()}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                width="1.2rem"
                height="1.2rem"
            >
                <rect width="256" height="256" fill="none" />
                <polyline
                    points="86 110 128 152 170 110"
                    fill="none"
                    stroke="#000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                />
                <line
                    x1="128"
                    y1="39.97056"
                    x2="128"
                    y2="151.97056"
                    fill="none"
                    stroke="#000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                />
                <path
                    d="M224,136v72a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V136"
                    fill="none"
                    stroke="#000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                />
            </svg>
            Download
        </a>
    );
}
