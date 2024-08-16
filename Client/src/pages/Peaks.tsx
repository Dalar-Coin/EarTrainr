import React, { useCallback, useEffect, useState } from "react";

import PeaksEQ from "../components/PeaksEQ"; // Assume this is the TypeScript version we created earlier

interface EQSliderProps {
  frequency: number;
  onChange: (gain: number) => void;
}

const EQSlider: React.FC<EQSliderProps> = ({ frequency, onChange }) => (
  <div>
    <label>{frequency} Hz</label>
    <input
      type="range"
      min="-12"
      max="12"
      step="0.1"
      onChange={(e) => onChange(parseFloat(e.target.value))}
    />
  </div>
);

const Peaks: React.FC = () => {
  const [eq, setEq] = useState<PeaksEQ | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [frequencies, setFrequencies] = useState<number[]>([]);

  useEffect(() => {
    const newEq = new PeaksEQ();
    newEq.setLevel(level);
    setEq(newEq);
    setFrequencies(newEq.getFrequencies());

    // Clean up function
    return () => {
      newEq.stop();
    };
  }, []);

  const handleEQChange = useCallback(
    (index: number, value: number) => {
      if (eq) {
        eq.adjustEQ(index, value);
      }
    },
    [eq]
  );

  const handleLevelUp = useCallback(() => {
    if (eq) {
      const newLevel = level + 1;
      setLevel(newLevel);
      eq.setLevel(newLevel);
      setFrequencies(eq.getFrequencies());
    }
  }, [eq, level]);

  const handlePlay = useCallback(() => {
    eq?.play();
  }, [eq]);

  const handleStop = useCallback(() => {
    eq?.stop();
  }, [eq]);

  const handleLoadAudio = useCallback(
    (url: string) => {
      eq
        ?.loadAudio(url)
        .then(() => console.log("Audio loaded"))
        .catch((error) => console.error("Error loading audio:", error));
    },
    [eq]
  );

  return (
    <div>
      <h1>How to Listen - Level {level}</h1>
      {frequencies.map((freq, index) => (
        <EQSlider
          key={freq}
          frequency={freq}
          onChange={(gain) => handleEQChange(index, gain)}
        />
      ))}
      <button onClick={handlePlay}>Play</button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={handleLevelUp}>Level Up</button>
      <button onClick={() => handleLoadAudio("path/to/your/audio/file.mp3")}>
        Load Audio
      </button>
    </div>
  );
};

export default Peaks;
