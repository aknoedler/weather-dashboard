var citySearchBtn = document.querySelector("#searchBtn");
var citySearchField = document.querySelector("#searchField");
var resultsSection = document.querySelector('#results');
var historySection = document.querySelector('#searchHistory');
var clearButton = document.querySelector('#clearHistory');
var recentSearches = JSON.parse(localStorage.getItem('storedSearches'));

var key = 'b261f7124e086b6cd8b5cdda662c5ba8';

function displayResults(cityName) {
    if (cityName) {
        let url = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + key;
        fetch(url)
            .then(function (response) {
                return response.json();
            }).then(function (result) {
                if (result.length) {
                    let cityTitle = document.createElement('h2');
                    cityTitle.textContent = "Here's the forecast for " + cityName + ":";
                    resultsSection.appendChild(cityTitle);
                    let coordinates = "lat=" + result[0].lat + "&lon=" + result[0].lon;
                    createCurrentCard(coordinates);
                    createForecastCards(coordinates);
                    if (citySearchField.value) {
                        addToHistory(citySearchField.value);
                    }
                    citySearchField.value = '';
                } else {
                    let errorMessage = document.createElement('h2');
                    errorMessage.textContent = '"' + cityName + '" was not found. Please enter a city name.';
                    resultsSection.appendChild(errorMessage);
                }

            })
    } else {
        let errorMessage = document.createElement('h2');
        errorMessage.textContent = 'Please enter a city name!';
        resultsSection.appendChild(errorMessage);
    }
}

function createCurrentCard(coordinates) {
    let url = 'https://api.openweathermap.org/data/2.5/weather?' + coordinates + '&appid=' + key + "&units=imperial";
    fetch(url)
        .then(function (response) {
            return response.json();
        }).then(function (result) {
            let main = result.weather[0].main;
            let currentCard = document.createElement('div');
            let displayDate = document.createElement('h3');
            let mainIcon = document.createElement('i');
            let displayMain = document.createElement('h3');
            let displayInfo = document.createElement('div');

            currentCard.setAttribute('class', 'card currentWeather');
            displayDate.textContent = moment().format('MMM Do YYYY');
            displayMain.textContent = main;
            displayMain.setAttribute('style', "display: inline");
            displayInfo.setAttribute('class', 'card-content');
            displayInfo.textContent = "Temp: " + result.main.temp + "\u00B0\nHumidity: " + result.main.humidity + "%\nWind Speed: " + result.wind.speed + " mph";

            switch (main) {
                case "Thunderstorm":
                    mainIcon.setAttribute('class', 'fa-solid fa-cloud-bolt fa-2x')
                    break;
                case "Drizzle":
                    mainIcon.setAttribute('class', 'fa-solid fa-cloud-rain fa-2x')
                    break;
                case "Rain":
                    mainIcon.setAttribute('class', 'fa-solid fa-cloud-showers-heavy fa-2x')
                    break;
                case "Snow":
                    mainIcon.setAttribute('class', 'fa-solid fa-snowflake fa-2x')
                    break;
                case "Clear":
                    mainIcon.setAttribute('class', 'fa-solid fa-sun fa-2x')
                    break;
                case "Clouds":
                    mainIcon.setAttribute('class', 'fa-solid fa-cloud fa-2x')
                    break;
                default:
                    mainIcon.setAttribute('class', 'fa-solid fa-smog fa-2x')

            }

            resultsSection.appendChild(currentCard);
            currentCard.appendChild(displayDate);
            currentCard.appendChild(mainIcon);
            currentCard.appendChild(displayMain);
            currentCard.appendChild(displayInfo);

        })
}

