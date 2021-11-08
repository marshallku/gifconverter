interface VideoCropperProps {
    video: HTMLVideoElement;
    setSize: (size: size) => void;
}

interface size {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface VideoCropperStates extends size {
    video: {
        width: number;
        height: number;
    };
}
