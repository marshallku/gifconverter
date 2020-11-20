import React from "../web_modules/react.js";
import "./FilePicker.css.proxy.js";
export default class FilePicker2 extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = (event) => {
      const {files} = event.target;
      if (files !== null && files[0]) {
        const file = files[0];
        const {type} = file;
        this.checkType(type) && this.props.updateFile(files[0], type);
      }
    };
    this.handleDrop = (event) => {
      event.preventDefault();
      const dt = event.dataTransfer;
      const files = dt.files;
      if (!files.length)
        return;
      const file = files[0];
      const {type} = file;
      this.checkType(type) && this.props.updateFile(file, type);
    };
    this.state = {
      displayInvalid: false
    };
  }
  checkType(type) {
    if (type === "image/gif" || type === "video/mp4") {
      return true;
    } else {
      this.setState({
        displayInvalid: true
      });
      setTimeout(() => {
        this.setState({
          displayInvalid: false
        });
      }, 1500);
      return false;
    }
  }
  handleDragOver(event) {
    event.preventDefault();
  }
  preventDefault(event) {
    event.preventDefault();
  }
  render() {
    const {displayInvalid} = this.state;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", {
      type: "file",
      name: "",
      id: "file",
      hidden: true,
      onChange: this.handleChange
    }), /* @__PURE__ */ React.createElement("label", {
      className: `${displayInvalid ? "invalid " : ""}file__label`,
      htmlFor: "file",
      onDragEnter: this.preventDefault,
      onDragLeave: this.preventDefault,
      onDragOver: this.handleDragOver,
      onDrop: this.handleDrop
    }, /* @__PURE__ */ React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "80",
      height: "80",
      fill: displayInvalid ? "#dc3545" : "#000000",
      viewBox: "0 0 256 256"
    }, /* @__PURE__ */ React.createElement("circle", {
      cx: "155.99951",
      cy: "100",
      r: "12"
    }), /* @__PURE__ */ React.createElement("rect", {
      x: "32",
      y: "48",
      width: "192",
      height: "160",
      rx: "8",
      strokeWidth: "16",
      stroke: displayInvalid ? "#dc3545" : "#000000",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "none"
    }), /* @__PURE__ */ React.createElement("polyline", {
      points: "32 168 88 112 144 168 176 136 224 184",
      fill: "none",
      stroke: displayInvalid ? "#dc3545" : "#000000",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "16"
    })), /* @__PURE__ */ React.createElement("div", null, displayInvalid ? "Upload GIF or MP4 file" : "Click or Drop file")));
  }
}
