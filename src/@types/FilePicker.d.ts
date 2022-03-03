interface FilePickerProps {
    updateFile: (file: File, type: string) => void;
}

interface FilePickerStates {
    displayInvalid: boolean;
}
