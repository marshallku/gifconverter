import create from "zustand";

interface ProgressStore {
    progress: number;
    setProgress(progress: number): void;
}

const useProgress = create<ProgressStore>((set) => ({
    progress: 0,
    setProgress(progress: number) {
        set((state) => ({ ...state, progress }));
    },
}));

export default useProgress;
