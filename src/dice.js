const FACE_POSITIONS = {
  1: [[50, 50]],
  2: [
    [25, 25],
    [75, 75],
  ],
  3: [
    [25, 25],
    [50, 50],
    [75, 75],
  ],
  4: [
    [25, 25],
    [75, 25],
    [25, 75],
    [75, 75],
  ],
  5: [
    [25, 25],
    [75, 25],
    [50, 50],
    [25, 75],
    [75, 75],
  ],
  6: [
    [25, 20],
    [25, 50],
    [25, 80],
    [75, 20],
    [75, 50],
    [75, 80],
  ],
};
// Which cube face should appear on the FRONT for each value
const VALUE_TO_FACE = {
  1: 'front',
  2: 'right',
  3: 'top',
  4: 'bottom',
  5: 'left',
  6: 'back',
};
// Rotations that bring a given cube face to the FRONT.
// IMPORTANT: These values are mathematically correct.
const FACE_TO_ROTATION = {
  front: 'rotateX(0deg) rotateY(0deg)',
  back: 'rotateX(0deg) rotateY(180deg)',
  right: 'rotateX(0deg) rotateY(-90deg)',
  left: 'rotateX(0deg) rotateY(90deg)',
  top: 'rotateX(-90deg) rotateY(0deg)',
  bottom: 'rotateX(90deg) rotateY(0deg)',
};
const FACE_ORDER = ['front', 'back', 'right', 'left', 'top', 'bottom'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDiceValue() {
  return randomInt(1, 6);
}

function createPip(x, y) {
  const pip = document.createElement('span');
  pip.className = 'pip';
  pip.style.left = `${x}%`;
  pip.style.top = `${y}%`;
  return pip;
}

function createFace(name, value) {
  const face = document.createElement('div');
  face.className = `face ${name}`;

  FACE_POSITIONS[value].forEach(([x, y]) => {
    face.appendChild(createPip(x, y));
  });

  return face;
}

function buildDice(diceEl) {
  // Mapping preserves standard opposite faces.
  const faceValues = {
    front: 1,
    back: 6,
    right: 2,
    left: 5,
    top: 3,
    bottom: 4,
  };

  FACE_ORDER.forEach((faceName) => {
    diceEl.appendChild(createFace(faceName, faceValues[faceName]));
  });
}

function playRollSound(audioEl) {
  if (!audioEl) return;

  audioEl.currentTime = 0;
  audioEl.play().catch(() => {
    // Autoplay may be blocked until user interaction.
  });
}

function setDiceValue(diceEl, value) {
  const faceName = VALUE_TO_FACE[value];

  // Add extra full spins for visual polish while preserving final orientation.
  const spinX = randomInt(1, 2) * 360;
  const spinY = randomInt(1, 2) * 360;

  diceEl.style.transform = `${FACE_TO_ROTATION[faceName]} rotateX(${spinX}deg) rotateY(${spinY}deg)`;
}

/**
 * Rolls both dice together.
 *
 * @param {(payload: {die1:number, die2:number, total:number}) => void} callback
 */
function rollBothDice(dice1, dice2, audioEl, callback = (payload) => console.log(payload)) {
  const dice1Value = randomDiceValue();
  const dice2Value = randomDiceValue();

  playRollSound(audioEl);

  [dice1, dice2].forEach((dice) => {
    dice.classList.remove('rolling');
    void dice.offsetWidth; // restart animation cleanly
    dice.classList.add('rolling');
  });

  // After tumble animation ends, set the exact orientation.
  setTimeout(() => {
    [dice1, dice2].forEach((dice) => {
      dice.classList.remove('rolling');
    });

    setDiceValue(dice1, dice1Value);
    setDiceValue(dice2, dice2Value);

    const payload = {
      dice1: dice1Value,
      dice2: dice2Value,
      total: dice1Value + dice2Value,
    };

    callback(payload);
  }, 950);
}

class DiceRoller {
  constructor(name, dice1Sel, dice2Sel, rollBtnSel, rollAudioSel, diceRollEvent) {
    this.name = name;
    this.diceRollEvent = diceRollEvent;
    this.rollBtnId = rollBtnSel;
    this.dice1 = document.getElementById(dice1Sel);
    this.dice2 = document.getElementById(dice2Sel);
    this.rollAudio = document.getElementById(rollAudioSel);

    // Create ONE stable bound handler
    this._boundHandleRollBtnClick = this.handleRollBtnClick.bind(this);
    this.rollBtn = null;
  }

  buildDice(diceEl) {
    buildDice(diceEl);
  }

  setDiceValue(diceEl) {
    setDiceValue(diceEl, 1);
  }

  handleRollBtnClick() {
    this.rollBtn.disabled = true;

    rollBothDice(this.dice1, this.dice2, this.rollAudio, ({ dice1, dice2, total }) => {
      this.rollBtn.disabled = false;
      console.log(`${this.name}: ${dice1}, ${dice2}, Total: ${total}`);
      document.dispatchEvent(
        new CustomEvent(this.diceRollEvent, { detail: { dice1, dice2, total } }),
      );
    });
  }

  attachRollBtn() {
    this.rollBtn = document.getElementById(this.rollBtnId);

    if (!this.rollBtn) return;
    this.rollBtn.addEventListener('click', this._boundHandleRollBtnClick, false);
  }

  detachRollBtn() {
    if (!this.rollBtn) return;

    this.rollBtn.removeEventListener('click', this._boundHandleRollBtnClick, false);
  }

  destroy() {
    // Remove event listener first
    this.detachRollBtn();

    // Clear DOM references
    if (this.dice1) {
      this.dice1.innerHTML = '';
      this.dice1 = null;
    }

    if (this.dice2) {
      this.dice2.innerHTML = '';
      this.dice2 = null;
    }

    this.rollBtn = null;
    this.rollAudio = null;
    this._boundHandleRollBtnClick = null;
  }
}

export default DiceRoller;
