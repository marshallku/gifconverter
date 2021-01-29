type optionNames = "startTime" | "endTime" | "fps" | "scale";

interface ConvertOptionsProps {
    input: File;
    convert: () => Promise<void>;
    gifOption: GifOption;
    setGifOption: React.Dispatch<React.SetStateAction<GifOption>>;
    preConvert: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ConvertOptionsStates {
    video: HTMLVideoElement | null;
    size?: size;
}

interface OptionInputProps {
    value: string;
    option: optionNames;
    onUpdate: (optionName: optionNames, value: string) => void;
    min: string;
    max?: string;
    video?: HTMLVideoElement;
}
