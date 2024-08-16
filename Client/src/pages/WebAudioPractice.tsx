import React, { useState } from "react";

import Osc1 from "@/components/Osc1";

const actx = new AudioContext();
const out = actx.destination;
const osc1 = actx.createOscillator();
const gain1 = actx.createGain();

osc1.connect(gain1);
gain1.connect(out);

function WebAudioPractice() {
  // const [osc1Freq, setOsc1Freq] = useState(osc1.frequency.value);
  // const [osc1Detune, setOsc1Detune] = useState(osc1.detune.value);
  const [osc1Settings, setOsc1Settings] = useState({
    frequency: osc1.frequency.value,
    detune: osc1.detune.value,
  });

  const changeOsc1 = (e) => {
    let { value, id } = e.target;
    setOsc1Settings({ ...osc1Settings, [id]: value });
    osc1[id].value = value;
  };

  // const changeOsc1Freq = (e) => {
  //   const { value } = e.target;
  //   setOsc1Freq(value);
  //   osc1.frequency.value = value;
  // };

  // const changeOsc1Detune = (e) => {
  //   const { value } = e.target;
  //   setOsc1Detune(value);
  //   osc1.detune.value = value;
  // };

  return (
    <div>
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Sign In
      </button>
      <div className="App">
        <h1>sliders</h1>
        <button onClick={() => osc1.start()}>start</button>
        <button onClick={() => osc1.stop()}>stop</button>
        <Osc1
          change={changeOsc1}
          settings={osc1Settings}
          // changeFreq={changeOsc1Freq}
          // freq={osc1Freq}
          // changeDetune={changeOsc1Detune}
          // detune={osc1Detune}
        />
      </div>
    </div>
  );
}

export default WebAudioPractice;
