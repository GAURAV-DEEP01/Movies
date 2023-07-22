//get element section
let serarchResult = document.getElementById('searchresult')
let allCards = document.querySelector('.allcards')
let cardContainer = document.querySelector('.card_container')
let cardContainerTwo = document.querySelector('.card_container_two')
let cardContainerSearch = document.querySelector('.card_container_search')
let topRated = document.querySelector('.top_rated')
let homeUpcomming = document.querySelector('.home_upcomming')
let searchContainer = document.querySelector('.search_container')
let searchText = document.querySelector('.search_text')
let serarchbtn = document.getElementById('searchbtn')
let selectables = document.querySelector('.selectables')
const body = document.body

const upcomingUrlHome = 'https://moviesdatabase.p.rapidapi.com/titles/x/upcoming';
const topUrlHome = 'https://moviesdatabase.p.rapidapi.com/titles?startYear=2013&titleType=movie&list=top_rated_250';
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '84e6135305mshf6dba2310292fb6p1b9b3ajsn3aa29744acc4', //The key is free!
    'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
  }
};

//immediate call onload 
homePageCards(topUrlHome)
setTimeout(() => {
  homePageCards(upcomingUrlHome)
}, 3000)

//top rated and upcomming movies 
async function homePageCards(url) {
  try {
    const response = await fetch(url, options);
    const allresult = await response.json();
    console.log(allresult.results);
    allresult.results.forEach(value => {
      if (url == topUrlHome) {
        fetch(`https://moviesdatabase.p.rapidapi.com/titles/${value.id}/ratings`, options)
          .then((ratingresponse) => ratingresponse.json())
          .then((ratingdata) => {
            creatCard(value.primaryImage.url, value.originalTitleText.text, value.releaseYear.year, ratingdata.results.averageRating, cardContainer)
          })
      } else {
        creatCard(value.primaryImage.url, value.originalTitleText.text, value.releaseYear.year, "not rated", cardContainerTwo)
      }
    })
  } catch (error) {
    console.error(error);
  }
}

// trims the search txt and fetches the result directtly from the search txt
serarchbtn.addEventListener('click', () => {
  clearAllcards()
  topRated.style.display = "none"
  homeUpcomming.style.display = "none"
  let searchtxt = serarchResult.value.trim()
  let searchUrl = `http://www.omdbapi.com/?apikey=caf49d7e&s=${searchtxt}&plot=Short`;
  fetch(searchUrl)
    .then((res) => res.json())
    .then((data) => {
      data.Search.forEach(value => {
        let url2 = `http://www.omdbapi.com/?apikey=caf49d7e&i=${value.imdbID}`
        fetch(url2)
          .then((result) => result.json())
          .then((thedata) => {
            searchContainer.style.display = "block"
            searchText.innerText = `Search results for ${searchtxt}`
            creatCard(value.Poster, value.Title, value.Year, thedata.Ratings[0].Value, cardContainerSearch)
            console.log(thedata)
          })
          .catch(error => console.console.log(error))
      });
    })
    .catch((error) => console.log("error", error))
})
//creates a card for every movie element in the json
const creatCard = (img, title, year, rate, container) => {
  let theCard = document.createElement('div')
  theCard.setAttribute('class', 'selectables deletable')
  theCard.innerHTML = ` <div class="col h-100">
        <div class="card border-dark bg-transparent h-100">
          <img class="card-img-top" src="${img}" onerror="this.onerror=null;this.src='images/imageError.jpg';" alt="${title} img">
          <div class="card-body bg-dark text-light m-0 h-100">
            <h5 class="card-title">${title}</h5>
            <p class="card-text m-1"></p>
            <p class="badge bg-primary m-1 text-wrap">${rate}</p>
            <p class="card-text mt-1">year: ${year}</p>
          </div>
        </div>
      </div>`
  theCard.addEventListener('click', () => {
    console.log(title)
  }, { capture: true })
  container.append(theCard)
}

//clears all cards when called 
const clearAllcards = () => {
  const deletableCard = document.querySelectorAll('.deletable')
  deletableCard.forEach(value => {
    value.remove();
  })
}

