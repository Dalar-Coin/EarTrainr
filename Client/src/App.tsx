import "./App.css";

import { GoogleLogin } from "@react-oauth/google";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Google Auth Integration</p>
        <span>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log("Login Success:", credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </span>
      </header>
    </div>
  );
}

export default App;
