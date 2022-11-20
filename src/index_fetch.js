// import { getImage } from "./fetchPixabay";
import PixabayImg from "./fetchPixabay";
import { Notify } from 'notiflix/build/notiflix-notify-aio'


const refs = {
    form: document.querySelector('#search-form'),
    galleryBox: document.querySelector(".gallery"),
    loadMoreBtn: document.querySelector(".load-more")
}

refs.form.addEventListener('submit', onFormSubmit)
refs.loadMoreBtn.addEventListener("click", onloadMore)


const pixabayImg = new PixabayImg()
refs.loadMoreBtn.hidden = true
let totalHits = 0;


function onFormSubmit(event) {
    event.preventDefault()
  const form = event.currentTarget
  pixabayImg.query = form.elements.searchQuery.value
  pixabayImg.resetPage();
  pixabayImg.getImage().then(markupImgSearch);
  resetMarkup()
}

function onloadMore() {
  pixabayImg.getImage().then(markupImgSearch)
}

function markupImgSearch(data) {
    searchArray = data.hits
    console.log(searchArray)
    
    const markup = searchArray.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        console.log(likes)
            
            return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`        
    })
        .join("")
   
  refs.galleryBox.insertAdjacentHTML("beforeend", markup)
 refs.loadMoreBtn.hidden = false


  totalHitsCount(data)

}

function resetMarkup() {
  refs.galleryBox.innerHTML = "";  
}

function totalHitsCount(data) {
    totalHits += data.hits.length


    if (totalHits >= data.totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.")
      refs.loadMoreBtn.hidden = true
      console.log("data.totalHits", data.totalHits)
    }


    console.log("totalHits", totalHits)
  
}



