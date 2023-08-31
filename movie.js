let serarchResult = document.getElementById('searchresult')
let allCards = document.querySelector('.allcards')
let mainContainer = document.querySelector('.main_wrapper')
let cardContainer = document.querySelector('.card_container')
let cardContainerTwo = document.querySelector('.card_container_two')
let cardContainerSearch = document.querySelector('.card_container_search')
let topRated = document.querySelector('.top_rated')
let homeUpcomming = document.querySelector('.home_upcomming')
let searchContainer = document.querySelector('.search_container')
let moreInfoContainer = document.querySelector('.more_info_container')
let searchText = document.querySelector('.search_text')

const body = document.body
let serarchbtn = document.getElementById('searchbtn')
let selectables = document.querySelector('.selectables')
const upcomingUrlHome = 'https://moviesdatabase.p.rapidapi.com/titles/x/upcoming?genre=Action';
const topUrlHome = 'https://moviesdatabase.p.rapidapi.com/titles/random?startYear=2013&endYear=2023&list=top_rated_english_250'
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '84e6135305mshf6dba2310292fb6p1b9b3ajsn3aa29744acc4',
    'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
  }
};

const clearAllcards = () => {
  const deletableCard = document.querySelectorAll('.deletable')
  deletableCard.forEach(value => {
    value.remove();
  })
}

let isLoaded = true;
homeLoad();
function homeLoad() {
  clearAllcards()
  if (isLoaded) {
    isLoaded = false
    homePageCards(topUrlHome)
    setTimeout(() => {
      homePageCards(upcomingUrlHome)
    }, 1000)
  }
  setTimeout(() => {
    isLoaded = true;
  }, 3000)
}

