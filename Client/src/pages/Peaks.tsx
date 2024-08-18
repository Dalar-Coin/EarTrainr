import React, { useEffect, useRef, useState } from "react";

import trapBeat from "/songs/First Trap Beat.wav";

function Peaks() {
  const audioContext = useRef(null);
  const sourceNode = useRef(null);
  const eqNode = useRef(null);
  const gainNode = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioContext.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    eqNode.current = createEQ(audioContext.current);
    gainNode.current = audioContext.current.createGain();
    gainNode.current.gain.value = 0.5; // Set gain to 70%

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const createEQ = (context) => {
    const low = context.createBiquadFilter();
    low.type = "lowshelf";
    low.frequency.value = 320;
    low.gain.value = 3;

    const mid = context.createBiquadFilter();
    mid.type = "peaking";
    mid.frequency.value = 1000;
    mid.Q.value = 1;
    mid.gain.value = 0;

    const high = context.createBiquadFilter();
    high.type = "highshelf";
    high.frequency.value = 3200;
    high.gain.value = 3;

    low.connect(mid).connect(high);
    return { input: low, output: high };
  };

  const stopAudio = () => {
    if (sourceNode.current) {
      sourceNode.current.stop();
      sourceNode.current.disconnect();
    }
    setIsPlaying(false);
  };

  const playAudio = async (useEQ) => {
    if (isPlaying) {
      stopAudio();
    }

    if (!audioContext.current) return;

    try {
      const response = await fetch(trapBeat);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer =
        await audioContext.current.decodeAudioData(arrayBuffer);

      sourceNode.current = audioContext.current.createBufferSource();
      sourceNode.current.buffer = audioBuffer;

      if (useEQ) {
        sourceNode.current.connect(eqNode.current.input);
        eqNode.current.output.connect(gainNode.current);
      } else {
        sourceNode.current.connect(gainNode.current);
      }
      gainNode.current.connect(audioContext.current.destination);

      sourceNode.current.start(0);
      setIsPlaying(true);

      sourceNode.current.onended = () => {
        setIsPlaying(false);
      };
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button
        onClick={() => playAudio(false)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
      >
        Play Original
      </button>
      <button
        onClick={() => playAudio(true)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
      >
        Play with EQ
      </button>
      {isPlaying && (
        <button
          onClick={stopAudio}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Stop
        </button>
      )}
    </div>
  );
}

export default Peaks;
