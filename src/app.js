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
  const colorMap = {
    [RED_COLOR]: "#EA1D23",
    [GREEN_COLOR]: "#00A347",
    [BLUE_COLOR]: "#29ADFF",
    [YELLOW_COLOR]: "#DABC0F"
  };
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

  function getActiveColors(color) {
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
  function updateGameTokenStyles(selectedColor = "", computerColor = "") {
    // Update game token positions for computer player
    document.querySelector(`.js-token.js-token-${computerColor}-1`).classList.add("game-token-computer-1");
    document.querySelector(`.js-token.js-token-${computerColor}-2`).classList.add("game-token-computer-2");
    document.querySelector(`.js-token.js-token-${computerColor}-3`).classList.add("game-token-computer-3");
    document.querySelector(`.js-token.js-token-${computerColor}-4`).classList.add("game-token-computer-4");
    // Update game token positions for user player
    document.querySelector(`.js-token.js-token-${selectedColor}-1`).classList.add("game-token-user-1");
    document.querySelector(`.js-token.js-token-${selectedColor}-2`).classList.add("game-token-user-2");
    document.querySelector(`.js-token.js-token-${selectedColor}-3`).classList.add("game-token-user-3");
    document.querySelector(`.js-token.js-token-${selectedColor}-4`).classList.add("game-token-user-4");
  }
  function updateGameFortStyles(selectedColor = "", computerColor = "", unusedColorsArr = []) {
    const gameFortEl = document.querySelector(".js-game-fort");
    const borderTopColor = colorMap[computerColor];
    const borderRightColor = colorMap[unusedColorsArr[1]];
    const borderBottomColor = colorMap[selectedColor];
    const borderLeftColor = colorMap[unusedColorsArr[0]];

    gameFortEl.style.setProperty("--game-fort-br-top", `75px solid ${borderTopColor}`);
    gameFortEl.style.setProperty("--game-fort-br-right", `75px solid ${borderRightColor}`);
    gameFortEl.style.setProperty("--game-fort-br-bottom", `75px solid ${borderBottomColor}`);
    gameFortEl.style.setProperty("--game-fort-br-left", `75px solid ${borderLeftColor}`);
  }
  function updateGameHouseStyles(selector, newColor, prevColorClassName) {
    const el = document.querySelector(selector);
    const newColorClsName = `bgcolor-${newColor}`;

    el.classList.replace(prevColorClassName, newColorClsName);
    el.querySelectorAll(".token").forEach(node => {
      node.classList.replace(prevColorClassName, newColorClsName);
    });
  }
  function updateGameTrackStyles(selector, newColor, prevColorClassName) {
    const el = document.querySelector(selector);
    const newColorClsName = `bgcolor-${newColor}`;

    // Update game track colors for computer player
    el.querySelector(".track-dots").classList.replace(prevColorClassName, newColorClsName);
  }
  function setupLayout(selectedColor = "", computerColor = "", unusedColorsArr = []) {
    // Update game house colors for computer player
    updateGameHouseStyles(".game-house:nth-of-type(2)", computerColor, "bgcolor-red");
    // Update game house colors for user player
    updateGameHouseStyles(".game-house:nth-of-type(3)", selectedColor, "bgcolor-yellow");
    // Update game house colors for unused top-left player
    updateGameHouseStyles(".game-house:nth-of-type(1)", unusedColorsArr[0], "bgcolor-blue");
    // Update game house colors for unused bottom-right player
    updateGameHouseStyles(".game-house:nth-of-type(4)", unusedColorsArr[1], "bgcolor-green");

    // Update game track colors for computer player
    updateGameTrackStyles(".game-track.game-track-top", computerColor, "bgcolor-red");
    // Update game track colors for user player
    updateGameTrackStyles(".game-track.game-track-bottom", selectedColor, "bgcolor-yellow");
    // Update game track colors for unused top-left player
    updateGameTrackStyles(".game-track.game-track-left", unusedColorsArr[0], "bgcolor-blue");
    // Update game track colors for unused bottom-right player
    updateGameTrackStyles(".game-track.game-track-right", unusedColorsArr[1], "bgcolor-green");

    // Update game token styles
    updateGameTokenStyles(selectedColor, computerColor);
    // Update game fort styles
    updateGameFortStyles(selectedColor, computerColor, unusedColorsArr);
  }
  function initGamePlay() {
    const activeColorsArr = getActiveColors(selectedColor);
    const unusedColorsArr = colorSequence.filter(item => activeColorsArr.indexOf(item) === -1);

    splashScreenEl.classList.add("d-none");
    appEl.classList.remove("d-none");
    hideUnusedColorTokens(unusedColorsArr);
    hasGameStarted = true;
    computerColor = activeColorsArr[1];
    setupLayout(selectedColor, computerColor, unusedColorsArr);

    console.log("user color: ", selectedColor);
    console.log("computer color: ", computerColor);
    console.log("unused colors: ", unusedColorsArr);
  }

  console.log("Ludo game JS loaded.");
  setDOMEvents();
})();
