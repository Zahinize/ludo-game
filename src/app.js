(function() {
  /** Set Global variables and cache DOM element refs **/
  let selectedColor = "";
  let computerColor = "";
  let hasGameStarted = false;
  let isBgPlayStarted = false;
  const BLUE_COLOR = "blue";
  const RED_COLOR = "red";
  const GREEN_COLOR = "green";
  const YELLOW_COLOR = "yellow";
  const colorSequence = [BLUE_COLOR, RED_COLOR, GREEN_COLOR, YELLOW_COLOR];
  const vsComputerEl = document.getElementById("vs-computer");
  const colorSelectionList = document.querySelectorAll(".js-color-selection");
  const csContainerEl = document.querySelector(".js-cs-wrapper");
  const heroBtnContainerEl = document.querySelector(".js-hero-buttons");
  const ctaButtonContainerEl = document.querySelector(".js-cta-buttons");
  const backBtnEl = document.querySelector(".js-back-btn");
  const appBackBtnEl = document.querySelector(".js-app-back-btn");
  const playBtnEl = document.querySelector(".js-play-btn");
  const splashScreenEl = document.querySelector(".js-splashScreen");
  const appEl = document.querySelector(".js-app");
  const backgroundPlayEl = document.querySelector(".js-icon-bg-play");
  const bgPlayIconPath = new URL("assets/icon-video-play.png", import.meta.url);
  const bgPauseIconPath = new URL("assets/icon-video-pause.png", import.meta.url);
  const gameMusicPath = new URL('assets/game-music.mp3', import.meta.url);
  const interactionMusicPath = new URL("https://zahinize.github.io/tic-tac-toe/player-o-click.908137e5.mp3");
  const gameAudio = new Audio(gameMusicPath);
  const interactionAudio = new Audio(interactionMusicPath);

  function getRivalColors(color) {
    if (color == "") return null;
    color = color.toLowerCase();

    const userColorIdx = colorSequence.indexOf(color);
    // In our game, the computer will appear diagonally to the end user.
    // Thus, we can get computer color index by adding 2 to the user color index.
    let computerColorIdx = (userColorIdx + 2) >= colorSequence.length ? userColorIdx - 2 : userColorIdx + 2;

    return [color, colorSequence[computerColorIdx]];
  }
  function handleSelectionClick(e) {
    const el = e.currentTarget;
    // Toggle checkbox flag
    const toggledFlag = Number(!Number(el.dataset["flag"]));

    el.dataset["flag"] = toggledFlag;
    if (toggledFlag) {
      playBtnEl.disabled = false;
      selectedColor = el.dataset["color"];
    } else {
      playBtnEl.disabled = true;
      selectedColor = "";
    }
    // Reset flags of other color selection nodes
    colorSelectionList.forEach((selectionEl) => {
      if (selectionEl.dataset["color"] === selectedColor) { return; }
      selectionEl.dataset["flag"] = "0";
    });
  }
  function handleVSComputerClick() {
    heroBtnContainerEl.classList.add("d-none");
    csContainerEl.classList.remove("d-none");
    ctaButtonContainerEl.classList.remove("d-none");
    playBtnEl.disabled = true;
    selectedColor = "";
    // Reset all color selection nodes
    colorSelectionList.forEach((selectionEl) => selectionEl.dataset["flag"] = "0");
  }
  function handleBackBtnClick() {
    playBtnEl.disabled = true;
    selectedColor = "";
    // Reset all color selection nodes
    colorSelectionList.forEach((selectionEl) => selectionEl.dataset["flag"] = "0");
    heroBtnContainerEl.classList.remove("d-none");
    csContainerEl.classList.add("d-none");
    ctaButtonContainerEl.classList.add("d-none");
  }
  function handlePlayBtnClick() {
    if (!selectedColor) { return false; }

    initGamePlay();
  }
  function handleAppBackBtnClick() {
    const isAppLogout = window.confirm("Do you wish to exit this game?");

    if (!isAppLogout) {
      return false;
    }

    hasGameStarted = false;
    appEl.classList.add("d-none");
    splashScreenEl.classList.remove("d-none");
    // Reset user onboarding
    csContainerEl.classList.add("d-none");
    ctaButtonContainerEl.classList.add("d-none");
    heroBtnContainerEl.classList.remove("d-none");
    // Show all color tokens
    document.querySelectorAll(".js-token").forEach(node => node.classList.remove("d-none"));
    playBtnEl.disabled = true;
    selectedColor = "";
    computerColor = "";
    // Reset all color selection nodes
    colorSelectionList.forEach((selectionEl) => selectionEl.dataset["flag"] = "0");
  }
  function handleBgPlayClick(e) {
    const el = e.currentTarget;
    const img = el.querySelector(".icon-bg-play");

    isBgPlayStarted = !isBgPlayStarted;
    if (!isBgPlayStarted) {
      img.src = bgPlayIconPath;
      pauseAudio(gameAudio);
      return;
    }

    img.src = bgPauseIconPath;
    playAudio(gameAudio, true);
    console.log("background play click:");
  }
  function handlePageInteractionClick() {
    playAudio(interactionAudio);
  }
  function pauseAudio(audioRef) {
    audioRef.pause();
  }
  function playAudio(audioRef, isLoop = false) {
    audioRef.loop = isLoop;

    audioRef
    .play()
    .catch((err) => {
      console.log("Audio is not played ", err);
    });
  }
  function setDOMEvents() {
    document.addEventListener('click', handlePageInteractionClick);
    colorSelectionList.forEach((el) => el.addEventListener("click", handleSelectionClick, false));
    vsComputerEl.addEventListener("click", handleVSComputerClick, false);
    backBtnEl.addEventListener("click", handleBackBtnClick, false);
    appBackBtnEl.addEventListener("click", handleAppBackBtnClick, false);
    playBtnEl.addEventListener("click", handlePlayBtnClick, false);
    backgroundPlayEl.addEventListener("click", handleBgPlayClick, false);
  }

  /*** Initialise Main Gameplay ***/
  function hideUnusedColorTokens(colorsArr) {
    if (!colorsArr.length) return false;

    colorsArr.forEach(color => {
      document.querySelector(`.js-token-${color}-1`).classList.add("d-none");
      document.querySelector(`.js-token-${color}-2`).classList.add("d-none");
      document.querySelector(`.js-token-${color}-3`).classList.add("d-none");
      document.querySelector(`.js-token-${color}-4`).classList.add("d-none");
    });
  }
  function initGamePlay() {
    const rivalColorsArr = getRivalColors(selectedColor);
    const unusedColorsArr = colorSequence.filter(item => rivalColorsArr.indexOf(item) === -1);

    splashScreenEl.classList.add("d-none");
    appEl.classList.remove("d-none");
    hideUnusedColorTokens(unusedColorsArr);
    hasGameStarted = true;
    computerColor = rivalColorsArr[1];

    console.log("user color: ", selectedColor);
    console.log("computer color: ", computerColor);
    console.log("unused colors: ", unusedColorsArr);
  }

  console.log("Ludo game JS loaded.");
  setDOMEvents();
})();
