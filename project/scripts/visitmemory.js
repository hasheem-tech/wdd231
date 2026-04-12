const visitModal = document.getElementById("visit-modal");
const messageEl = document.getElementById("visit-message");
const visitCloseBtn = document.getElementById("close-visit-modal");

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
visitModal.classList.remove("hidden");

// close button
visitCloseBtn.addEventListener("click", () => {
  visitModal.classList.add("hidden");
});

// save visit
localStorage.setItem("lastVisit", now);

visitModal.addEventListener("click", (e) => {
  if (e.target === visitModal) {
    visitModal.classList.add("hidden");
  }
});