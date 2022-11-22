import PixabayImg from "./fetchPixabay";
import { Notify } from 'notiflix/build/notiflix-notify-aio'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';


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

//////On load more Btn//////////////
function onloadMore() {
  pixabayImg.getImage().then(markupImgSearch)
}

function markupImgSearch(data) {
    searchArray = data.hits
    
  const markup = searchArray.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `<div class="photo-card"><a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
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

  new SimpleLightbox('.photo-card a', { captionDelay: 250 }).refresh();

    ///// scroll///////
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();
  window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}

function resetMarkup() {
  refs.galleryBox.innerHTML = "";  
}

function totalHitsCount(data) {
  totalHits += data.hits.length

    if (totalHits >= data.totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.")
      refs.loadMoreBtn.hidden = true
    }
}
