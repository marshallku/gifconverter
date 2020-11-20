import React from "../web_modules/react.js";
import Loader2 from "./Loader.js";
import "./DisplayProgress.css.proxy.js";
export default class DisplayProgress2 extends React.Component {
  constructor(props) {
    super(props);
    window.displayProgress = this;
    this.state = {
      ratio: 0
    };
  }
  render() {
    const {ratio} = this.state;
    return /* @__PURE__ */ React.createElement("div", {
      className: "progress"
    }, /* @__PURE__ */ React.createElement(Loader2, null), /* @__PURE__ */ React.createElement("div", null, Math.round(ratio * 100), " %"));
  }
}
