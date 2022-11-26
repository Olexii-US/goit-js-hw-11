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
let totalHitsForPage = 0;

function onFormSubmit(event) {
    event.preventDefault()
  const form = event.currentTarget
  pixabayImg.query = form.elements.searchQuery.value
  pixabayImg.resetPage();
  pixabayImg.getImage().then(markupImgSearch);
  resetMarkup()
}


function markupImgSearch(data) {
    // searchArray = data.hits
    // console.log(searchArray)
    
    const markup = data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        console.log(likes)
            
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
  totalHitsForPage += data.hits.length

    if (totalHitsForPage >= data.totalHits) {
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