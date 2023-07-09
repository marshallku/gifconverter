export default function convertData(byte: number) {
    const KB = 1024;
    const MB = KB * KB;

    if (byte > MB) {
        return `${(byte / MB).toFixed(3)} MB`;
    }

    if (byte > KB) {
        return `${(byte / KB).toFixed(3)} KB`;
    }

    return `${byte.toFixed(3)} B`;
}
