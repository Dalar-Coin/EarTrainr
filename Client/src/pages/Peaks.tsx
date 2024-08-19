import React, { useEffect, useRef, useState } from "react";

import trapBeat from "/songs/First Trap Beat.wav";

type FrequencyBand = "low" | "mid" | "high";

function Peaks() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEQEnabled, setIsEQEnabled] = useState(false);
  const [boostedBand, setBoostedBand] = useState<FrequencyBand | null>(null);
  const [showResult, setShowResult] = useState(false);

  const audioContext = useRef<AudioContext | null>(null);
  const sourceNode = useRef<AudioBufferSourceNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const eqNodes = useRef<{ [key in FrequencyBand]: BiquadFilterNode } | null>(
    null
  );

  useEffect(() => {
    audioContext.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    gainNode.current = audioContext.current.createGain();
    gainNode.current.gain.value = 0.5; // Set volume to 50%
    eqNodes.current = createEQ(audioContext.current);
    return () => audioContext.current?.close();
  }, []);

  useEffect(() => {
    if (
      isPlaying &&
      sourceNode.current &&
      gainNode.current &&
      eqNodes.current
    ) {
      sourceNode.current.disconnect();
      gainNode.current.disconnect();

      sourceNode.current.connect(gainNode.current);

      if (isEQEnabled) {
        gainNode.current
          .connect(eqNodes.current.low)
          .connect(eqNodes.current.mid)
          .connect(eqNodes.current.high)
          .connect(audioContext.current!.destination);
      } else {
        gainNode.current.connect(audioContext.current!.destination);
      }
    }
  }, [isEQEnabled, isPlaying]);

  const createEQ = (context: AudioContext) => {
    const createFilter = (
      type: BiquadFilterType,
      frequency: number,
      gain = 0
    ) => {
      const filter = context.createBiquadFilter();
      filter.type = type;
      filter.frequency.value = frequency;
      filter.gain.value = gain;
      return filter;
    };

    return {
      low: createFilter("lowshelf", 320),
      mid: createFilter("peaking", 1000),
      high: createFilter("highshelf", 3200),
    };
  };

  const resetEQ = () => {
    if (eqNodes.current) {
      Object.values(eqNodes.current).forEach((node) => {
        node.gain.value = 0;
      });
    }
  };

  const playAudio = async () => {
    if (
      isPlaying ||
      !audioContext.current ||
      !gainNode.current ||
      !eqNodes.current
    )
      return;

    try {
      const response = await fetch(trapBeat);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer =
        await audioContext.current.decodeAudioData(arrayBuffer);

      sourceNode.current = audioContext.current.createBufferSource();
      sourceNode.current.buffer = audioBuffer;
      sourceNode.current.loop = true;

      resetEQ();
      const randomBand = ["low", "mid", "high"][
        Math.floor(Math.random() * 3)
      ] as FrequencyBand;
      eqNodes.current[randomBand].gain.value = 6;
      setBoostedBand(randomBand);

      sourceNode.current.connect(gainNode.current);
      gainNode.current.connect(audioContext.current.destination);

      sourceNode.current.start(0);
      setIsPlaying(true);
      setShowResult(false);
      setIsEQEnabled(false);
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const stopAudio = () => {
    sourceNode.current?.stop();
    setIsPlaying(false);
    setIsEQEnabled(false);
    setShowResult(false);
    resetEQ();
  };

  const handleGuess = (guess: FrequencyBand) => {
    setShowResult(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Welcome to the EQ Guessing Game
      </h1>
      <button
        onClick={playAudio}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
        disabled={isPlaying}
      >
        Start New Round
      </button>
      <button
        onClick={stopAudio}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
        disabled={!isPlaying}
      >
        Stop
      </button>
      {isPlaying && (
        <button
          onClick={() => setIsEQEnabled(!isEQEnabled)}
          className={`px-4 py-2 ${isEQEnabled ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"} text-white rounded mr-2`}
        >
          {isEQEnabled ? "Disable EQ" : "Enable EQ"}
        </button>
      )}
      {isPlaying && !showResult && (
        <div className="mt-4">
          <p className="mb-2">
            Toggle EQ on and guess which frequency band is boosted:
          </p>
          {["low", "mid", "high"].map((band) => (
            <button
              key={band}
              onClick={() => handleGuess(band as FrequencyBand)}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mr-2 mt-2"
            >
              {band.charAt(0).toUpperCase() + band.slice(1)}
            </button>
          ))}
        </div>
      )}
      {showResult && (
        <div className="mt-4">
          <p>
            {boostedBand === null
              ? "Please make a guess"
              : `The boosted band was ${boostedBand}. ${boostedBand === boostedBand ? "Correct! Well done!" : "Incorrect. Try again!"}`}
          </p>
        </div>
      )}
    </div>
  );
}

export default Peaks;
