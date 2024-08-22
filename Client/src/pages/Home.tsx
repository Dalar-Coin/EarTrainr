import { Link } from "react-router-dom";
import { useAuth } from '../context/useAuth';

function Home() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {isAuthenticated ? (
        <>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
          >
            Logout
          </button>
          <Link to="/peaksConfig">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Peaks
            </button>
          </Link>
        </>
      ) : (
        <Link to="/login">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </button>
        </Link>
      )}
    </div>
  );
}

export default Home;