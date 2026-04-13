import { insights } from "../data/insights.mjs";
let economicData = [];
const charts = {};

/* ---------------- METRICS CONFIG (FIXED ERROR HERE) ---------------- */

const metrics = [
  { id: "gdp", key: "gdp", title: "GDP (Total Output)" },
  { id: "gdpGrowth", key: "gdp_growth", title: "GDP Growth Rate (%)" },
  { id: "gdpPerCapita", key: "gdp_per_capita", title: "GDP Per Capita" },
  { id: "inflation", key: "inflation", title: "Inflation Rate (%)" },
  { id: "population", key: "population", title: "Population" },
  { id: "trade", key: "trade_percent_gdp", title: "Trade (% of GDP)" }
];

/* ---------------- LOAD DATA ---------------- */

async function loadData() {
  try {
    const res = await fetch("data/economic_data.json");
    economicData = await res.json();

    populateDropdowns();
    syncDropdowns();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}
loadData();

/* ---------------- POPULATE DROPDOWNS ---------------- */

function populateDropdowns() {
  const countries = [...new Set(economicData.map(d => d["Country Name"]))];

  const selectA = document.getElementById("countryA");
  const selectB = document.getElementById("countryB");

  countries.forEach(c => {
    const opt1 = document.createElement("option");
    opt1.value = c;
    opt1.innerText = c;

    const opt2 = document.createElement("option");
    opt2.value = c;
    opt2.innerText = c;

    selectA.appendChild(opt1);
    selectB.appendChild(opt2);
  });
  if (countries.length > 1) {
    selectA.value = countries[0]; // China
    selectB.value = countries[1]; // United States (or next)
  }
}


const selectA = document.getElementById("countryA");
const selectB = document.getElementById("countryB");

/* disable same option */
function syncDropdowns() {
  const valueA = selectA.value;
  const valueB = selectB.value;

  // reset all options first
  [...selectA.options].forEach(opt => opt.disabled = false);
  [...selectB.options].forEach(opt => opt.disabled = false);

  // disable selected in opposite dropdown
  if (valueA) {
    [...selectB.options].forEach(opt => {
      if (opt.value === valueA) opt.disabled = true;
    });
  }

  if (valueB) {
    [...selectA.options].forEach(opt => {
      if (opt.value === valueB) opt.disabled = true;
    });
  }
}

/* attach listeners */
selectA.addEventListener("change", syncDropdowns);
selectB.addEventListener("change", syncDropdowns);
/* ---------------- BUTTON HANDLER ---------------- */

const startCompareButton = document.getElementById("start-compare");

startCompareButton.onclick = function () {
  const countryA = document.getElementById("countryA").value;
  const countryB = document.getElementById("countryB").value;

  if (!countryA || !countryB) {
    alert("Please select two countries");
    return;
  }

  ComparisonTable(countryA, countryB);
};

/* ---------------- TABLE + GRAPH FLOW ---------------- */

function ComparisonTable(countryA, countryB) {

    const container = document.getElementById("comparison-grid");

    const insightsA = insights?.[countryA]?.insights || [];
    const insightsB = insights?.[countryB]?.insights || [];

    // collect all dimensions from both
    const dimensions = new Set([
        ...insightsA.map(i => i.dimension),
        ...insightsB.map(i => i.dimension)
    ]);

    container.innerHTML = "";

    // header row
    container.innerHTML += `
      <h2>Economic Structure</h2>
      <p>This table compares core economic dimensions such as production, innovation,
      labor, and governance. It helps identify where each country is structurally strong
      and where limitations exist.</p> 
    <div class="row header">
            
            <div>Dimension</div>
            <div>${countryA}</div>
            <div>${countryB}</div>
        </div>
    `;

    dimensions.forEach(dim => {
        const a = insightsA.find(x => x.dimension === dim);
        const b = insightsB.find(x => x.dimension === dim);

        container.innerHTML += `
            <div class="row">
                <div class="cell">
                    <strong>${dim}</strong>
                </div>

                <div class="cell">
                    ${a ? `
                        <div class="score">${a.score}/5</div>
                        <div class="title">${a.title}</div>
                    ` : "-"}
                </div>

                <div class="cell">
                    ${b ? `
                        <div class="score">${b.score}/5</div>
                        <div class="title">${b.title}</div>
                    ` : "-"}
                </div>
            </div>
        `;
    });

  renderGraphs(countryA, countryB);
}

/* ---------------- GRAPH RENDER ---------------- */

function renderGraphs(countryA, countryB) {
  const container = document.getElementById("comparison-grid");
   const chartsHeader = document.createElement("div");
  chartsHeader.className = "charts-header";

  chartsHeader.innerHTML = `
    <h2>Economic Trends Over Time</h2>
    <p>
      These charts show how key economic indicators have evolved over time.
      They provide a visual comparison of growth, stability, and overall economic performance.
    </p>
  `;

  container.appendChild(chartsHeader);

  let chartsWrapper = document.getElementById("charts-wrapper");

  if (!chartsWrapper) {
    chartsWrapper = document.createElement("div");
    chartsWrapper.id = "charts-wrapper";
    chartsWrapper.className = "charts-wrapper";

    container.appendChild(chartsWrapper);
  } else {
    chartsWrapper.innerHTML = "";
  }

  const countries = [countryA, countryB];

  metrics.forEach(metric => {
    createChartTile(chartsWrapper, metric, countries);
  });
}

/* ---------------- CREATE TILE ---------------- */

function createChartTile(parent, metric, countries) {
  const tile = document.createElement("div");
  tile.className = "chart-tile";

  const canvasId = "chart-" + metric.id;

  tile.innerHTML = `
    <h3>${metric.title}</h3>
    <canvas id="${canvasId}"></canvas>
  `;
  parent.appendChild(tile);

  createComparisonChart(canvasId, countries, metric.key, metric.title);
}

/* ---------------- CHART FUNCTION ---------------- */

function createComparisonChart(canvasId, countries, key, label) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  if (charts[canvasId]) charts[canvasId].destroy();

  const datasets = countries.map(country => {
    const data = economicData
      .filter(d => d["Country Name"] === country)
      .sort((a, b) => a.Year - b.Year);

    return {
      label: country,
      data: data.map(d => d[key]),
      borderWidth: 2,
      tension: 0.3,
      fill: false
    };
  });

  const base = economicData
    .filter(d => d["Country Name"] === countries[0])
    .sort((a, b) => a.Year - b.Year);

  charts[canvasId] = new Chart(ctx, {
    type: "line",
    data: {
      labels: base.map(d => d.Year),
      datasets
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
          mode: "index",
          intersect: false
        }
      },

      scales: {
        x: {
          title: { display: true, text: "Year" }
        },
        y: {
          title: { display: true, text: label },
          ticks: {
            callback: function(value) {
              if (value >= 1e12) return (value / 1e12).toFixed(1) + "T";
              if (value >= 1e9) return (value / 1e9).toFixed(1) + "B";
              if (value >= 1e6) return (value / 1e6).toFixed(1) + "M";
              return value;
            }
          }
        }
      }
    }
  });
}