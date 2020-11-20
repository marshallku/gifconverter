import React from "react";

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
                <label htmlFor="file">UPLOAD</label>
            </>
        );
    }
}
