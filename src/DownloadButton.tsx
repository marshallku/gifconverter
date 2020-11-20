import React from "react";

interface DownloadButtonProps {
    outputUrl: string;
}

export default class DownloadButton extends React.Component<
    DownloadButtonProps
> {
    render() {
        return (
            <a href={this.props.outputUrl} download>
                Download
            </a>
        );
    }
}
