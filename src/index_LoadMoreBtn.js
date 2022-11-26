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
let totalHitsForPage = 0;

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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="image" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`
  })
    .join("")

  refs.galleryBox.insertAdjacentHTML("beforeend", markup)
  refs.loadMoreBtn.hidden = false

  totalHitsCount(data)

  new SimpleLightbox('.photo-card a', { captionDelay: 250 }).refresh();
}

function resetMarkup() {
  refs.galleryBox.innerHTML = "";  
}

function totalHitsCount(data) {
  totalHitsForPage += data.hits.length
    
    if (pixabayImg.page > 2) {
    smoothScroll()
  }

    if (totalHitsForPage >= data.totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.")
      refs.loadMoreBtn.hidden = true
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();
  window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}
