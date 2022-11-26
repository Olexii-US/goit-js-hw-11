import PixabayImg from "./fetchPixabay";
import { Notify } from 'notiflix/build/notiflix-notify-aio'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from "lodash.throttle";
import debounce from "lodash.debounce";
import axios from 'axios';


const refs = {
    form: document.querySelector('#search-form'),
    galleryBox: document.querySelector(".gallery"),
    loadMoreBtn: document.querySelector(".load-more")
}

refs.form.addEventListener('submit', onFormSubmit)

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


function markupImgSearch(data) {
    searchArray = data.hits
    console.log(searchArray)
    
    const markup = searchArray.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        console.log(likes)
            
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

  totalHitsCount(data)

  new SimpleLightbox('.photo-card a', { captionDelay: 250 }).refresh();

  
    /////// scroll///////
//   const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();
// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });
}

function resetMarkup() {
  refs.galleryBox.innerHTML = "";  
}

function totalHitsCount(data) {
  totalHits += data.hits.length

    if (totalHits >= data.totalHits) {
     Notify.info("We're sorry, but you've reached the end of search results.")


//////////////////////
      // window.removeEventListener("scroll", onScroll)
//////////////////////////////////////


      console.log("data.totalHits", data.totalHits)
    } 
}

 window.addEventListener("scroll", throttle(onScroll, 1000))



function onScroll() {
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement

  const scrollPosition = scrollHeight - clientHeight
  const scrollTopRound = Math.round(scrollTop)

  console.log("scrollPosition", scrollPosition)
  console.log("scrollTopRound", scrollTopRound)
    if (scrollTopRound >= scrollPosition - 1) {
      pixabayImg.getImage().then(markupImgSearch)

      console.log('aaaaaaaaaaaaaaaa')
    }
}

console.log("hi")