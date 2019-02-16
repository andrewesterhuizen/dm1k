const editContainer = document.createElement("div");
editContainer.className = "edit-container";

document.body.appendChild(editContainer);

const headers = ["ampDecay", "pitchDecay", "startFreq", "endFreq"];
const steps = [0.01, 0.01, 100, 100];
s.forEach((preset, i) => {
  const container = document.createElement("div");
  container.style.display = "flex";
  preset.forEach((value, j) => {
    const input = document.createElement("input");
    input.type = "number";
    input.value = value;
    input.step = steps[j];
    input.oninput = e => {
      console.log("change");
      console.log(e.target.value);
      console.log(s[i][j]);
      s[i][j] = parseFloat(e.target.value);
    };

    const label = document.createElement("label");
    label.innerText = headers[j];
    label.appendChild(input);

    container.appendChild(label);
  });
  editContainer.appendChild(container);
});
