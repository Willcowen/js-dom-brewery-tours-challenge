const state = {
  breweries: [],
  filter: "",
  filteredBreweries: [],
  visitList: [],
};

const breweryLiEl = document.querySelector("#breweries-list");
const searchBar = document.querySelector(".search-bar");
const formEl = document.querySelector("#select-state-form");
const searchEl = document.querySelector("#select-state");
const searchInputEl = document.querySelector("#search-breweries");
const filterChoice = document.querySelector("#filter-by-type");
const aside = document.querySelector("aside");
aside.hidden = true;
const h1 = document.querySelector("h1");
h1.hidden = true;
const article = document.querySelector("article");
article.hidden = true;
const asideDiv = document.querySelector(".aside-div");

function fetchBreweries() {
  formEl.addEventListener("submit", function (e) {
    e.preventDefault();
    fetchAPI();
  });

  const filterForm = document.querySelector("#filter-by-type-form");

  filterForm.addEventListener("change", function () {
    fetchAPI();
    state.filter = filterChoice.value;
  });

  searchInputEl.addEventListener("input", function (e) {
    searchInputEl.value.toUpperCase() === searchInputEl.value.toLowerCase();
    state.filteredBreweries = state.breweries.filter((brewery) =>
      brewery.name.includes(searchInputEl.value)
    );
    render();
  });
}

function fetchAPI() {
  let url = `https://api.openbrewerydb.org/breweries?by_state=${searchEl.value}&per_page=50`;
  if (filterChoice.value) {
    url += `&by_type=${filterChoice.value}`;
  }
  fetch(url)
    .then((res) => res.json())
    .then(function (breweries) {
      state.breweries = breweries;
      render();
      searchBar.hidden = false;
    });
}

function renderBreweries() {
  for (const brewery of state.breweries) {
    checkTypeAndRender(brewery);
  }
}

function checkTypeAndRender(brewery) {
  if (
    brewery.brewery_type == "micro" ||
    brewery.brewery_type == "regional" ||
    brewery.brewery_type == "brewpub"
  ) {
    const li = document.createElement("li");
    li.innerHTML = `
  <h2>${brewery.name}</h2>
  <div class="type">${brewery.brewery_type}</div>
  <section class="address">
    <h3>Address:</h3>
    <p>${brewery.street}</p>
    <p><strong>${brewery.city}, ${brewery.postal_code}</strong></p>
  </section>
  <section class="phone">
    <h3>Phone:</h3>
    <p>${brewery.phone}</p>
  </section>
  <section class="link">
    <a href="${brewery.website_url}" target="_blank">Visit Website</a>
  </section>`
    const addToJsonDiv = document.createElement("div")
    const removeFromJsonButton = document.createElement("button");
    removeFromJsonButton.hidden = true;
    removeFromJsonButton.innerText = 'Remove from visit list'
    let jsonID = ''
    removeFromJsonButton.addEventListener("click", function() {
      removeFromJsonButton.hidden = true;
      const options = {
        method: 'DELETE', 

      }
      fetch(`http://localhost:3000/breweries/${jsonID}`, options)
      .then(function(response) {
        return response.json()
      }).then(function(json) {
      })
    })
    const addToJsonButton = document.createElement("button");
    addToJsonButton.innerText = 'Add to visit list'
    addToJsonButton.addEventListener("click", function() {
      removeFromJsonButton.hidden = false;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: brewery.name,
          type: brewery.type,
          street: brewery.street,
          postal_code: brewery.postal_code,
          phone: brewery.phone,
          city: brewery.city,
          website_url: brewery.website_url
        })
      }
    fetch("http://localhost:3000/breweries", options)
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      jsonID = json.id
    })
    })
    addToJsonDiv.append(addToJsonButton, removeFromJsonButton)
    li.append(addToJsonDiv)
    breweryLiEl.append(li);
  }
}
function fetchVisitList() {
  fetch("http://localhost:3000/breweries")
  .then(function(response) {
    return response.json()
  }).then(function(breweries) {
    state.visitList = breweries
  })
}
function renderVisitList() {
  for (const brewery of state.visitList) {
    checkTypeAndRender(brewery);
  }
}
function renderFilteredBreweries() {
  for (const brewery of state.filteredBreweries) {
    checkTypeAndRender(brewery);
  }
}

function clear() {
  breweryLiEl.innerHTML = "";
  asideDiv.innerHTML = "";
}

function show() {
  aside.hidden = false;
  h1.hidden = false;
  article.hidden = false;
}

function render() {
  clear();
  show();
  if (!searchInputEl.value) {
    renderBreweries()
  }
  else {
    renderFilteredBreweries();
  }
}

function listenToVisitList() {
  const visitListButton = document.querySelector("#visit-list")
  visitListButton.addEventListener("click", function(){
    clear()
    fetchVisitList()
    renderVisitList()
    console.log(state.visitList)
    
  })
}

fetchBreweries();
listenToVisitList()
