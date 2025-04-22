(function() {
  /** Set Global variables and cache DOM element refs **/
  let selectedColor = "";
  let hasGameStarted = false;
  const vsComputerEl = document.getElementById("vs-computer");
  const colorSelectionList = document.querySelectorAll(".js-color-selection");
  const csContainerEl = document.querySelector(".js-cs-wrapper");
  const heroBtnContainerEl = document.querySelector(".js-hero-buttons");
  const ctaButtonContainerEl = document.querySelector(".js-cta-buttons");
  const backBtnEl = document.querySelector(".js-back-btn");
  const playBtnEl = document.querySelector(".js-play-btn");
  const splashScreenEl = document.querySelector(".js-splashScreen");
  const appEl = document.querySelector(".js-app");

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

    splashScreenEl.classList.add("d-none");
    appEl.classList.remove("d-none");
    hasGameStarted = true;
  }

  function setDOMEvents() {
    colorSelectionList.forEach((el) => el.addEventListener("click", handleSelectionClick, false));
    vsComputerEl.addEventListener("click", handleVSComputerClick, false);
    backBtnEl.addEventListener("click", handleBackBtnClick, false);
    playBtnEl.addEventListener("click", handlePlayBtnClick, false);
  }

  console.log("Ludo game JS loaded.");
  setDOMEvents();
})();
