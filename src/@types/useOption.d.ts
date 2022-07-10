interface OptionStore {
    size: Size;
    setSize: (size: Size) => void;
    option: GifOption;
    setOption: (option: GifOption) => void;
    setIndividualOption: <T extends keyof GifOption>(
        key: T,
        value: GifOption[T]
    ) => void;
}
