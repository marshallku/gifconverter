import React, {useState} from "../web_modules/react.js";
import Loader from "./Loader.js";
import "./DisplayProgress.css.proxy.js";
export default function DisplayProgress() {
  const [ratio, setRatio] = useState(0);
  window.setRatio = setRatio;
  return /* @__PURE__ */ React.createElement("div", {
    className: "progress"
  }, /* @__PURE__ */ React.createElement(Loader, null), /* @__PURE__ */ React.createElement("div", null, Math.round(ratio * 100), " %"));
}