function createForecastCards(coordinates) {
    let url = 'https://api.openweathermap.org/data/2.5/forecast?' + coordinates + '&appid=' + key + "&units=imperial";
    fetch(url)
        .then(function (response) {
            return response.json();
        }).then(function (result) {
            let forecastTimestamps = pickForecasts(result);
            for (i = 0; i < 5; i++) {
                let main = result.list[forecastTimestamps[i]].weather[0].main;
                let currentCard = document.createElement('div');
                let displayDate = document.createElement('h4');
                let mainIcon = document.createElement('i');
                let displayMain = document.createElement('h4');
                let displayInfo = document.createElement('div');

                currentCard.setAttribute('class', 'card forecastWeather');
                displayDate.textContent = moment(result.list[forecastTimestamps[i]].dt_txt).format('MMM Do YYYY');
                displayMain.textContent = main;
                displayMain.setAttribute('style', "display: inline");
                displayInfo.setAttribute('class', 'card-content');
                displayInfo.textContent = "Temp: " + result.list[forecastTimestamps[i]].main.temp
                    + "\u00B0\nHumidity: " + result.list[forecastTimestamps[i]].main.humidity + "%\nWind Speed: "
                    + result.list[forecastTimestamps[i]].wind.speed + " mph";

                switch (main) {
                    case "Thunderstorm":
                        mainIcon.setAttribute('class', 'fa-solid fa-cloud-bolt')
                        break;
                    case "Drizzle":
                        mainIcon.setAttribute('class', 'fa-solid fa-cloud-rain')
                        break;
                    case "Rain":
                        mainIcon.setAttribute('class', 'fa-solid fa-cloud-showers-heavy')
                        break;
                    case "Snow":
                        mainIcon.setAttribute('class', 'fa-solid fa-snowflake')
                        break;
                    case "Clear":
                        mainIcon.setAttribute('class', 'fa-solid fa-sun')
                        break;
                    case "Clouds":
                        mainIcon.setAttribute('class', 'fa-solid fa-cloud')
                        break;
                    default:
                        mainIcon.setAttribute('class', 'fa-solid fa-smog')

                }

                resultsSection.appendChild(currentCard);
                currentCard.appendChild(displayDate);
                currentCard.appendChild(mainIcon);
                currentCard.appendChild(displayMain);
                currentCard.appendChild(displayInfo);

            }
        })
}

function pickForecasts(result) {
    let currentDay = moment().format().split('T')[0];
    let pickedForecasts = [];
    for (i = 0; i < 40; i++) {
        let forecastDate = result.list[i].dt_txt.split(' ')[0];
        let forecastTime = result.list[i].dt_txt.split(' ')[1];
        if (forecastDate != currentDay && forecastTime == '12:00:00') {
            pickedForecasts.push(i);
        }
    }
    return pickedForecasts;
}

function clearResults() {
    var resultsElements = Array.from(resultsSection.children);
    resultsElements.forEach(element => {
        element.remove();
    });
}

function addToHistory(cityName) {
    for (i = 0; i < recentSearches.length; i++) {
        if (recentSearches[i] == cityName) {
            return;
        }
    }
    recentSearches.push(cityName);
    localStorage.setItem('storedSearches', JSON.stringify(recentSearches));
    let newButton = document.createElement('button');
    newButton.setAttribute('class', 'city');
    newButton.textContent = cityName;
    historySection.appendChild(newButton);
    newButton.addEventListener('click', function () {
        clearResults();
        displayResults(newButton.textContent);
    })
}

citySearchBtn.addEventListener('click', function (event) {
    event.preventDefault();
    clearResults();
    displayResults(citySearchField.value);
})

clearButton.addEventListener('click', function () {
    recentSearches = [];
    localStorage.setItem('storedSearches', JSON.stringify(recentSearches));
    var historyElements = Array.from(historySection.children);
    historyElements.forEach(element => {
        if (element.className == 'city') {
            element.remove();
        }
    });
})

function init() {
    if (recentSearches) {
        for (i = 0; i < recentSearches.length; i++) {
            let newButton = document.createElement('button');
            newButton.setAttribute('class', 'city');
            newButton.textContent = recentSearches[i];
            historySection.appendChild(newButton);
            newButton.addEventListener('click', function () {
                clearResults();
                displayResults(newButton.textContent);
            })
        }

    } else {
        recentSearches = [];
    }
}

init();