import React from "react";

interface ResetButtonProps {
    reset: () => void;
}

export default class ResetButton extends React.Component<ResetButtonProps> {
    constructor(props: ResetButtonProps) {
        super(props);
    }

    render() {
        return <button onClick={this.props.reset}>Try another</button>;
    }
}
