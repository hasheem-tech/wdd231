import { events } from '../data/events.mjs';

const container = document.getElementById('cards');

events.forEach(event => {
  const card = document.createElement('section');
  card.classList.add('card');

  card.innerHTML = `
    <h3>${event.name}</h3>
    <figure>
      <img src="${event.image}" alt="${event.name}">
    </figure>
    <address>${event.address}</address>
    <p>${event.description}</p>
    <button>Learn More</button>
  `;

  container.appendChild(card);
});



const modal = document.getElementById("visit-modal");
const messageEl = document.getElementById("visit-message");
const closeBtn = document.getElementById("close-modal");

const lastVisit = localStorage.getItem("lastVisit");
const now = Date.now();

let message = "";

if (!lastVisit) {
  message = "Welcome! Let us know if you have any questions.";
} else {
  const diffTime = now - Number(lastVisit);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    message = "Back so soon! Awesome!";
  } else if (diffDays === 1) {
    message = "You last visited 1 day ago.";
  } else {
    message = `You last visited ${diffDays} days ago.`;
  }
}

messageEl.textContent = message;

// show modal on load
modal.classList.remove("hidden");

// close button
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// save visit
localStorage.setItem("lastVisit", now);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});