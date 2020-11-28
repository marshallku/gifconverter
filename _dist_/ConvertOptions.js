import React from "../web_modules/react.js";
import Loader2 from "./Loader.js";
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
    this.handleClick = () => {
      const {video} = this.props;
      if (video) {
        const {currentTime} = video;
        this.setState({
          value: `${currentTime}`
        });
        this.props.onUpdate(this.props.option, `${currentTime}`);
      }
    };
    this.state = {
      value: this.props.value
    };
  }
  render() {
    const {video} = this.props;
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("input", {
      type: "number",
      min: this.props.min,
      max: this.props.max ? this.props.max : "",
      value: this.state.value,
      onChange: this.handleChange,
      step: `${this.props.option.includes("Time") ? 0.01 : 1}`
    }), !!video && /* @__PURE__ */ React.createElement("button", {
      onClick: this.handleClick,
      title: "Current Time"
    }, /* @__PURE__ */ React.createElement("svg", {
      viewBox: "0 0 256 256"
    }, /* @__PURE__ */ React.createElement("circle", {
      cx: "128",
      cy: "128",
      r: "96",
      fill: "none",
      stroke: "#000",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "24"
    }), /* @__PURE__ */ React.createElement("polyline", {
      points: "128 72 128 128 184 128",
      fill: "none",
      stroke: "#000",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "24"
    }))));
  }
}
export default class ConvertOptions2 extends React.Component {
  constructor(props) {
    super(props);
    this.handleVideoLoad = (event) => {
      if (this.state.video)
        return;
      const video = event.target;
      this.options.endTime = `${video.duration}`;
      this.options.scale = `${video.offsetWidth}`;
      this.setState({
        video
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
      video: null
    };
  }
  render() {
    const {startTime, endTime, fps, scale} = this.options;
    const {video} = this.state;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, !!this.state.video || /* @__PURE__ */ React.createElement(Loader2, null), /* @__PURE__ */ React.createElement("div", {
      className: `${this.state.video ? "loaded " : ""}option`
    }, /* @__PURE__ */ React.createElement("div", {
      className: "option__preview"
    }, /* @__PURE__ */ React.createElement("video", {
      src: URL.createObjectURL(this.props.input),
      onLoadedMetadata: this.handleVideoLoad,
      autoPlay: true,
      playsInline: true,
      muted: true,
      loop: true,
      controls: true
    })), !!video && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
      className: "option__input"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "title"
    }, "Start"), /* @__PURE__ */ React.createElement(OptionInput, {
      value: startTime,
      min: "0",
      max: endTime,
      option: "startTime",
      onUpdate: this.updateOption,
      video
    })), /* @__PURE__ */ React.createElement("div", {
      className: "option__input"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "title"
    }, "End"), /* @__PURE__ */ React.createElement(OptionInput, {
      value: endTime,
      min: "0",
      max: endTime,
      option: "endTime",
      onUpdate: this.updateOption,
      video
    })), /* @__PURE__ */ React.createElement("div", {
      className: "option__input"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "title"
    }, "FPS"), /* @__PURE__ */ React.createElement(OptionInput, {
      min: "1",
      value: fps,
      option: "fps",
      onUpdate: this.updateOption
    })), /* @__PURE__ */ React.createElement("div", {
      className: "option__input"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "title"
    }, "Size (width)"), /* @__PURE__ */ React.createElement(OptionInput, {
      min: "1",
      value: scale,
      max: scale,
      option: "scale",
      onUpdate: this.updateOption
    })), /* @__PURE__ */ React.createElement("button", null, /* @__PURE__ */ React.createElement("svg", {
      width: "30",
      height: "30",
      viewBox: "0 0 256 256",
      className: "option__convert",
      onClick: this.convert
    }, /* @__PURE__ */ React.createElement("circle", {
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
    }))))));
  }
}
