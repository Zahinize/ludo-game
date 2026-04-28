(function () {
  /** Set Global variables and cache DOM element refs **/
  /** Onboarding: Selected token color **/
  let selectedColor = '';
  let computerColor = '';
  /** Onboarding: User name and avatar info **/
  let userName = '';
  let userAvatar = '';
  let userAvatarURL = '';
  let hasGameStarted = false;
  let isBgPlayStarted = false;
  const isMobileWidth = window.innerWidth <= 768;
  const BLUE_COLOR = 'blue';
  const RED_COLOR = 'red';
  const GREEN_COLOR = 'green';
  const YELLOW_COLOR = 'yellow';
  const colorSequence = [BLUE_COLOR, RED_COLOR, GREEN_COLOR, YELLOW_COLOR];
  const colorMap = {
    [RED_COLOR]: '#EA1D23',
    [GREEN_COLOR]: '#00A347',
    [BLUE_COLOR]: '#29ADFF',
    [YELLOW_COLOR]: '#DABC0F',
  };
  /** DOM element Refs **/
  const $q = (sel) => document.querySelector(sel);
  const $qall = (sel) => document.querySelectorAll(sel);
  const $id = (id) => document.getElementById(id);
  /** Onboarding Splashscreen **/
  const splashScreenEl = $q('.js-splashScreen');
  const vsComputerEl = $id('vs-computer');
  const heroBtnContainerEl = $q('.js-hero-buttons');
  const backgroundPlayEl = $q('.js-icon-bg-play');
  /** Onboarding screen: Color Selection **/
  const colorSelectionList = $qall('.js-color-selection');
  const csContainerEl = $q('.js-cs-wrapper');
  const backBtnEl = $q('.js-back-btn');
  const playBtnEl = $q('.js-play-btn');
  /** Onboarding screen: Personal Information **/
  const piWrapper = $q('.js-pi-wrapper');
  const userNameInputEl = $q('.js-pi-name-input');
  const userAvatarList = $qall('.js-avatar');
  const piBackBtn = $q('.js-pi-back-btn');
  const piNextBtn = $q('.js-pi-next');
  /** Main App screen **/
  const appBackBtnEl = $q('.js-app-back-btn');
  const appEl = $q('.js-app');
  /** Image and Audio Refs **/
  const bgPlayIconPath = new URL('assets/icon-video-play.png', import.meta.url);
  const bgPauseIconPath = new URL('assets/icon-video-pause.png', import.meta.url);
  const gameMusicPath = new URL('assets/game-music.mp3', import.meta.url);
  const interactionMusicPath = new URL(
    'https://zahinize.github.io/tic-tac-toe/player-o-click.908137e5.mp3',
  );
  const gameAudio = new Audio(gameMusicPath);
  const interactionAudio = new Audio(interactionMusicPath);

  /** Miscellaneous functions **/
  function getActiveColors(color) {
    if (color == '') return null;
    color = color.toLowerCase();

    const userColorIdx = colorSequence.indexOf(color);
    // In our game, the computer will appear diagonally to the end user.
    // Thus, we can get computer color index by adding 2 to the user color index.
    let computerColorIdx =
      userColorIdx + 2 >= colorSequence.length ? userColorIdx - 2 : userColorIdx + 2;

    return [color, colorSequence[computerColorIdx]];
  }
  function togglePINextVisibility() {
    if (userName && userAvatar && userAvatarURL) {
      piNextBtn.disabled = false;
      return;
    }

    piNextBtn.disabled = true;
  }

  /** Reset UI screens - State and UI **/
  function resetPIScreen() {
    // Reset state
    userName = '';
    userAvatar = '';
    userAvatarURL = '';
    // Reset UI
    userNameInputEl.value = '';
    $qall('.js-avatar').forEach((node) => {
      node.classList.remove('avatar-active');
    });
    piNextBtn.disabled = true;
  }
  function resetColorSelectScreen() {
    // Reset state
    playBtnEl.disabled = true;
    selectedColor = '';
    // Reset all color selection nodes
    colorSelectionList.forEach((selectionEl) => (selectionEl.dataset['flag'] = '0'));
  }

  /** Event Handlers **/
  function handleSelectionClick(e) {
    const el = e.currentTarget;
    // Toggle checkbox flag
    const toggledFlag = Number(!Number(el.dataset['flag']));

    el.dataset['flag'] = toggledFlag;
    if (toggledFlag) {
      playBtnEl.disabled = false;
      selectedColor = el.dataset['color'];
    } else {
      playBtnEl.disabled = true;
      selectedColor = '';
    }
    // Reset flags of other color selection nodes
    colorSelectionList.forEach((selectionEl) => {
      if (selectionEl.dataset['color'] === selectedColor) {
        return;
      }
      selectionEl.dataset['flag'] = '0';
    });
  }
  function handleVSComputerClick() {
    heroBtnContainerEl.classList.add('d-none');
    piWrapper.classList.remove('d-none');
  }
  function handlePIBackBtnClick() {
    resetPIScreen();
    // Toggle containers visibility
    piWrapper.classList.add('d-none');
    heroBtnContainerEl.classList.remove('d-none');
  }
  function setUserNameInputError() {
    userName = '';
    userNameInputEl.classList.add('bx-red');
    userNameInputEl.focus();
  }
  function handlePINextBtnClick() {
    // User name state validation
    if (
      !userName ||
      userNameInputEl.value.trim() === '' ||
      userName.length < 3 ||
      userName.length > 12
    ) {
      alert('Please enter your user name between 3-12 characters.');
      setUserNameInputError();
      return false;
    }

    userNameInputEl.classList.remove('bx-red');
    piWrapper.classList.add('d-none');
    /** Color Selection Screen: Prepare this screen for the end user with a state and UI reset **/
    resetColorSelectScreen();
    csContainerEl.classList.remove('d-none');
  }
  function handleBackBtnClick() {
    resetColorSelectScreen();
    piWrapper.classList.remove('d-none');
    csContainerEl.classList.add('d-none');
  }
  function handlePlayBtnClick() {
    if (!selectedColor) {
      return false;
    }

    initGamePlay();
  }
  function handleAppBackBtnClick() {
    const isAppLogout = window.confirm('Do you wish to exit this game?');

    if (!isAppLogout) {
      return false;
    }

    hasGameStarted = false;
    appEl.classList.add('d-none');
    splashScreenEl.classList.remove('d-none');
    // Reset user onboarding
    csContainerEl.classList.add('d-none');
    heroBtnContainerEl.classList.remove('d-none');
    // Show all color tokens
    $qall('.js-token').forEach((node) => {
      node.classList.remove('d-none');
      const computerClsName = Array.from(node.classList).find((item) =>
        item.includes('game-token-computer-'),
      );
      const userClsName = Array.from(node.classList).find((item) =>
        item.includes('game-token-user-'),
      );

      // Reset current computer tokens
      if (computerClsName) {
        node.classList.remove(computerClsName);
      }
      // Reset current user tokens
      if (userClsName) {
        node.classList.remove(userClsName);
      }
    });
    // Reset onboarding screens
    resetColorSelectScreen();
    resetPIScreen();
    computerColor = '';
  }
  function handleBgPlayClick(e) {
    const el = e.currentTarget;
    const img = el.querySelector('.icon-bg-play');

    isBgPlayStarted = !isBgPlayStarted;
    if (!isBgPlayStarted) {
      img.src = bgPlayIconPath;
      pauseAudio(gameAudio);
      return;
    }

    img.src = bgPauseIconPath;
    playAudio(gameAudio, true);
    console.log('background play click:');
  }
  function handlePageInteractionClick() {
    playAudio(interactionAudio);
  }
  function handleUserNameInteraction(e) {
    userName = e.target.value;
    /** TODO: Implement a debounce function (~ 250 ms) to properly check the PI next button visibility */
    togglePINextVisibility();
  }
  function handleUserAvatarClick(e) {
    const el = e.currentTarget;

    // Reset 'avatar-active' classname
    $qall('.js-avatar').forEach((node) => {
      node.classList.remove('avatar-active');
    });
    el.classList.add('avatar-active');
    // Set user avatar
    userAvatar = el.dataset['avatar'];
    // Set user avatar URL
    userAvatarURL = el.querySelector('img').getAttribute('src');
    togglePINextVisibility();
  }

  function pauseAudio(audioRef) {
    audioRef.pause();
  }
  function playAudio(audioRef, isLoop = false) {
    audioRef.loop = isLoop;

    audioRef.play().catch((err) => {
      console.log('Audio is not played ', err);
    });
  }
  function setDOMEvents() {
    document.addEventListener('click', handlePageInteractionClick);
    colorSelectionList.forEach((el) => el.addEventListener('click', handleSelectionClick, false));
    vsComputerEl.addEventListener('click', handleVSComputerClick, false);
    backBtnEl.addEventListener('click', handleBackBtnClick, false);
    appBackBtnEl.addEventListener('click', handleAppBackBtnClick, false);
    playBtnEl.addEventListener('click', handlePlayBtnClick, false);
    backgroundPlayEl.addEventListener('click', handleBgPlayClick, false);
    // Onboarding: Personal Info (user name and avatar) screen
    piBackBtn.addEventListener('click', handlePIBackBtnClick, false);
    piNextBtn.addEventListener('click', handlePINextBtnClick, false);
    userNameInputEl.addEventListener('keypress', handleUserNameInteraction, false);
    userNameInputEl.addEventListener('change', handleUserNameInteraction, false);
    userAvatarList.forEach((el) => el.addEventListener('click', handleUserAvatarClick, false));
  }

  /*** Initialise Main Gameplay ***/
  function hideUnusedColorTokens(colorsArr) {
    if (!colorsArr.length) return false;

    colorsArr.forEach((color) => {
      $q(`.js-token-${color}-1`).classList.add('d-none');
      $q(`.js-token-${color}-2`).classList.add('d-none');
      $q(`.js-token-${color}-3`).classList.add('d-none');
      $q(`.js-token-${color}-4`).classList.add('d-none');
    });
  }
  function updateGameTokenStyles(selectedColor = '', computerColor = '') {
    // Update game token positions for computer player
    $q(`.js-token.js-token-${computerColor}-1`).classList.add('game-token-computer-1');
    $q(`.js-token.js-token-${computerColor}-2`).classList.add('game-token-computer-2');
    $q(`.js-token.js-token-${computerColor}-3`).classList.add('game-token-computer-3');
    $q(`.js-token.js-token-${computerColor}-4`).classList.add('game-token-computer-4');
    // Update game token positions for user player
    $q(`.js-token.js-token-${selectedColor}-1`).classList.add('game-token-user-1');
    $q(`.js-token.js-token-${selectedColor}-2`).classList.add('game-token-user-2');
    $q(`.js-token.js-token-${selectedColor}-3`).classList.add('game-token-user-3');
    $q(`.js-token.js-token-${selectedColor}-4`).classList.add('game-token-user-4');
  }
  function updateGameFortStyles(selectedColor = '', computerColor = '', unusedColorsArr = []) {
    const gameFortEl = $q('.js-game-fort');
    const borderTopColor = colorMap[computerColor];
    const borderRightColor = colorMap[unusedColorsArr[1]];
    const borderBottomColor = colorMap[selectedColor];
    const borderLeftColor = colorMap[unusedColorsArr[0]];
    const borderWidth = isMobileWidth ? '36px' : '75px';

    gameFortEl.style.setProperty('--game-fort-br-top', `${borderWidth} solid ${borderTopColor}`);
    gameFortEl.style.setProperty(
      '--game-fort-br-right',
      `${borderWidth} solid ${borderRightColor}`,
    );
    gameFortEl.style.setProperty(
      '--game-fort-br-bottom',
      `${borderWidth} solid ${borderBottomColor}`,
    );
    gameFortEl.style.setProperty('--game-fort-br-left', `${borderWidth} solid ${borderLeftColor}`);
  }
  function updateGameHouseStyles(selector, newColor) {
    const el = $q(selector);
    const newColorClsName = `bgcolor-${newColor}`;
    const currentColorClsName = Array.from(el.classList).find((item) => item.includes('bgcolor-'));

    el.classList.replace(currentColorClsName, newColorClsName);
    el.querySelectorAll('.token').forEach((node) => {
      node.classList.replace(currentColorClsName, newColorClsName);
    });
  }
  function updateGameTrackStyles(selector, newColor) {
    const el = $q(selector).querySelector('.track-dots');
    const newColorClsName = `bgcolor-${newColor}`;
    const currentColorClsName = Array.from(el.classList).find((item) => item.includes('bgcolor-'));

    // Update game track colors for all players
    el.classList.replace(currentColorClsName, newColorClsName);
  }
  function setupLayout(selectedColor = '', computerColor = '', unusedColorsArr = []) {
    // Update game house colors for computer player
    updateGameHouseStyles('.game-house:nth-of-type(2)', computerColor);
    // Update game house colors for user player
    updateGameHouseStyles('.game-house:nth-of-type(3)', selectedColor);
    // Update game house colors for unused top-left player
    updateGameHouseStyles('.game-house:nth-of-type(1)', unusedColorsArr[0]);
    // Update game house colors for unused bottom-right player
    updateGameHouseStyles('.game-house:nth-of-type(4)', unusedColorsArr[1]);

    // Update game track colors for computer player
    updateGameTrackStyles('.game-track.game-track-top', computerColor);
    // Update game track colors for user player
    updateGameTrackStyles('.game-track.game-track-bottom', selectedColor);
    // Update game track colors for unused top-left player
    updateGameTrackStyles('.game-track.game-track-left', unusedColorsArr[0]);
    // Update game track colors for unused bottom-right player
    updateGameTrackStyles('.game-track.game-track-right', unusedColorsArr[1]);

    // Update game token styles
    updateGameTokenStyles(selectedColor, computerColor);
    // Update game fort styles
    updateGameFortStyles(selectedColor, computerColor, unusedColorsArr);
  }
  function initGamePlay() {
    const activeColorsArr = getActiveColors(selectedColor);
    const unusedColorsArr = colorSequence.filter((item) => activeColorsArr.indexOf(item) === -1);

    splashScreenEl.classList.add('d-none');
    appEl.classList.remove('d-none');
    hideUnusedColorTokens(unusedColorsArr);
    hasGameStarted = true;
    computerColor = activeColorsArr[1];
    setupLayout(selectedColor, computerColor, unusedColorsArr);

    console.log('user color: ', selectedColor);
    console.log('computer color: ', computerColor);
    console.log('unused colors: ', unusedColorsArr);
  }

  console.log('Ludo game JS loaded.');
  setDOMEvents();
})();
