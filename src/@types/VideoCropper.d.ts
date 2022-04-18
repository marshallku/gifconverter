interface VideoCropperProps {
    video: HTMLVideoElement;
    setSize: (size: Size) => void;
}

interface Size {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface VideoCropperStates extends Size {
    video: {
        width: number;
        height: number;
    };
}
