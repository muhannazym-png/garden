document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const introWord = document.querySelector(".intro-word");
  const gardenApp = document.getElementById("gardenApp");

  const holdButton = document.getElementById("holdButton");
  const holdProgressWrap = document.getElementById("holdProgressWrap");
  const holdProgress = document.getElementById("holdProgress");
  const holdMessage = document.getElementById("holdMessage");

  const typeText = "our little garden";
  let typeIndex = 0;

  function typeIntro() {
    if (typeIndex < typeText.length) {
      introWord.textContent += typeText[typeIndex];
      typeIndex += 1;
      setTimeout(typeIntro, 115);
    }
  }

  typeIntro();

  function openGarden() {
    if (intro.classList.contains("hidden")) return;

    intro.classList.add("hidden");
    gardenApp.classList.remove("hidden");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  intro.addEventListener("click", openGarden);

  const stages = [
    ...document.querySelectorAll(".story-stage")
  ];

  function showStage(id) {
    stages.forEach(stage => {
      stage.classList.remove("active-stage");
      stage.classList.add("hidden");
    });

    const nextStage = document.getElementById(id);

    if (!nextStage) return;

    nextStage.classList.remove("hidden");

    requestAnimationFrame(() => {
      nextStage.classList.add("active-stage");
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-next]");

    if (!button) return;

    const nextId = button.dataset.next;

    showStage(nextId);
  });

  holdProgressWrap.classList.add("hidden");

  let pressStart = 0;
  let animationFrame = null;
  let holding = false;
  let completed = false;

  function stopHolding() {
    if (!holding || completed) return;

    holding = false;

    holdButton.classList.remove("holding");

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    const current = Math.max(
      0,
      Math.min(
        100,
        ((performance.now() - pressStart) / 10000) * 100
      )
    );

    holdProgress.style.width = `${current}%`;

    holdMessage.textContent =
      current >= 100
        ? "planted"
        : "keep holding...";
  }

  function updateHoldProgress(now) {
    if (!holding) return;

    const elapsed = now - pressStart;

    const percent = Math.min(
      100,
      (elapsed / 10000) * 100
    );

    holdProgress.style.width = `${percent}%`;

    if (elapsed >= 10000) {
      completed = true;
      holding = false;

      holdButton.classList.remove("holding");

      holdMessage.textContent =
        "the seed is planted 🌱";

      setTimeout(() => {
        showStage("seeds-reveal");
      }, 700);

      return;
    }

    animationFrame =
      requestAnimationFrame(updateHoldProgress);
  }

  function startHolding(event) {
    if (completed) return;

    event.preventDefault();

    holding = true;

    pressStart = performance.now();

    holdButton.classList.add("holding");

    holdProgressWrap.classList.remove("hidden");

    holdMessage.textContent = "keep holding...";

    holdProgress.style.width = "0%";

    if (
      holdButton.setPointerCapture &&
      event.pointerId !== undefined
    ) {
      try {
        holdButton.setPointerCapture(
          event.pointerId
        );
      } catch (_) {}
    }

    animationFrame =
      requestAnimationFrame(updateHoldProgress);
  }

  holdButton.addEventListener(
    "pointerdown",
    startHolding
  );

  holdButton.addEventListener(
    "pointerup",
    stopHolding
  );

  holdButton.addEventListener(
    "pointercancel",
    stopHolding
  );

  holdButton.addEventListener(
    "pointerleave",
    (event) => {
      if (event.buttons === 0) return;

      stopHolding();
    }
  );

  holdButton.addEventListener(
    "selectstart",
    (event) => {
      event.preventDefault();
    }
  );

  const downArrow =
    document.querySelector(".down-arrow");

  if (downArrow) {
    downArrow.addEventListener("click", () => {
      document
        .getElementById("final-message")
        .scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    });
  }
});