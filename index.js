const state = {
    breweries: []
}

const breweryLiEl = document.querySelector('#breweries-list')

function fetchBreweries() { 
const formEl = document.querySelector('#select-state-form')
const searchEl = document.querySelector('#select-state')
formEl.addEventListener('submit', function(e) {
    e.preventDefault()
    fetch(`https://api.openbrewerydb.org/breweries?by_state=${searchEl.value}&per_page=50`)
      .then(res => res.json())
      .then(function(breweries) {
        //update state
        state.breweries = breweries
        //render page
        renderBreweries();
      })
    // formEl.reset()
})
const filterForm = document.querySelector('#filter-by-type-form')
const filterChoice = document.querySelector('#filter-by-type')
filterForm.addEventListener('change', function() {
if (searchEl.value === '') {
    alert('Please provide a state')
}
else {
fetch(`https://api.openbrewerydb.org/breweries?by_state=${searchEl.value}&per_page=50&by_type=${filterChoice.value}`)
 .then(res => res.json())
 .then(function(breweries) {
  //update state
  state.breweries = breweries
  //render page
  renderBreweries();
})
}
})


}

function renderBreweries() {
    clear()
    for (const brewery of state.breweries) {
    if (brewery.brewery_type == 'micro' || brewery.brewery_type == 'regional' || brewery.brewery_type == 'brewpub') {
    const li = document.createElement('li')
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

    breweryLiEl.append(li)
    }
}
}

function clear() {
    breweryLiEl.innerHTML = ''
}

fetchBreweries()