import { useNavigate } from 'react-router-dom';

function PeaksConfig() {
  const navigate = useNavigate();

  const handleStartNewSession = () => {
    navigate('/peaks');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to the EQ Guessing Game</h1>
      <button
        onClick={handleStartNewSession}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Start New Session
      </button>
    </div>
  );
}

export default PeaksConfig;