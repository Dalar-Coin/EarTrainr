import React, { useEffect, useRef, useState } from "react";

import trapBeat from "/songs/First Trap Beat.wav";

function Peaks() {
  const audioContext = useRef(null);
  const sourceNode = useRef(null);
  const eqNode = useRef(null);
  const gainNode = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEQEnabled, setIsEQEnabled] = useState(false);

  useEffect(() => {
    audioContext.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    eqNode.current = createEQ(audioContext.current);
    gainNode.current = audioContext.current.createGain();
    gainNode.current.gain.value = 0.3;

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (sourceNode.current && eqNode.current && gainNode.current) {
      sourceNode.current.disconnect();
      if (isEQEnabled) {
        sourceNode.current.connect(eqNode.current.input);
        eqNode.current.output.connect(gainNode.current);
      } else {
        sourceNode.current.connect(gainNode.current);
      }
    }
  }, [isEQEnabled]);

  const createEQ = (context) => {
    const low = context.createBiquadFilter();
    low.type = "lowshelf";
    low.frequency.value = 320;
    low.gain.value = 6;

    const mid = context.createBiquadFilter();
    mid.type = "peaking";
    mid.frequency.value = 1000;
    mid.Q.value = 1;
    mid.gain.value = 0;

    const high = context.createBiquadFilter();
    high.type = "highshelf";
    high.frequency.value = 3200;
    high.gain.value = 0;

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

  const playAudio = async () => {
    if (isPlaying) {
      return; // If already playing, do nothing
    }

    if (!audioContext.current) return;

    try {
      const response = await fetch(trapBeat);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer =
        await audioContext.current.decodeAudioData(arrayBuffer);

      sourceNode.current = audioContext.current.createBufferSource();
      sourceNode.current.buffer = audioBuffer;
      sourceNode.current.loop = true; // Enable looping

      if (isEQEnabled) {
        sourceNode.current.connect(eqNode.current.input);
        eqNode.current.output.connect(gainNode.current);
      } else {
        sourceNode.current.connect(gainNode.current);
      }
      gainNode.current.connect(audioContext.current.destination);

      sourceNode.current.start(0);
      setIsPlaying(true);

      // Remove the onended event as it won't be needed for looping audio
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const toggleEQ = () => {
    setIsEQEnabled(!isEQEnabled);
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button
        onClick={playAudio}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
        disabled={isPlaying}
      >
        Play
      </button>
      <button
        onClick={stopAudio}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
        disabled={!isPlaying}
      >
        Stop
      </button>
      <button
        onClick={toggleEQ}
        className={`px-4 py-2 ${isEQEnabled ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-500 hover:bg-gray-600"} text-white rounded`}
      >
        {isEQEnabled ? "Disable EQ" : "Enable EQ"}
      </button>
    </div>
  );
}

export default Peaks;
