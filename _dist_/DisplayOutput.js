import React from "../web_modules/react.js";
import "./DisplayOutput.css.proxy.js";
export default class DisplayOutput extends React.Component {
  constructor(props) {
    super(props);
  }
  convertData(byte) {
    const KB = 1024;
    const MB = KB * KB;
    if (byte > MB) {
      return `${(byte / MB).toFixed(3)} MB`;
    } else if (byte > KB) {
      return `${(byte / KB).toFixed(3)} KB`;
    } else {
      return `${byte.toFixed(3)} B`;
    }
  }
  render() {
    const {output} = this.props;
    const {blob, url} = output;
    return blob.type === "image/gif" ? /* @__PURE__ */ React.createElement("figure", {
      className: "output"
    }, /* @__PURE__ */ React.createElement("img", {
      className: "output__file",
      src: url
    }), /* @__PURE__ */ React.createElement("figcaption", null, this.convertData(blob.size))) : /* @__PURE__ */ React.createElement("figure", {
      className: "output"
    }, /* @__PURE__ */ React.createElement("video", {
      className: "output__file",
      src: url,
      autoPlay: true,
      playsInline: true,
      muted: true,
      loop: true
    }), /* @__PURE__ */ React.createElement("figcaption", null, this.convertData(blob.size)));
  }
}
