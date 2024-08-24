import { Link } from "react-router-dom";
import { useAuth } from '../context/useAuth';

function Home() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page</h1>
      <div className="space-x-2">
        <Link to="/peaksConfig">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Peaks
          </button>
        </Link>
        {isAuthenticated ? (
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;