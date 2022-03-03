export default function fcls(...names: Array<unknown>) {
    return names.filter((x) => !!x).join(" ");
}
