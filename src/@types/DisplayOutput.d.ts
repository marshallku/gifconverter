type MediaProps = DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    | HTMLImageElement
    | DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>
>;

interface DisplayOutputProps {
    input: File;
    output: Output;
}

interface OutputProps<T extends MediaProps> extends DisplayOutputProps {
    Input: T;
    Output: T;
}
