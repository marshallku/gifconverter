import React, {useState} from "../web_modules/react.js";
import VideoCroper from "./VideoCropper.js";
import "./ConvertOptions.css.proxy.js";
function OptionInput(props) {
  const [value, setValue] = useState(props.value);
  const {video} = props;
  const handleChange = (event) => {
    const {value: value2} = event.target;
    setValue(value2);
    props.onUpdate(props.option, value2);
  };
  const handleClick = () => {
    if (video) {
      const {currentTime} = video;
      setValue(`${currentTime}`);
      props.onUpdate(props.option, `${currentTime}`);
    }
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("input", {
    type: "number",
    min: props.min,
    max: props.max ? props.max : "",
    value,
    onChange: handleChange,
    step: `${props.option.includes("Time") ? 0.01 : 1}`
  }), !!video && /* @__PURE__ */ React.createElement("button", {
    onClick: handleClick,
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
export default class ConvertOptions extends React.Component {
  constructor(props) {
    super(props);
    this.handleVideoLoad = (event) => {
      if (this.state.video)
        return;
      const video = event.target;
      const checkReadyState = () => {
        if (video.readyState === 4) {
          this.options.endTime = `${video.duration}`;
          this.options.scale = `${video.offsetWidth}`;
          this.setState({
            video
          });
        } else {
          setTimeout(() => {
            checkReadyState();
          });
        }
      };
      checkReadyState();
    };
    this.updateOption = (option, value) => {
      this.options[option] = value;
    };
    this.setSize = (size) => {
      this.size = size;
    };
    this.convert = () => {
      const {startTime, endTime} = this.options;
      if (startTime >= endTime || endTime === "0")
        return;
      const {video} = this.state;
      if (video) {
        const {top, right, bottom, left} = this.size;
        if (top + right + bottom + left) {
          const videoScale = video.videoWidth / video.offsetWidth;
          this.size.top = top * videoScale;
          this.size.right = right * videoScale;
          this.size.bottom = bottom * videoScale;
          this.size.left = left * videoScale;
          this.options.crop = `${video.videoWidth - this.size.left - this.size.right}:${video.videoHeight - this.size.top - this.size.bottom}:${this.size.left}:${this.size.top}`;
        }
        this.props.setGifOption(this.options);
        setTimeout(() => {
          this.props.preConvert(true);
          this.props.convert();
        }, 0);
      }
    };
    const {gifOption} = this.props;
    this.options = {
      startTime: gifOption.startTime,
      endTime: gifOption.endTime,
      fps: gifOption.fps,
      scale: gifOption.scale
    };
    this.size = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    this.state = {
      video: null
    };
  }
  render() {
    const {startTime, endTime, fps, scale} = this.options;
    const {video} = this.state;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
      className: `${video ? "loaded " : ""}option`
    }, /* @__PURE__ */ React.createElement("div", {
      className: "option__preview"
    }, /* @__PURE__ */ React.createElement("video", {
      src: URL.createObjectURL(this.props.input),
      onLoadedMetadata: this.handleVideoLoad,
      autoPlay: true,
      playsInline: true,
      muted: true,
      loop: true,
      controls: true,
      draggable: "false"
    }), !!video && /* @__PURE__ */ React.createElement(VideoCroper, {
      video,
      setSize: this.setSize
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
