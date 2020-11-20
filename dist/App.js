import React, {useState, useEffect} from "../web_modules/react.js";
import FilePicker2 from "./FilePicker.js";
import DisplayProgress2 from "./DisplayProgress.js";
import DisplayOutput2 from "./DisplayOutput.js";
import ResetButton2 from "./ResetButton.js";
import Loader2 from "./Loader.js";
import {createFFmpeg, fetchFile} from "../web_modules/@ffmpeg/ffmpeg.js";
import "./App.css.proxy.js";
import DownloadButton2 from "./DownloadButton.js";
const ffmpeg2 = createFFmpeg({log: true, progress: progressRatio});
function progressRatio(status) {
  window.displayProgress.setState({
    ratio: status.ratio
  });
}
function App2({}) {
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState();
  const [output, setOutput] = useState("");
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
      const url = URL.createObjectURL(new Blob([data.buffer], {type: "video/mp4"}));
      setOutput(url);
    } else {
      ffmpeg2.FS("writeFile", "input.mp4", await fetchFile(file));
      await ffmpeg2.run("-f", "mp4", "-i", "input.mp4", "-t", "3", "-ss", "0.5", "-filter_complex", "[0:v] split [a][b];[a] palettegen [p];[b][p] paletteuse", "output.gif");
      const data = ffmpeg2.FS("readFile", "output.gif");
      const url = URL.createObjectURL(new Blob([data.buffer], {type: "image/gif"}));
      setOutput(url);
    }
  };
  const reset = () => {
    setInput(void 0);
    setOutput("");
  };
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    convertFile();
  }, [input]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, ready ? /* @__PURE__ */ React.createElement(React.Fragment, null, input ? output ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DisplayOutput2, {
    outputUrl: output,
    type: input.type
  }), /* @__PURE__ */ React.createElement("div", {
    className: "output__control"
  }, /* @__PURE__ */ React.createElement(DownloadButton2, {
    outputUrl: output
  }), /* @__PURE__ */ React.createElement(ResetButton2, {
    reset
  }))) : /* @__PURE__ */ React.createElement(DisplayProgress2, null) : /* @__PURE__ */ React.createElement(FilePicker2, {
    updateFile
  })) : /* @__PURE__ */ React.createElement(Loader2, null));
}
export default App2;
