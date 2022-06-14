export default function getFileExtension(fileName: string) {
    return fileName.split(".").pop();
}
