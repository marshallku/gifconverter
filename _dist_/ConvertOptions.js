import React from "../web_modules/react.js";
import "./ConvertOptions.css.proxy.js";
class OptionInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = (event) => {
      const {value} = event.target;
      this.setState({
        value
      });
      this.props.onUpdate(this.props.option, value);
    };
    this.state = {
      value: this.props.value
    };
  }
  render() {
    return /* @__PURE__ */ React.createElement("input", {
      type: "number",
      min: this.props.min,
      max: this.props.max ? this.props.max : "",
      value: this.state.value,
      onChange: this.handleChange,
      step: `${this.props.option.includes("Time") ? 0.01 : 1}`
    });
  }
}
export default class ConvertOptions2 extends React.Component {
  constructor(props) {
    super(props);
    this.handleVideoLoad = (event) => {
      if (this.state.videoMounted)
        return;
      const video = event.target;
      this.options.endTime = `${video.duration}`;
      this.options.scale = `${video.offsetWidth}`;
      this.setState({
        videoMounted: true
      });
    };
    this.updateOption = (option, value) => {
      this.options[option] = value;
    };
    this.convert = () => {
      const {startTime, endTime, scale, fps} = this.options;
      if (startTime >= endTime || endTime === "0")
        return;
      this.props.setGifOption({
        startTime,
        endTime,
        fps,
        scale
      });
      setTimeout(() => {
        this.props.preConvert(true);
        this.props.convert();
      }, 0);
    };
    const {gifOption} = this.props;
    this.options = {
      startTime: gifOption.startTime,
      endTime: gifOption.endTime,
      fps: gifOption.fps,
      scale: gifOption.scale
    };
    this.state = {
      videoMounted: false
    };
  }
  render() {
    const {startTime, endTime, fps, scale} = this.options;
    return /* @__PURE__ */ React.createElement("div", {
      className: `${this.state.videoMounted ? "loaded " : ""}option`
    }, /* @__PURE__ */ React.createElement("div", {
      className: "option__preview"
    }, /* @__PURE__ */ React.createElement("video", {
      src: URL.createObjectURL(this.props.input),
      onTimeUpdate: this.handleVideoLoad,
      autoPlay: true,
      playsInline: true,
      muted: true,
      loop: true
    })), this.state.videoMounted && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
      className: "option__input"
    }, /* @__PURE__ */ React.createElement("div", null, "Start"), /* @__PURE__ */ React.createElement(OptionInput, {
      value: startTime,
      min: "0",
      max: endTime,
      option: "startTime",
      onUpdate: this.updateOption
    })), /* @__PURE__ */ React.createElement("div", {
      className: "option__input"
    }, /* @__PURE__ */ React.createElement("div", null, "End"), /* @__PURE__ */ React.createElement(OptionInput, {
      value: endTime,
      min: "0",
      max: endTime,
      option: "endTime",
      onUpdate: this.updateOption
    })), /* @__PURE__ */ React.createElement("div", {
      className: "option__input"
    }, /* @__PURE__ */ React.createElement("div", null, "FPS"), /* @__PURE__ */ React.createElement(OptionInput, {
      min: "1",
      value: fps,
      option: "fps",
      onUpdate: this.updateOption
    })), /* @__PURE__ */ React.createElement("div", {
      className: "option__input"
    }, /* @__PURE__ */ React.createElement("div", null, "Size (width)"), /* @__PURE__ */ React.createElement(OptionInput, {
      min: "1",
      value: scale,
      max: scale,
      option: "scale",
      onUpdate: this.updateOption
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "30",
      height: "30",
      viewBox: "0 0 256 256",
      className: "option__convert",
      onClick: this.convert
    }, /* @__PURE__ */ React.createElement("rect", {
      width: "256",
      height: "256",
      fill: "none"
    }), /* @__PURE__ */ React.createElement("circle", {
      cx: "128",
      cy: "128",
      r: "96",
      fill: "none",
      stroke: "#000",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "24"
    }), /* @__PURE__ */ React.createElement("polyline", {
      points: "134.059 161.941 168 128 134.059 94.059",
      fill: "none",
      stroke: "#000",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "24"
    }), /* @__PURE__ */ React.createElement("line", {
      x1: "88",
      y1: "128",
      x2: "168",
      y2: "128",
      fill: "none",
      stroke: "#000",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "24"
    })))));
  }
}
