import API from "./fetchPixa.js";
import Notiflix from "notiflix";
import LoadButton from "./components/LoadButton.js";
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const submitBtn = document.querySelector('.submit-btn');
const searchBtn = document.querySelector('.search-form button');

let currentPage = 1;
let searchValue = '';
let totalHits = 1;


const loadingButton = new LoadButton({
    selector: ".submit-btn",
    isHidden: true,
});

//submitting search for a first page
async function onSubmitForm(e) {
    e.preventDefault();    
    const eForm = e.currentTarget;
    const inputValue = eForm.elements.searchQuery.value.trim();
    searchValue = inputValue;
    currentPage = 1;

    loadingButton.hideButton();
    clearGallery();
    
    if(inputValue === '') {
        Notiflix.Notify.info("Please write your request");
        return;
    }

    try {
        const data = await API.fetchPixabay(inputValue);

        if(data.totalHits > 0) {
            Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
        }
        
        if(data.hits.length === 0) {
            Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
        } else {
            const markup = data.hits.reduce((markup, hit) => markup + addMarkUp(hit), " ");
            updateSearch(markup);
            loadingButton.showButton();
            loadingButton.enableButton();

            const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

            window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
            });
        }
        
        } catch(error) {
            onError(error);
        } finally {
           searchForm.reset();
        }
    }


//creating uploading func
async function onUploadingMore() {
    currentPage += 1;

  
    try {
      const data = await API.fetchPixabay(searchValue, currentPage);
      totalHits = data.hits.length;
      console.log(data);

      if(totalHits >= data.totalHits) {
        loadingButton.hideButton();
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    }

      if (data.hits.length === 0) {
        throw new Error("Sorry, there are no images matching your search query. Please try again.");
      } else {
        const markup = data.hits.reduce((markup, hit) => markup + addMarkUp(hit), " ");
        updateSearch(markup);
        loadingButton.enableButton();

        
      }
    } catch (error) {
      onError(error);
    }
  }

//creating markUp for the given search
function updateSearch(markup) {
    gallery.insertAdjacentHTML("beforeend", markup);
}

//removing all gallery's content
function clearGallery() {
    gallery.innerHTML = "";
}


//creating html markup for every picture
function addMarkUp(hits) {
    const {webformatURL, largeImageURL, tags, likes, views, comments, downloads} = hits;
    return `
    <div class="photo-card">
        <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        
        <div class="info">
            <p class="info-item">
                <b>Likes: ${likes}</b>
            </p>
            <p class="info-item">
                <b>Views: ${views}</b>
            </p>
            <p class="info-item">
                <b>Comments: ${comments}</b>
            </p>
            <p class="info-item">
                <b>Downloads: ${downloads}</b>
            </p>
        </div>
    </div>
    `
}


//throwing an error func
function onError(error) {
    Notiflix.Notify.info(error);
}

//lightbox
gallery.addEventListener('click', (e) => {
    e.preventDefault();
    const lightBox = new SimpleLightbox('.photo-card a',
    {captionDelay: 250, 
     enableKeyboard: true, 
     captionsData: 'alt', 
     captions: true})
});

searchForm.addEventListener('submit', onSubmitForm);
loadingButton.button.addEventListener('click', onUploadingMore);

