type OptionField = "startTime" | "endTime" | "fps" | "scale";

interface ConvertOptionsProps {
    input: File;
    convert: () => Promise<void>;
    gifOption: GifOption;
    setGifOption: React.Dispatch<React.SetStateAction<GifOption>>;
    preConvert: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ConvertOptionsStates {
    video: HTMLVideoElement | null;
    inputBlobUrl: string;
    size?: Size;
}

interface OptionInputProps {
    value: string;
    option: OptionField;
    onUpdate: (optionName: OptionField, value: string) => void;
    min: string;
    max?: string;
    video?: HTMLVideoElement;
}
