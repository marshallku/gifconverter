import React from "../web_modules/react.js";
import "./DisplayOutput.css.proxy.js";
export default class DisplayOutput2 extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {outputUrl, type} = this.props;
    return type !== "image/gif" ? /* @__PURE__ */ React.createElement("img", {
      className: "output",
      src: outputUrl
    }) : /* @__PURE__ */ React.createElement("video", {
      className: "output",
      src: outputUrl,
      autoPlay: true,
      playsInline: true,
      muted: true,
      loop: true
    });
  }
}
