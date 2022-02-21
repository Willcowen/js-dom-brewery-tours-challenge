const state = {
  breweries: [],
  filter: "",
  filteredBreweries: [],
  cityBreweries: [],
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
  </section>`;

    breweryLiEl.append(li);
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
    renderBreweries();
    renderFilterCityBar();
  } else {
    renderFilteredBreweries();
  }
}

function renderFilterCityBar() {
  state.breweries.sort((a, b) => a.city.localeCompare(b.city));

  const div = document.createElement("div");
  const form = document.createElement("form");

  div.setAttribute("class", "filter-by-city-heading");

  const h3 = document.createElement("h3");
  h3.innerText = "Cities";

  const button = document.createElement("button");
  button.innerText = "clear all";
  button.setAttribute("class", "clear-all-btn");

  form.setAttribute("id", "filter-by-city-form");

  for (let i = 0; i < state.breweries.length - 1; i++) {
    const brewery = state.breweries[i];
    if (brewery.city !== state.breweries[i + 1].city) {
      const input = document.createElement("input");
      const label = document.createElement("label");
      label.innerText = brewery.city;
      input.setAttribute("type", "checkbox");
      input.setAttribute("name", brewery.city);
      input.setAttribute("value", brewery.city);
      label.setAttribute("for", brewery.city);
      input.addEventListener("change", function(){
        if(this.checked) {
          //update state
          state.cityBreweries = state.breweries.filter((brewery) =>
          brewery.city.includes(state.breweries[i].city)
    );
          console.log(state.breweries)
          //render dom
          // render()
        }
      })
      form.append(input, label);
      div.append(h3, button);
      asideDiv.append(div, form);
    }
  }
}

fetchBreweries();
