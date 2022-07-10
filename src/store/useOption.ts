import create from "zustand";

const useOption = create<OptionStore>((set) => ({
    size: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    setSize(size) {
        set((state) => ({ ...state, size }));
    },
    option: {
        startTime: "0",
        endTime: "0",
        scale: "0",
        fps: "25",
    },
    setOption(option) {
        set((state) => ({ ...state, option }));
    },
    setIndividualOption(key, value) {
        set((state) => ({
            ...state,
            option: { ...state.option, [key]: value },
        }));
    },
}));

export default useOption;
