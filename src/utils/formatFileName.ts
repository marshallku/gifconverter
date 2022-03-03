export default function formatFileName(name: string, extension: string) {
    return `${name.split(".").slice(0, -1).join(".")}.${extension
        .split("/")
        .pop()}`;
}
