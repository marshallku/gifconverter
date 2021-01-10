interface VideoResizerProps {
    video: HTMLVideoElement;
    setSize: (size: size) => void;
}

interface size {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface VideoResizerStates extends size {
    startPosition: {
        x: number;
        y: number;
        orig: size;
    };
    video: {
        width: number;
        height: number;
    };
}
