/**
 * Pull Cord Lamp — script.js
 * Interactive hanging lamp with draggable pull cord, sound, and persistence.
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /*  DOM references                                                     */
  /* ------------------------------------------------------------------ */

  const body = document.body;
  const lampSwing = document.getElementById("lampSwing");
  const lampBulb = document.getElementById("lampBulb");
  const pullCord = document.getElementById("pullCord");
  const cordLine = document.getElementById("cordLine");
  const cordHandle = document.getElementById("cordHandle");
  const statusLabel = document.getElementById("statusLabel");
  const brightnessControl = document.getElementById("brightnessControl");
  const brightnessSlider = document.getElementById("brightnessSlider");
  const soundToggle = document.getElementById("soundToggle");
  const styleButtons = document.querySelectorAll(".style-btn");

  /* ------------------------------------------------------------------ */
  /*  State                                                              */
  /* ------------------------------------------------------------------ */

  const STORAGE_KEY = "pullCordLamp";
  const PULL_THRESHOLD = 30; // px drag distance to trigger pull on release

  let isOn = false;
  let brightness = 85;
  let lampStyle = "classic";
  let soundEnabled = true;
  let hasEverTurnedOn = false;
  let isDragging = false;
  let dragStartY = 0;
  let dragCurrentY = 0;
  let dragDistance = 0;
  let pullTriggeredThisGesture = false;
  let isAnimating = false;

  /** Load persisted settings from localStorage */
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        isOn = Boolean(saved.isOn);
        brightness = saved.brightness ?? 85;
        lampStyle = saved.lampStyle ?? "classic";
        soundEnabled = saved.soundEnabled ?? true;
        hasEverTurnedOn = Boolean(saved.hasEverTurnedOn);
      }
    } catch {
      /* ignore corrupt storage */
    }
  }

  /** Persist current settings */
  function saveState() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ isOn, brightness, lampStyle, soundEnabled, hasEverTurnedOn })
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Sound — soft click via Web Audio API (no external files)           */
  /* ------------------------------------------------------------------ */

  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  /** Play a short mechanical click */
  function playClickSound() {
    if (!soundEnabled) return;

    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Short noise burst filtered to sound like a plastic click
      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1800;
      filter.Q.value = 2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      source.stop(now + 0.05);
    } catch {
      /* audio unavailable — silently skip */
    }
  }

  /* ------------------------------------------------------------------ */
  /*  UI updates                                                         */
  /* ------------------------------------------------------------------ */

  function applyBrightness(value) {
    brightness = value;
    body.style.setProperty("--brightness", (value / 100).toFixed(2));
    brightnessSlider.value = value;
    brightnessSlider.setAttribute("aria-valuenow", value);
    saveState();
  }

  function applyLampStyle(style) {
    lampStyle = style;
    body.classList.remove("style-classic", "style-modern", "style-industrial");
    body.classList.add(`style-${style}`);

    styleButtons.forEach((btn) => {
      const active = btn.dataset.style === style;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    saveState();
  }

  function updateUI() {
    body.classList.toggle("lamp-on", isOn);
    body.classList.toggle("lamp-off", !isOn);

    statusLabel.textContent = isOn ? "Lamp is ON" : "Lamp is OFF";
    pullCord.setAttribute("aria-pressed", String(isOn));
    pullCord.setAttribute(
      "aria-label",
      isOn
        ? "Pull cord to turn lamp off. Drag down or press Space or Enter."
        : "Pull cord to turn lamp on. Drag down or press Space or Enter."
    );

    // Show brightness slider only when lamp is on
    brightnessControl.hidden = !isOn;

    applyBrightness(brightness);
    applyLampStyle(lampStyle);
    soundToggle.checked = soundEnabled;
  }

  /* ------------------------------------------------------------------ */
  /*  Pull animation & toggle                                            */
  /* ------------------------------------------------------------------ */

  /** Respect reduced-motion preference */
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /** Run the full pull sequence: stretch, click, swing, bounce, toggle */
  function triggerPull() {
    if (isAnimating) return;
    isAnimating = true;

    playClickSound();

    if (!prefersReducedMotion()) {
      // Cord pull animation
      cordHandle.classList.add("pulling");
      cordLine.classList.add("bouncing");
      lampSwing.classList.add("swinging");

      cordHandle.addEventListener(
        "animationend",
        () => cordHandle.classList.remove("pulling"),
        { once: true }
      );
      cordLine.addEventListener(
        "animationend",
        () => cordLine.classList.remove("bouncing"),
        { once: true }
      );
      lampSwing.addEventListener(
        "animationend",
        () => {
          lampSwing.classList.remove("swinging");
          isAnimating = false;
        },
        { once: true }
      );
    } else {
      isAnimating = false;
    }

    // Reset cord stretch
    cordLine.style.height = "";
    cordLine.classList.remove("stretching");

    // Toggle lamp state
    isOn = !isOn;

    // First-time flicker on initial turn-on
    if (isOn && !hasEverTurnedOn && !prefersReducedMotion()) {
      hasEverTurnedOn = true;
      lampBulb.classList.add("flickering");
      lampBulb.addEventListener(
        "animationend",
        () => lampBulb.classList.remove("flickering"),
        { once: true }
      );
    } else if (isOn) {
      hasEverTurnedOn = true;
    }

    updateUI();
    saveState();
  }

  /* ------------------------------------------------------------------ */
  /*  Drag interaction                                                   */
  /* ------------------------------------------------------------------ */

  function onDragStart(clientY) {
    if (isAnimating) return;
    isDragging = true;
    pullTriggeredThisGesture = false;
    dragStartY = clientY;
    dragCurrentY = clientY;
    dragDistance = 0;
    cordLine.classList.add("stretching");
  }

  function onDragMove(clientY) {
    if (!isDragging) return;
    dragCurrentY = clientY;
    dragDistance = Math.max(0, dragCurrentY - dragStartY);

    const stretch = Math.min(dragDistance * 0.6, 40);
    cordLine.style.height = `${90 + stretch}px`;
    cordHandle.style.transform = `translateY(${stretch}px)`;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    // Reset handle position
    cordHandle.style.transform = "";

    if (dragDistance >= PULL_THRESHOLD) {
      pullTriggeredThisGesture = true;
      triggerPull();
    } else {
      // Snap cord back without toggling
      cordLine.style.height = "";
      cordLine.classList.remove("stretching");
    }
  }

  /* Pointer events (mouse + touch) */
  pullCord.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    pullCord.setPointerCapture(e.pointerId);
    onDragStart(e.clientY);
  });

  pullCord.addEventListener("pointermove", (e) => {
    if (isDragging) onDragMove(e.clientY);
  });

  pullCord.addEventListener("pointerup", (e) => {
    pullCord.releasePointerCapture(e.pointerId);
    onDragEnd();
  });

  pullCord.addEventListener("pointercancel", onDragEnd);

  /* Click without significant drag also triggers pull */
  pullCord.addEventListener("click", (e) => {
    if (pullTriggeredThisGesture || dragDistance >= PULL_THRESHOLD) return;
    e.preventDefault();
    pullTriggeredThisGesture = true;
    triggerPull();
  });

  /* ------------------------------------------------------------------ */
  /*  Keyboard accessibility                                             */
  /* ------------------------------------------------------------------ */

  pullCord.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      triggerPull();
    }
  });

  /* ------------------------------------------------------------------ */
  /*  Control panel listeners                                            */
  /* ------------------------------------------------------------------ */

  brightnessSlider.addEventListener("input", (e) => {
    applyBrightness(Number(e.target.value));
  });

  soundToggle.addEventListener("change", (e) => {
    soundEnabled = e.target.checked;
    saveState();
  });

  styleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLampStyle(btn.dataset.style);
    });
  });

  /* ------------------------------------------------------------------ */
  /*  Init                                                               */
  /* ------------------------------------------------------------------ */

  loadState();
  updateUI();

})();
