import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Link to="/login">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Login
        </button>
      </Link>
      <Link to="/peaksConfig">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Peaks
        </button>
      </Link>
    </div>
  );
}

export default Home;
