import React, { useState } from 'react';
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(registerUsername, registerEmail, registerPassword);
      alert('Registration successful. Please log in.');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Registration Form (Left Side) */}
        <div>
          <h2 className="text-xl font-semibold text-center mb-6">Register</h2>
          <form className="space-y-4" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Authentication Form (Right Side) */}
        <div>
          <h2 className="text-xl font-semibold text-center mb-6">Login</h2>
          <div className="flex flex-col space-y-4">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log("Login Success:", credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />

            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <div>
                  <input type="checkbox" id="remember-me" className="mr-2" />
                  <label htmlFor="remember-me" className="text-sm">
                    Remember me
                  </label>
                </div>
                <a
                  href="#forgot-password"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;