import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';
import './App.css';

const ffmpeg: FFmpeg = createFFmpeg({ log: true });

interface AppProps {}

function App({}: AppProps) {
  const [ready, setReady] = useState(false);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  return <div className="App"></div>;
}

export default App;
