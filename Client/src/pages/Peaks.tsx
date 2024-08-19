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
  const [roundEnded, setRoundEnded] = useState(false);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
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
      setRoundEnded(false);
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
    setRoundEnded(false);
    peaksEQ.current?.resetEQ();
  };

  const handleGuess = (guess: FrequencyBand) => {
    setUserGuess(guess);
    setShowResult(true);
    setRoundEnded(true);
    sourceNode.current?.stop();

    setTotalGuesses(prev => prev + 1);
    if (guess === boostedBand) {
      setCorrectGuesses(prev => prev + 1);
    }
  };

  const handleNextRound = () => {
    stopAudio();
    playAudio();
  };

  const getScorePercentage = () => {
    if (totalGuesses === 0) return 0;
    return Math.round((correctGuesses / totalGuesses) * 100);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to the EQ Guessing Game
      </h1>
      <div className="mb-4">
        <p>Your Score: {getScorePercentage()}% correct</p>
      </div>
      {!isPlaying && (
        <button
          onClick={playAudio}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
        >
          Start New Round
        </button>
      )}
      {isPlaying && !roundEnded && (
        <>
          <button
            onClick={() => setIsEQEnabled(!isEQEnabled)}
            className={`px-4 py-2 ${
              isEQEnabled ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
            } text-white rounded mb-4`}
          >
            {isEQEnabled ? "Disable EQ" : "Enable EQ"}
          </button>
          <div className="w-full max-w-md">
            <p className="text-center mb-2">
              Toggle EQ on and guess which frequency band is boosted:
            </p>
            <div className="flex justify-center items-center space-x-2">
              {["low", "mid", "high"].map((band) => (
                <button
                  key={band}
                  onClick={() => handleGuess(band as FrequencyBand)}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  {band.charAt(0).toUpperCase() + band.slice(1)}
                </button>
              ))}
              <button
                onClick={stopAudio}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Exit
              </button>
            </div>
          </div>
        </>
      )}
      {showResult && (
        <div className="mt-4 text-center">
          <p>
            {boostedBand === null
              ? "Please make a guess"
              : userGuess === boostedBand
              ? "Correct! Well done!"
              : `Incorrect. The correct answer was ${boostedBand}.`}
          </p>
          {roundEnded && (
            <button
              onClick={handleNextRound}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next Round
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Peaks;