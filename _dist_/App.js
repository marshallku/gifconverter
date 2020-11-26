import React, {useState, useEffect} from "../web_modules/react.js";
import FilePicker2 from "./FilePicker.js";
import DisplayProgress2 from "./DisplayProgress.js";
import DisplayOutput2 from "./DisplayOutput.js";
import ResetButton2 from "./ResetButton.js";
import Loader2 from "./Loader.js";
import DownloadButton2 from "./DownloadButton.js";
import ConvertOptions2 from "./ConvertOptions.js";
import {createFFmpeg, fetchFile} from "../web_modules/@ffmpeg/ffmpeg.js";
import "./App.css.proxy.js";
const ffmpeg2 = createFFmpeg({progress: progressRatio});
function progressRatio(status) {
  window.displayProgress.setState({
    ratio: status.ratio
  });
}
function App2() {
  const loadable = !!window.SharedArrayBuffer;
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState();
  const [output, setOutput] = useState();
  const [converting, setConverting] = useState(false);
  const [gifOption, setGifOption] = useState({
    startTime: "0",
    endTime: "0",
    scale: "0",
    fps: "25"
  });
  const load = async () => {
    await ffmpeg2.load();
    setReady(true);
  };
  const updateFile = (file, type) => {
    setInput({
      file,
      type
    });
  };
  const convertFile = async () => {
    if (input === void 0)
      return;
    const {file, type} = input;
    if (type === "image/gif") {
      ffmpeg2.FS("writeFile", "input.gif", await fetchFile(file));
      await ffmpeg2.run("-f", "gif", "-i", "input.gif", "-movflags", "+faststart", "-pix_fmt", "yuv420p", "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", "output.mp4");
      const data = ffmpeg2.FS("readFile", "output.mp4");
      const blob = new Blob([data.buffer], {type: "video/mp4"});
      const url = URL.createObjectURL(blob);
      setOutput({
        blob,
        url
      });
    } else {
      const {startTime, endTime, scale, fps} = gifOption;
      ffmpeg2.FS("writeFile", "input.mp4", await fetchFile(file));
      await ffmpeg2.run("-f", "mp4", "-i", "input.mp4", `${startTime ? "-ss" : ""}`, `${startTime ? startTime : ""}`, "-t", `${endTime ? endTime : "10"}`, "-loop", "0", "-filter_complex", `fps=${fps},scale=${scale}:-1:flags=lanczos,split [a][b];[a] palettegen [p];[b][p] paletteuse`, "output.gif", "-pix_fmt", "rgb24");
      const data = ffmpeg2.FS("readFile", "output.gif");
      const blob = new Blob([data.buffer], {type: "image/gif"});
      const url = URL.createObjectURL(blob);
      setOutput({
        blob,
        url
      });
      setConverting(false);
    }
  };
  const reset = () => {
    setGifOption({
      startTime: "0",
      endTime: "0",
      scale: "0",
      fps: "25"
    });
    setInput(void 0);
    setOutput(void 0);
  };
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (input && input.type !== "video/mp4") {
      convertFile();
    }
  }, [input]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, ready ? /* @__PURE__ */ React.createElement(React.Fragment, null, input ? output ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DisplayOutput2, {
    output
  }), /* @__PURE__ */ React.createElement("div", {
    className: "output__control"
  }, /* @__PURE__ */ React.createElement(DownloadButton2, {
    fileName: input.file.name,
    fileExtension: input.file.type,
    outputUrl: output.url
  }), /* @__PURE__ */ React.createElement(ResetButton2, {
    reset
  }))) : input.type === "video/mp4" ? converting ? /* @__PURE__ */ React.createElement(DisplayProgress2, null) : /* @__PURE__ */ React.createElement(ConvertOptions2, {
    input: input.file,
    preConvert: setConverting,
    convert: convertFile,
    gifOption,
    setGifOption
  }) : /* @__PURE__ */ React.createElement(DisplayProgress2, null) : /* @__PURE__ */ React.createElement(FilePicker2, {
    updateFile
  })) : loadable ? /* @__PURE__ */ React.createElement(Loader2, null) : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", {
    style: {fontSize: "3rem"}
  }, "Browser not supported \u{1F625}")));
}
export default App2;
