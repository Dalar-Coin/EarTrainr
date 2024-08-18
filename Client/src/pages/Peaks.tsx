import trapBeat from "/songs/First Trap Beat.wav";

function Peaks() {
  const audio = new Audio(trapBeat);

  const playSong = () => {
    audio.play().catch((error) => console.error("Error playing audio:", error));
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button
        onClick={playSong}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Play
      </button>
    </div>
  );
}

export default Peaks;
