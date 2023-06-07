let serarchResult = document.getElementById('searchresult')
let allCards = document.querySelector('.allcards')
let cardContainer = document.querySelector('.card_container')
const body = document.body
let serarchbtn = document.getElementById('searchbtn')

const url = 'https://moviesdatabase.p.rapidapi.com/titles/x/upcoming';

const urlHome ='https://moviesdatabase.p.rapidapi.com/titles?startYear=2013&titleType=movie&list=top_rated_250';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '84e6135305mshf6dba2310292fb6p1b9b3ajsn3aa29744acc4',
		'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
	}
};
asyncCall()
async function asyncCall() {
  try {
    const response = await fetch(urlHome, options);
    const allresult = await response.json();
    console.log(allresult.results);
    allresult.results.forEach(value=>{
       console.log(value.id)
        fetch(`https://moviesdatabase.p.rapidapi.com/titles/${value.id}/ratings`,options)
        .then((ratingresponse)=>ratingresponse.json())
        .then((ratingdata)=>{
          console.log(ratingdata.results.averageRating)
          creatCarde(value.primaryImage.url,value.originalTitleText.text,value.releaseYear.year,ratingdata.results.averageRating)
        }) 
  })
  } catch (error) {
    console.error(error);
  }}

serarchbtn.addEventListener('click', () => {
  clearAllcards()
  let searchtxt = serarchResult.value.trim()
  let url = `http://www.omdbapi.com/?apikey=caf49d7e&s=${searchtxt}&plot=Short`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data.Search.forEach(value => {
        let url2 = `http://www.omdbapi.com/?apikey=caf49d7e&i=${value.imdbID}`
        fetch(url2)
          .then((result) => result.json())
          .then((thedata) => {
            creatCarde(value.Poster,value.Title,value.Year,thedata.Ratings[0].Value)
            console.log(thedata)
          })
          .catch(error=>console.console.log(error))
      });
    })
    .catch((error) => console.log("error", error))
})

const creatCarde = (img,title,year,rate)=>{
  let theCard = document.createElement('div')
  theCard.setAttribute('class','deletable')
  theCard.innerHTML = ` <div class="col h-100">
        <div class="card border-dark bg-transparent h-100">
          <img class="card-img-top" src="${img}" onerror="this.onerror=null;this.src='images/imageError.jpg';" alt="${title} img">
          <div class="card-body bg-dark text-light m-0 h-100">
            <h5 class="card-title">${title}</h5>
            <p class="card-text m-1"></p>
            <p class="badge bg-primary m-1 text-wrap">${rate}</p>
            <p class="card-text m-1">year: ${year}</p>
          </div>
        </div>
      </div>`
      cardContainer.append(theCard)
}

const clearAllcards = ()=>{
  const deletableCard= document.querySelectorAll('.deletable')
  deletableCard.forEach(value=>{
    value.remove();
  })
}
