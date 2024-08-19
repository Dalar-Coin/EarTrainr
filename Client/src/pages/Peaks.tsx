import { FrequencyBand, PeaksEQ } from "../components/PeaksEQ";
import React, { useEffect, useRef, useState } from "react";

import dubstep from "/songs/Free Time Finally.wav";
import progHouse from "/songs/Prog House.wav";
import trapBeat from "/songs/First Trap Beat.wav";

function Peaks() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEQEnabled, setIsEQEnabled] = useState(false);
  const [boostedBand, setBoostedBand] = useState<FrequencyBand | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userGuess, setUserGuess] = useState<FrequencyBand | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const sourceNode = useRef<AudioBufferSourceNode | null>(null);
  const peaksEQ = useRef<PeaksEQ | null>(null);
  const songs = [dubstep, progHouse, trapBeat];

  useEffect(() => {
    audioContext.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    peaksEQ.current = new PeaksEQ(audioContext.current);
    return () => audioContext.current?.close();
  }, []);

  useEffect(() => {
    if (
      isPlaying &&
      sourceNode.current &&
      peaksEQ.current &&
      audioContext.current
    ) {
      peaksEQ.current.disconnect();
      peaksEQ.current.connectSource(sourceNode.current);

      if (isEQEnabled) {
        peaksEQ.current.connectDestination(audioContext.current.destination);
      } else {
        peaksEQ.current.bypass(audioContext.current.destination);
      }
    }
  }, [isEQEnabled, isPlaying]);

  const playAudio = async () => {
    if (isPlaying || !audioContext.current || !peaksEQ.current) return;

    try {
      const randomSong = songs[Math.floor(Math.random() * songs.length)];

      const response = await fetch(randomSong);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer =
        await audioContext.current.decodeAudioData(arrayBuffer);

      sourceNode.current = audioContext.current.createBufferSource();
      sourceNode.current.buffer = audioBuffer;
      sourceNode.current.loop = true;

      peaksEQ.current.resetEQ();
      const randomBand = peaksEQ.current.getRandomBand();
      peaksEQ.current.boostBand(randomBand, 6);
      setBoostedBand(randomBand);

      peaksEQ.current.connectSource(sourceNode.current);
      peaksEQ.current.bypass(audioContext.current.destination);

      sourceNode.current.start(0);
      setIsPlaying(true);
      setShowResult(false);
      setIsEQEnabled(false);
      setUserGuess(null);
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const stopAudio = () => {
    sourceNode.current?.stop();
    peaksEQ.current?.disconnect();
    setIsPlaying(false);
    setIsEQEnabled(false);
    setShowResult(false);
    setBoostedBand(null);
    setUserGuess(null);
    peaksEQ.current?.resetEQ();
  };

  const handleGuess = (guess: FrequencyBand) => {
    setUserGuess(guess);
    setShowResult(true);
    if (guess === boostedBand) {
      // Stop the audio if the guess is correct
      stopAudio();
    }
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
      {isPlaying && (
        <button
          onClick={() => setIsEQEnabled(!isEQEnabled)}
          className={`px-4 py-2 ${isEQEnabled ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"} text-white rounded mr-2`}
        >
          {isEQEnabled ? "Disable EQ" : "Enable EQ"}
        </button>
      )}
      {isPlaying && (
        <div className="mt-4">
          <p className="mb-2">
            Toggle EQ on and guess which frequency band is boosted:
          </p>
          <div className="flex items-center">
            {["low", "mid", "high"].map((band) => (
              <button
                key={band}
                onClick={() => handleGuess(band as FrequencyBand)}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mr-2"
              >
                {band.charAt(0).toUpperCase() + band.slice(1)}
              </button>
            ))}
            <button
              onClick={stopAudio}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
            >
              Exit
            </button>
          </div>
        </div>
      )}
      {showResult && (
        <div className="mt-4">
          <p>
            {boostedBand === null
              ? "Please make a guess"
              : userGuess === boostedBand
                ? "Correct! Well done!"
                : `Incorrect. The correct answer was ${boostedBand}.`}
          </p>
        </div>
      )}
    </div>
  );
}

export default Peaks;
