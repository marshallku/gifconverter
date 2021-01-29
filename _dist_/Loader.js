import React from "../web_modules/react.js";
export default function Loader() {
  return /* @__PURE__ */ React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "80",
    stroke: "#f1718c",
    strokeWidth: "10",
    fill: "transparent",
    strokeDasharray: "279"
  }), /* @__PURE__ */ React.createElement("animateTransform", {
    attributeType: "xml",
    attributeName: "transform",
    type: "rotate",
    from: "360 100 100",
    to: "0 100 100",
    dur: "1s",
    additive: "sum",
    repeatCount: "indefinite"
  })));
}
