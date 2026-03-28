const apiKey = '15026cb5e642d7b0345cb982524225ad';
const lat = 32.1877;
const lon = 74.1945;

// Fetch current weather
async function fetchCurrentWeather() {
    const weatherElement = document.getElementById('currentWeather');
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    if(!res.ok) throw new Error('Failed to fetch current weather');
    const data = await res.json();

    weatherElement.innerHTML = `
      <p>${data.main.temp.toFixed(1)}°C</p>
      <p>${data.weather[0].description}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind: ${data.wind.speed} m/s</p>
    `;
  } catch(err) {
    weatherElement.textContent = 'Failed to load weather data';
    console.error(err);
  }
  }

async function fetchWeatherForecast() {
  const forecastGrid = document.getElementById('forecastGrid');
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    if(!res.ok) throw new Error('Failed to fetch forecast');
    const data = await res.json();

    forecastGrid.innerHTML = ''; // clear previous

    const now = new Date();
    const todayDate = now.getDate();
    const tomorrowDate = new Date(now.getTime() + 24*60*60*1000).getDate();
    const dayAfterDate = new Date(now.getTime() + 2*24*60*60*1000).getDate();

    let todayTemp, todayDesc, tomorrowTemp, tomorrowDesc, dayAfterTemp, dayAfterDesc;

    for (const f of data.list) {
      const fDate = new Date(f.dt * 1000);
      const fDay = fDate.getDate();

      if (fDay === todayDate && !todayTemp) {
        todayTemp = f.main.temp;
        todayDesc = f.weather[0].description;
      } else if (fDay === tomorrowDate && !tomorrowTemp) {
        tomorrowTemp = f.main.temp;
        tomorrowDesc = f.weather[0].description;
      } else if (fDay === dayAfterDate && !dayAfterTemp) {
        dayAfterTemp = f.main.temp;
        dayAfterDesc = f.weather[0].description;
      }

      if (todayTemp && tomorrowTemp && dayAfterTemp) break;
    }


    const days = [
      { label: 'Today', temp: todayTemp, desc: todayDesc },
      { label: 'Tomorrow', temp: tomorrowTemp, desc: tomorrowDesc },
      { label: 'Day After Tomorrow', temp: dayAfterTemp, desc: dayAfterDesc }
    ];

    days.forEach(day => {
      const card = document.createElement('div');
      card.style.padding = '10px';
      card.style.background = '#f0f0f0';
      card.style.borderRadius = '5px';
      card.innerHTML = `<strong>${day.label}</strong>: ${day.temp !== undefined ? day.temp.toFixed(1) + '°C' : 'N/A'} - ${day.desc || ''}`;
      forecastGrid.appendChild(card);
    });

  } catch(err) {
    forecastGrid.innerHTML = '<p>Failed to load forecast</p>';
    console.error(err);
  }
}

fetchCurrentWeather();
fetchWeatherForecast();