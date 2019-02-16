document.head.innerHTML += `<style>*{font-family:monospace;}</style>`;
// aliases
let l = "map"; // use map for every loop because 3 letters
let o = "onclick";
let createElementAlias = e => document.createElement(e);
let createButton = () => createElementAlias("button");
let createDiv = () => createElementAlias("div");
let appendChildAlias = (p, c) => p.appendChild(c);
let appendToDocument = c => appendChildAlias(b, c);
let newArray = stepLength => Array(stepLength).fill(false);
let handleInnerText = (el, on) => (el.innerText = on ? "x" : "-");

// vars
let audioContext = new AudioContext();
let stepLength = 16;
let paused = true;
let currentBeat = 0;
let bpm = 130;

// osc presets
let presets = [
  [0.3, 0.02, 180, 65],
  [0.02, 0.02, 255, 180],
  [0.1, 0.1, 300, 100],
  [0.02, 0.01, 5000, 9000]
];

// play oscilator with preset settings
let playOscillator = (
  [ampDecay, pitchDecay, startFreq, endFreq],
  lr = "linearRampToValueAtTime"
) => {
  let osc = audioContext.createOscillator();
  let gain = audioContext.createGain();

  let now = audioContext.currentTime;

  osc.frequency.value = startFreq;

  osc.frequency[lr](endFreq, now + pitchDecay); // pitch envelope
  gain.gain[lr](0, now + ampDecay); // amp envelope

  osc.start();

  osc.connect(gain);
  gain.connect(audioContext.destination);
};

let sequences = newArray(4)[l](() => newArray(stepLength));

sequences[l]((sequence, sequenceIndex) => {
  let sequenceButtonContainer = createDiv();
  appendToDocument(sequenceButtonContainer);

  // create the button for each step in the sequence
  sequence[l]((_, stepIndex) => {
    let stepButton = createButton();
    handleInnerText(stepButton);
    stepButton[o] = () => {
      // handle toggling step value and button text
      let nextValue = !sequences[sequenceIndex][stepIndex];
      sequences[sequenceIndex][stepIndex] = nextValue;
      handleInnerText(stepButton, nextValue);
    };
    appendChildAlias(sequenceButtonContainer, stepButton);
  });
});

// create step indicator buttons container
let stepIndicatorContainer = createDiv();
appendToDocument(stepIndicatorContainer);

// create step indicator buttons
let indicatorButtons = newArray(stepLength)[l](() => {
  let button = createButton();
  handleInnerText(button);
  appendChildAlias(stepIndicatorContainer, button);
  return button;
});

// append button rows to document
indicatorButtons[l](indicatorButton => appendChildAlias(stepIndicatorContainer, indicatorButton));

// timing system
(x = () => {
  if (!paused) {
    // loop over sequences and play oscillator if step = true
    sequences[l](
      (sequence, sequenceIndex) => sequence[currentBeat] && playOscillator(presets[sequenceIndex])
    );

    // handle rendering indicator steps
    indicatorButtons[l]((indicatorButton, indicatorButtonIndex) =>
      handleInnerText(indicatorButton, indicatorButtonIndex === currentBeat)
    );

    // reset beat if greater than max length and increment
    // incrementing in if statement to save a line
    if (currentBeat++ == stepLength - 1) currentBeat = 0;
  }
  setTimeout(x, 15000 / bpm);
})();

// create play button
let playPauseButton = createButton();
playPauseButton.innerText = "▶/❙❙";
playPauseButton[o] = () => (paused = !paused);
appendToDocument(playPauseButton);

// create tempo input
let bpmInput = createElementAlias("input");
bpmInput.type = "number";
bpmInput.value = bpm;
bpmInput[o] = e => (bpm = e.target.value);
appendToDocument(bpmInput);
