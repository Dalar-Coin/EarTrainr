import React from "react";

function Osc1({ change, settings }) {
  return (
    <div className="control">
      <h2>osc 1</h2>

      <div className="param">
        <h3>frequency</h3>
        <input
          value={settings.frequency}
          onChange={change}
          max="5000"
          type="range"
          id="frequency"
        />
      </div>

      <div className="param">
        <h3>detune</h3>
        <input
          value={settings.detune}
          onChange={change}
          type="range"
          id="detune"
        />
      </div>
    </div>
  );
}

export default Osc1;
