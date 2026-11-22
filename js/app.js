/* Memory Match Game — 4x4 grid, 8 pairs. */
"use strict";

/* ---------- Pure logic (testable in node) ---------- */
const EMOJIS = ["🍕", "🚀", "🐶", "🌈", "🎸", "⚽", "🍓", "🦄"];
const PAIR_COUNT = 8;

function buildDeck() {
  const deck = EMOJIS.slice(0, PAIR_COUNT).flatMap((e) => [e, e]);
  // Fisher–Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return m + ":" + String(s).padStart(2, "0");
}

/* DOM BOOTSTRAP */
if (typeof document !== "undefined") {
  const $ = (id) => document.getElementById(id);
  const grid = $("card-grid");
  const movesEl = $("moves");
  const timerEl = $("timer");
  const pairsEl = $("pairs");
  const winBanner = $("win-banner");
  const winText = $("win-text");

  let deck, flipped, matchedCount, moves, seconds, timerId, lock, started, won;

  function newGame() {
    deck = buildDeck();
    flipped = [];
    matchedCount = 0;
    moves = 0;
    seconds = 0;
    lock = false;
    started = false;
    won = false;
    clearInterval(timerId);
    timerId = null;
    winBanner.classList.add("hidden");
    movesEl.textContent = "0";
    timerEl.textContent = "0:00";
    pairsEl.textContent = "0 / 8";
    grid.innerHTML = "";
    deck.forEach((emoji, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "memory-card";
      btn.dataset.index = i;
      btn.dataset.emoji = emoji;
      btn.setAttribute("aria-label", "Card " + (i + 1) + ", face down");
      btn.innerHTML =
        "<span class=\"memory-card-inner\">" +
        "<span class=\"memory-card-face memory-card-front\" aria-hidden=\"true\">?</span>" +
        "<span class=\"memory-card-face memory-card-back\" aria-hidden=\"true\">" + emoji + "</span>" +
        "</span>";
      btn.addEventListener("click", () => flipCard(btn));
      grid.appendChild(btn);
    });
  }

  function startTimer() {
    if (started) return;
    started = true;
    timerId = setInterval(() => {
      seconds += 1;
      timerEl.textContent = formatTime(seconds);
    }, 1000);
  }

  function flipCard(card) {
    if (lock || won) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;
    startTimer();
    card.classList.add("flipped");
    card.setAttribute("aria-label", "Card showing " + card.dataset.emoji);
    flipped.push(card);
    if (flipped.length === 2) {
      moves += 1;
      movesEl.textContent = moves;
      const [a, b] = flipped;
      if (a.dataset.emoji === b.dataset.emoji) {
        a.classList.add("matched");
        b.classList.add("matched");
        a.disabled = true;
        b.disabled = true;
        flipped = [];
        matchedCount += 1;
        pairsEl.textContent = matchedCount + " / 8";
        if (matchedCount === PAIR_COUNT) winGame();
      } else {
        lock = true;
        setTimeout(() => {
          a.classList.remove("flipped");
          b.classList.remove("flipped");
          a.setAttribute("aria-label", "Card face down");
          b.setAttribute("aria-label", "Card face down");
          flipped = [];
          lock = false;
        }, 900);
      }
    }
  }

  function winGame() {
    won = true;
    clearInterval(timerId);
    winText.textContent = "Finished in " + moves + " moves and " + formatTime(seconds) +
      " — that's " + matchedCount + " pairs matched. Sharp memory!";
    winBanner.classList.remove("hidden");
    showToast("🎉 You matched them all!");
    $("play-again-btn").focus();
  }

  $("restart-btn").addEventListener("click", () => { newGame(); showToast("Board reshuffled"); });
  $("play-again-btn").addEventListener("click", newGame);

  newGame();
  initChrome();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}

function initChrome() {
  const header = document.getElementById("site-header");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }, { passive: true });
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => menu.classList.remove("open")));
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}
