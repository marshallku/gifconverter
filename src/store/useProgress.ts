import create from "zustand";

const useProgress = create<ProgressStore>((set) => ({
    progress: 0,
    setProgress(progress: number) {
        set((state) => ({ ...state, progress }));
    },
}));

export default useProgress;
