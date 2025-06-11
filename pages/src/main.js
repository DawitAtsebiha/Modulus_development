const allSlideLeftEls  = document.querySelectorAll(".slide-from-left");
const allSlideRightEls = document.querySelectorAll(".slide-from-right");
import { pool } from './db.js';


function animateOnScroll() {
  allSlideLeftEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.remove("-translate-x-full", "opacity-0");
    }
  });

  allSlideRightEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.remove("translate-x-full", "opacity-0");
    }
  });
}

window.addEventListener("scroll", animateOnScroll);
window.addEventListener("DOMContentLoaded", animateOnScroll);

const words      = ["Physics", "Calculus 1", "Java"];
const wrapper    = document.getElementById("changingText").parentNode; // the container around "Learn "
const TYPING      = 150;
const BACKSPACE   = 100;
const PAUSE       = 1000;

let mode        = "cycle";   // "cycle" → loop words, "final1" → typing "Become an ", "final2" → typing "Engineer"
let wIndex      = 0;
let cIndex      = 0;
let deleting    = false;

// helper to pick a pastel
function randomPastel() {
  const h = Math.floor(Math.random() * 361);
  const s = 70 + Math.random() * 20 | 0;
  const l = 80 + Math.random() * 10 | 0;
  return `hsl(${h},${s}%,${l}%)`;
}

// main tick
function tick() {
  if (mode === "final1" || mode === "final2") return tickFinal();

  // ── cycling Physics/Calculus/Java ──
  const span = wrapper.querySelector("#changingText");
  const word = words[wIndex];

  if (!deleting && cIndex === 0) span.style.color = randomPastel();

  if (!deleting) {
    span.textContent = word.slice(0, ++cIndex);
    if (cIndex === word.length) {
      deleting = true;
      return setTimeout(tick, PAUSE);
    }
  } else {
    span.textContent = word.slice(0, --cIndex);
    if (cIndex === 0) {
      if (wIndex === words.length - 1) {
        // after last word, start final1
        return startFinal();
      }
      deleting = false;
      wIndex = (wIndex + 1) % words.length;
    }
  }
  setTimeout(tick, deleting ? BACKSPACE : TYPING);
}


function startFinal() {
  mode = "final1";

  wrapper.textContent = "";

  const s1 = document.createElement("span");
  s1.id = "final1";
  wrapper.appendChild(s1);

  wrapper.appendChild(document.createElement("br"));
  const s2 = document.createElement("span");
  s2.id = "final2";
  wrapper.appendChild(s2);
  cIndex = 0;
  deleting = false;
  setTimeout(tick, TYPING);
}

function tickFinal() {
  const partText = mode === "final1"
    ? "Become an " 
    : "Engineer";

  const span = document.getElementById(mode);

  span.style.color = randomPastel();

  span.textContent = partText.slice(0, ++cIndex);

  if (cIndex < partText.length) {
    return setTimeout(tickFinal, TYPING);
  }

  if (mode === "final1") {
    mode = "final2";
    cIndex = 0;
    setTimeout(tickFinal, TYPING);
  }
}

document.addEventListener("DOMContentLoaded", tick);