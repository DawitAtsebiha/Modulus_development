const allSlideLeftEls  = document.querySelectorAll(".slide-from-left");
const allSlideRightEls = document.querySelectorAll(".slide-from-right");

// Animation variables
const words      = ["Physics", "Calculus 1", "Java"];
const wrapper    = document.getElementById("changingText")?.parentNode;
const TYPING      = 150;
const BACKSPACE   = 100;
const PAUSE       = 1000;
let mode        = "cycle";
let wIndex      = 0;
let cIndex      = 0;
let deleting    = false;
let animationStarted = false; // Flag to ensure animation only runs once

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
  
  // Check if typing animation should start
  if (!animationStarted && wrapper) {
    const rect = wrapper.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      animationStarted = true;
      tick(); // Start the typing animation
    }
  }
}

// Helper to pick a pastel color
function randomPastel() {
  const h = Math.floor(Math.random() * 361);
  const s = 70 + Math.random() * 20 | 0;
  const l = 80 + Math.random() * 10 | 0;
  return `hsl(${h},${s}%,${l}%)`;
}

// Main tick function
function tick() {
  if (mode === "final1" || mode === "final2") return tickFinal();
  
  // Cycling Physics/Calculus/Java
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
        // After last word, start final
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
  const partText = mode === "final1" ? "Become an " : "Engineer";
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

// Event listeners
window.addEventListener("scroll", animateOnScroll);
window.addEventListener("DOMContentLoaded", animateOnScroll);