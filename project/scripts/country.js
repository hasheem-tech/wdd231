import { insights } from "../data/insights.mjs";
const params = new URLSearchParams(window.location.search);
const country = params.get("country");

document.title = country + " - Economy Explorer";

const country_name = document.getElementById("country_name");
const economy_summary = document.getElementById("economy_summary");

country_name.innerText = country;

function getInsights(country){
    const summary = insights?.[country]?.summary || "No data available";
    economy_summary.innerText = summary;
}

getInsights(country);


let gdpData = [];
let chartInstance = null;

/* ---------------- FORMATTER ---------------- */

function formatGDP(value) {
  if (value >= 1e12) {
    return (value / 1e12).toFixed(2) + "T";
  }
  if (value >= 1e9) {
    return (value / 1e9).toFixed(2) + "B";
  }
  if (value >= 1e6) {
    return (value / 1e6).toFixed(2) + "M";
  }
  return value;
}

/* ---------------- LOAD COUNTRY ---------------- */


async function loadGDP(country) {
  try {
    const res = await fetch("data/economic_data.json");
    gdpData = await res.json();

    renderGDP(country);
  } catch (err) {
    console.error("GDP load error:", err);
  }
}

loadGDP(country);

/* ---------------- RENDER CHART ---------------- */

function renderGDP(country) {
  const countryGDP = gdpData
    .filter(d => d["Country Name"] === country)
    .sort((a, b) => a.Year - b.Year);

  const labels = countryGDP.map(d => d.Year);
  const values = countryGDP.map(d => d.gdp);

  const ctx = document.getElementById("gdpChart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `${country} GDP`,
          data: values,
          borderWidth: 2,
          tension: 0.3,

          pointRadius: 0, // clean line only
          fill: false
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        mode: "index",
        intersect: false
      },

      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `GDP: ${formatGDP(context.parsed.y)}`;
            }
          }
        }
      },

      scales: {
        x: {
          title: {
            display: true,
            text: "Year"
          }
        },

        y: {
          ticks: {
            callback: function (value) {
              return formatGDP(value);
            }
          },
          title: {
            display: true,
            text: "GDP"
          }
        }
      }
    }
  });
}

function loadInsights(country) {
  const countryInsights = insights?.[country]?.insights || [];
  renderInsights(countryInsights);
}

function renderInsights(insights) {
  const container = document.getElementById("insightsContainer");

  container.innerHTML = "";

  insights.forEach(item => {
    const card = document.createElement("div");
    card.className = "insight-card";

    card.innerHTML = `
      <div class="insight-title">${item.title}</div>
      <div class="insight-desc">${item.description}</div>
      <div class="insight-meta">
        Score: ${item.score} • ${item.trend}
      </div>
    `;

    container.appendChild(card);
  });
}
loadInsights(country);


let economicData = [];
const charts = {};

/* ---------------- LOAD ---------------- */

async function loadData(country) {
  try {
    const res = await fetch("data/economic_data.json");
    economicData = await res.json();

    renderAllCharts(country);
  } catch (err) {
    console.error("Load error:", err);
  }
}

/* ---------------- FILTER ---------------- */

function getCountryData(country) {
  return economicData
    .filter(d => d["Country Name"] === country)
    .sort((a, b) => a.Year - b.Year);
}

/* ---------------- CHART FACTORY ---------------- */

function createLineChart(id, labels, values, label) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (charts[id]) charts[id].destroy();

  charts[id] = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label,
          data: values,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${label}: ${context.parsed.y}`;
            }
          }
        }
      },

      scales: {
        x: {
          title: {
            display: true,
            text: "Year"
          }
        },
        y: {
          title: {
            display: true,
            text: label
          }
        }
      }
    }
  });
}

/* ---------------- CHARTS ---------------- */

function renderGDPGrowth(country) {
  const data = getCountryData(country);
  createLineChart(
    "gdpGrowthChart",
    data.map(d => d.Year),
    data.map(d => d.gdp_growth),
    "GDP Growth Rate (%)"
  );
}

function renderGDPPerCapita(country) {
  const data = getCountryData(country);
  createLineChart(
    "gdpPerCapitaChart",
    data.map(d => d.Year),
    data.map(d => d.gdp_per_capita),
    "GDP Per Capita"
  );
}

function renderPopulation(country) {
  const data = getCountryData(country);
  createLineChart(
    "populationChart",
    data.map(d => d.Year),
    data.map(d => d.population),
    "Population"
  );
}

function renderTrade(country) {
  const data = getCountryData(country);
  createLineChart(
    "tradeChart",
    data.map(d => d.Year),
    data.map(d => d.trade_percent_gdp),
    "Trade (% of GDP)"
  );
}

function renderInflation(country) {
  const data = getCountryData(country);
  createLineChart(
    "inflationChart",
    data.map(d => d.Year),
    data.map(d => d.inflation),
    "Inflation Rate (%)"
  );
}

/* ---------------- MASTER ---------------- */

function renderAllCharts(country) {
  renderGDPGrowth(country);
  renderGDPPerCapita(country);
  renderPopulation(country);
  renderTrade(country);
  renderInflation(country);
}

/* ---------------- INIT ---------------- */

loadData(country);






let allEvents = [];

async function loadEvents(country) {
  try {
    const res = await fetch("data/events.json");

    if (!res.ok) throw new Error("Failed to fetch events");

    const data = await res.json();

    allEvents = Object.values(data)
      .flat()
      .filter(e => e.country === country);

    renderCarousel(allEvents);
  } catch (error) {
    console.error("Error loading events:", error);
  }
}

loadEvents(country);

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
  const event = allEvents[index];

  document.getElementById("modal-title").innerText = event.title;
  document.getElementById("modal-country").innerText = event.country;
  document.getElementById("modal-years").innerText =
    `${event.start_year} - ${event.end_year}`;

  document.getElementById("modal-article").innerText = event.article;

  document.getElementById("modal").classList.remove("hidden");
}

const closeModalBtn = document.getElementById("close-modal");
closeModalBtn.addEventListener("click", closeModal);

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}


const modal = document.getElementById("modal");
modal.addEventListener("click", closeModal);

const modalContent = document.querySelector(".modal-content");
modalContent.addEventListener("click", (e) => {
    e.stopPropagation();
});