async function homePageCards(url) {
  moreInfoContainer.style.display = "none"
  topRated.style.display = "block"
  homeUpcomming.style.display = "block"
  try {
    const response = await fetch(url, options);
    const allresult = await response.json();
    // For debuging console.log(allresult.results);
    allresult.results.forEach(value => {
      try{
        if(value.primaryImage==null)  throw new Error("Null Image")
        let cardImg = value.primaryImage.url
        let cardTitle = value.originalTitleText.text
        let cardYear = value.releaseYear.year
        if (url == topUrlHome) {
          fetch(`https://moviesdatabase.p.rapidapi.com/titles/${value.id}/ratings`, options)
            .then((ratingresponse) => ratingresponse.json())
            .then((ratingdata) => {
              let cardRating = ratingdata.results.averageRating
              creatCard(cardImg, cardTitle, cardYear, cardRating, cardContainer, value.id)
            })
        } else {
          creatCard(cardImg, cardTitle, cardYear, "not rated", cardContainerTwo, value.id)
        }
      }
      catch(img_error){
        console.log(img_error)
      }
    })
  } catch (error) {
    console.error(error);
  }
}
serarchbtn.addEventListener('click', () => {
  let searchtxt = serarchResult.value.trim()
  if (searchtxt != "") {
    clearAllcards()
    topRated.style.display = "none"
    homeUpcomming.style.display = "none"
    moreInfoContainer.style.display = "none"
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
              let cardRating = thedata.Ratings[0].Value
              creatCard(value.Poster, value.Title, value.Year, cardRating, cardContainerSearch, value.imdbID)
              // For Debugging console.log(thedata)
            })
            .catch(error => console.console.log(error))
        });
      })
      .catch((error) => console.log("error", error))
  }
})
const creatCard = (img, title, year, rate, container, imdbID) => {
  let theCard = document.createElement('div')
  theCard.setAttribute('class', 'selectables deletable')
  theCard.innerHTML = ` <div class="col h-100">
        <div class="card card_hover border-dark bg-transparent h-100">
          <img class="card-img-top" src="${img}" onerror="this.onerror=null;this.src='images/imageError.jpg';" alt="${title} img">
          <div class="card-body bg-dark text-light m-0 h-100">
            <h5 class="card-title">${title}</h5>
            <p class="card-text m-1"></p>
            <p class="badge bg-primary text-wrap"><i class="fa-solid fa-star pe-2"></i>${rate}</p>
            <p class="card-text">year: ${year}</p>
          </div>
        </div>
      </div>`
  theCard.addEventListener('click', e => {
    movieMoreInfo(imdbID)
  }, { capture: true })
  container.append(theCard)
}
const movieMoreInfo = imdbID => {
  clearAllcards();
  topRated.style.display = "none"  
  searchContainer.style.display = "none"
  homeUpcomming.style.display = "none"
  let moreInfoUrl = `https://moviesdatabase.p.rapidapi.com/titles/episode/${imdbID}`
  fetch(moreInfoUrl, options)
    .then((response) => response.json())
    .then((data) => {
      let moreInfoPlot = `http://www.omdbapi.com/?apikey=caf49d7e&i=${imdbID}&plot=full`;
      fetch(moreInfoPlot)
        .then((res) => res.json())
        .then(thePlot => {
          console.log(data)
          console.log(thePlot)
          moreInfoContainer.style.display = "block"
          let moreInfoDiv = document.createElement('div')
          moreInfoDiv.setAttribute('class', 'deletable px-lg-40')
          moreInfoDiv.innerHTML = `<img src="${data.results.primaryImage.url}" class="more_info_img img-fluid rounded mx-auto d-block mt-3" onerror="this.onerror=null;this.src='images/imageError.jpg';" alt="${data.results.originalTitleText.text}">
        <h4 class="text-center add_font text-light mt-4"><strong>${data.results.originalTitleText.text}</strong></h4>
        <p class="add_font add_border d-flex text-light px-2 mt-3 lh-lg"><span class="badge p-2 me-2  text-bg-info">${thePlot.Type}</span>${thePlot.Runtime}</p>
        <p class="add_font add_border d-flex text-light px-2 mt-3 lh-lg"><span class="badge p-2 me-2  text-bg-info">Ratings</span> ${thePlot.imdbRating}<span class="badge p-2 ms-5 me-2  text-bg-info">Rated </span>${thePlot.Rated}</p>
        <p class="add_font add_border d-flex text-light px-2 mt-2 lh-lg"><span class="badge p-2 me-2  text-bg-info">Release date</span>${data.results.releaseDate.day}/${data.results.releaseDate.month}/${data.results.releaseDate.year}</p>
        <p class="plot add_border add_font text-light px-2 mt-2"> <span class=" p-2 me-2 badge text-bg-info">Plot</span>${thePlot.Plot}</p>
        <p class="add_font add_border d-flex text-light px-2 mt-2 lh-lg"><span class="badge p-2 me-2  text-bg-info">Genre</span>${thePlot.Genre}</p>
        <p class="add_font add_border d-flex text-light px-2 mt-2 lh-lg"><span class="badge p-2 me-2  text-bg-info">Actors</span> ${thePlot.Actors}</p>
        <p class="add_font add_border d-flex text-light px-2 mt-2 lh-lg"><span class="badge p-2 me-2  text-bg-info">Director</span> ${thePlot.Director}</p>
        <p class="add_font add_border d-flex text-light px-2 mt-2 lh-lg"><span class="badge p-2 me-2  text-bg-info">Writer</span>${thePlot.Writer}</p>
        <p class="add_font add_border d-flex text-light px-2 mt-2 lh-lg"><span class="badge p-2 me-2  text-bg-info">Awards</span>${thePlot.Awards}</p>
        <p class="add_font add_border d-flex text-light px-2 mt-2 lh-lg"><span class="badge p-2 me-2  text-bg-info">Box Office</span>${thePlot.BoxOffice}</p>`
          moreInfoContainer.append(moreInfoDiv)
        })
        .catch(e => console.log(error))
    })
    .catch((e) => console.log(e))
}


