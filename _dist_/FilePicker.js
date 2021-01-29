import React, {useState} from "../web_modules/react.js";
import "./FilePicker.css.proxy.js";
export default function FilePicker(props) {
  const [displayInvalid, setDisplayInvalid] = useState(false);
  const checkType = (type) => {
    if (type === "image/gif" || type === "video/mp4") {
      return true;
    } else {
      setDisplayInvalid(true);
      setTimeout(() => {
        setDisplayInvalid(false);
      }, 1500);
      return false;
    }
  };
  const handleChange = (event) => {
    const {files} = event.target;
    if (files !== null && files[0]) {
      const file = files[0];
      const {type} = file;
      checkType(type) && props.updateFile(files[0], type);
    }
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const dt = event.dataTransfer;
    const files = dt.files;
    if (!files.length)
      return;
    const file = files[0];
    const {type} = file;
    checkType(type) && props.updateFile(file, type);
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const preventDefault = (event) => {
    event.preventDefault();
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", {
    type: "file",
    name: "",
    id: "file",
    hidden: true,
    onChange: handleChange
  }), /* @__PURE__ */ React.createElement("label", {
    className: `${displayInvalid ? "invalid " : ""}file__label`,
    htmlFor: "file",
    onDragEnter: preventDefault,
    onDragLeave: preventDefault,
    onDragOver: handleDragOver,
    onDrop: handleDrop
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
