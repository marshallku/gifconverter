import React from "../web_modules/react.js";
import "./DownloadButton.css.proxy.js";
export default class DownloadButton2 extends React.Component {
  constructor() {
    super(...arguments);
    this.formatFileName = () => {
      let {fileName} = this.props;
      const outputExtension = this.props.fileExtension === "image/gif" ? "mp4" : "gif";
      fileName = fileName.replace(/\..(gif|mp4)/, "");
      fileName = `${fileName}.${outputExtension}`;
      return fileName;
    };
  }
  render() {
    return /* @__PURE__ */ React.createElement("a", {
      className: "output__control__download button",
      href: this.props.outputUrl,
      download: this.formatFileName()
    }, /* @__PURE__ */ React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 256 256",
      width: "1.2rem",
      height: "1.2rem"
    }, /* @__PURE__ */ React.createElement("rect", {
      width: "256",
      height: "256",
      fill: "none"
    }), /* @__PURE__ */ React.createElement("polyline", {
      points: "86 110 128 152 170 110",
      fill: "none",
      stroke: "#000",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "24"
    }), /* @__PURE__ */ React.createElement("line", {
      x1: "128",
      y1: "39.97056",
      x2: "128",
      y2: "151.97056",
      fill: "none",
      stroke: "#000",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "24"
    }), /* @__PURE__ */ React.createElement("path", {
      d: "M224,136v72a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V136",
      fill: "none",
      stroke: "#000",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "24"
    })), "Download");
  }
}
