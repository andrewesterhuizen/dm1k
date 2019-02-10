document.head.innerHTML += `<style>*{font-family:monospace;}</style>`;

var sineString = "sine";
var buttonString = "button";
var stepLength = 16;
var forEachString = "forEach";
var innerTextString = "innerText";
var documentBody = document.body;
var audioContext = new AudioContext();

var offSymbol = "-";
var onSymbol = "x";

var createElement = e => document.createElement(e);
var appendChild = (p, c) => p.appendChild(c);
var newArray = stepLength => new Array(stepLength).fill(false);

var presets = [
  [sineString, 0.3, 0.02, 180, 65],
  ["triangle", 0.02, 0.02, 400, 200],
  [sineString, 0.1, 0.1, 300, 100],
  [sineString, 0.05, 0.02, 9000, 9000]
];

// play oscilator with preset settings
var playOsc = ([type, ampDecay, pitchDecay, startFreq, endFreq]) => {
  var lr = "linearRampToValueAtTime";

  var osc = audioContext.createOscillator();
  var gain = audioContext.createGain();

  var now = audioContext.currentTime;

  osc.type = type;
  osc.frequency.value = startFreq;
  osc.start();
  osc.frequency[lr](endFreq, now + pitchDecay);
  gain.gain.setValueAtTime(1, now);
  gain.gain[lr](0, now + ampDecay);
  osc.connect(gain);
  gain.connect(audioContext.destination);
};

var sequences = newArray(4).map(() => newArray(stepLength));

sequences[forEachString]((sequence, sequenceIndex) => {
  var sequenceButtonContainer = createElement("div");

  appendChild(documentBody, sequenceButtonContainer);

  sequence[forEachString]((step, stepIndex) => {
    var stepButton = createElement(buttonString);
    stepButton[innerTextString] = offSymbol;
    stepButton.onclick = () => {
      sequences[sequenceIndex][stepIndex] = !sequences[sequenceIndex][
        stepIndex
      ];
      step = !step;
      stepButton[innerTextString] = step ? onSymbol : offSymbol;
    };
    appendChild(sequenceButtonContainer, stepButton);
  });
});
var c = createElement("div");
appendChild(documentBody, c);

var createStepButton = () => {
  var button = createElement(buttonString);
  button[innerTextString] = offSymbol;
  appendChild(c, button);
  return button;
};

var indicators = newArray(stepLength).map(createStepButton);

indicators[forEachString](i => appendChild(c, i));

var currentBeat = 1;
let p = true;

var bpm = 130;

(beat = () => {
  if (!p) {
    sequences[forEachString](
      (sq, i) => sq[currentBeat - 1] && playOsc(presets[i])
    );
    indicators[forEachString](
      (j, i) => (j[innerTextString] = i === currentBeat ? onSymbol : offSymbol)
    );
    if (currentBeat == stepLength) currentBeat = 0;
    currentBeat++;
  }
  setTimeout(beat, 15000 / bpm);
})();

var playPauseButton = createElement(buttonString);
playPauseButton[innerTextString] = "play/pause";
playPauseButton.onclick = () => (p = !p);
appendChild(documentBody, playPauseButton);

var bpmInput = createElement("input");
bpmInput.type = "number";
bpmInput.value = bpm;
bpmInput.onclick = e => (bpm = e.target.value);
appendChild(documentBody, bpmInput);
