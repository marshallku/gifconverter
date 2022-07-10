type OptionField = "startTime" | "endTime" | "fps" | "scale";

interface ConvertOptionsProps {
    input: File;
    convert: () => Promise<void>;
    preConvert: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ConvertOptionsStates {
    video: HTMLVideoElement | null;
    inputBlobUrl: string;
    size?: Size;
}

interface OptionInputProps {
    optionKey: keyof GifOption;
    min: string;
    max?: string;
    video?: HTMLVideoElement;
}
