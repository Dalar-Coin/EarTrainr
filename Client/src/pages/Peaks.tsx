import React, { useEffect, useRef } from "react";

import trapBeat from "/songs/First Trap Beat.wav";

function Peaks() {
  const audioContext = useRef(null);
  const sourceNode = useRef(null);
  const eqNode = useRef(null);

  useEffect(() => {
    // Initialize AudioContext
    audioContext.current = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Create EQ (3-band)
    eqNode.current = createEQ(audioContext.current);

    return () => {
      // Cleanup
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

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
    high.gain.value = 6;

    low.connect(mid).connect(high);
    return { input: low, output: high };
  };

  const playOriginal = () => {
    const audio = new Audio(trapBeat);
    audio.play().catch((error) => console.error("Error playing audio:", error));
  };

  const playWithEQ = async () => {
    if (!audioContext.current) return;

    try {
      // Fetch the audio file
      const response = await fetch(trapBeat);
      const arrayBuffer = await response.arrayBuffer();

      // Decode the audio data
      const audioBuffer =
        await audioContext.current.decodeAudioData(arrayBuffer);

      // Create a new source node
      if (sourceNode.current) {
        sourceNode.current.disconnect();
      }
      sourceNode.current = audioContext.current.createBufferSource();
      sourceNode.current.buffer = audioBuffer;

      // Connect the source to the EQ, then to the output
      sourceNode.current.connect(eqNode.current.input);
      eqNode.current.output.connect(audioContext.current.destination);

      // Play the audio
      sourceNode.current.start(0);
    } catch (error) {
      console.error("Error playing audio with EQ:", error);
    }
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button
        onClick={playOriginal}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
      >
        Play Original
      </button>
      <button
        onClick={playWithEQ}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Play with EQ
      </button>
    </div>
  );
}

export default Peaks;
