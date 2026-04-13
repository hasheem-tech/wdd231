import { insights } from "../data/insights.mjs";
const hero = document.querySelector(".hero-section");
$(function () {
        $(hero).mapael({
            map : {
            name : "world_countries",
            zoom: {
                enabled: true,
                maxlevel: 10
            },
            defaultArea:{
                attrs:{
                    fill: "grey",
                    stroke: "black",
                    "stroke-width":.3
                },
                attrsHover:{
                   fill: "grey",
                    stroke: "black",
                    "stroke-width":.3 
                },
                eventHandlers: {
                 click: function (e) {
                    e.preventDefault();
                    return false;
                }
}
            }
        },
          areas: {
            "CN": {
                attrs: { 
                    fill: "#1976d2" 
                },
                attrsHover: {
                    fill: "#072847",
                    cursor: "pointer"
                },
                eventHandlers: {
                    click: function () {
                        window.location.href = "country.html?country=China";
                    }
                }
            },

            "US": {
                attrs: { 
                    fill: "#1976d2" 
                },
                attrsHover: {
                    fill: "#072847",
                    cursor: "pointer"
                },
                eventHandlers: {
                    click: function () {
                        window.location.href = "country.html?country=United States";
                    },
                }
            },
            "DE": {
                 attrs: { 
                    fill: "#1976d2" 
                },
                attrsHover: {
                    fill: "#072847",
                    cursor: "pointer"
                },
                eventHandlers: {
                    click: function () {
                        window.location.href = "country.html?country=Germany";
                    }
                }
            }
        }
    });
});


const countrySelect = document.getElementById("countrySelect");
const goBtn = document.getElementById("goBtn");

/* fetch and populate */
function loadCountries() {
    const countries = Object.keys(insights);

    countries.forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.innerText = country;

    countrySelect.appendChild(option);
  });
}

loadCountries();

/* button click → go to country page */
goBtn.addEventListener("click", () => {
  const selected = countrySelect.value;

  if (!selected) {
    alert("Please select a country");
    return;
  }

  // redirect with query param
  window.location.href = `country.html?country=${encodeURIComponent(selected)}`;
});



let allFeaturedEvents = [];

async function loadEvents() {
  try {
    const res = await fetch("data/events.json");

    if (!res.ok) throw new Error("Failed to fetch events");

    const data = await res.json();

    allFeaturedEvents = Object.values(data)
      .flat()
      .filter(e => e.featured === true);

    renderCarousel(allFeaturedEvents);
  } catch (error) {
    console.error("Error loading featured events:", error);
  }
}
loadEvents();

function renderCarousel(events) {
  const carousel = document.getElementById("carousel");

  events.forEach((event, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="meta">${event.country} • ${event.start_year} - ${event.end_year}</div>
      <h3>${event.title}</h3>
      <p>${event.summary}</p>
      <button onclick="openModal(${index})">See more</button>
    `;

    carousel.appendChild(card);
  });
}

function openModal(index) {
  const event = allFeaturedEvents[index];

  document.getElementById("modal-title").innerText = event.title;
  document.getElementById("modal-country").innerText = event.country;
  document.getElementById("modal-years").innerText =
    `${event.start_year} - ${event.end_year}`;

  document.getElementById("modal-article").innerText = event.article;

  document.getElementById("modal").classList.remove("hidden");

}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

const closeModalBtn = document.getElementById("close-modal");
closeModalBtn.addEventListener("click", closeModal);


const modal = document.getElementById("modal");
modal.addEventListener("click", closeModal);

const modalContent = document.querySelector(".modal-content");
modalContent.addEventListener("click", (e) => {
    e.stopPropagation();
});