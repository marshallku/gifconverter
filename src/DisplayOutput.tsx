import React from "react";

interface DisplayOutputProps {
    type: string;
    outputUrl: string;
}

export default class DisplayOutput extends React.Component<DisplayOutputProps> {
    constructor(props: DisplayOutputProps) {
        super(props);
    }

    render() {
        const { outputUrl, type } = this.props;
        return type !== "image/gif" ? (
            <img src={outputUrl} />
        ) : (
            <video src={outputUrl} autoPlay playsInline muted loop></video>
        );
    }
}
