import API from "./fetchPixa.js";
import Notiflix from "notiflix";
import LoadButton from "./components/LoadButton.js";

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const submitBtn = document.querySelector('.submit-btn');
const searchBtn = document.querySelector('.search-form button');

let page = 1;
let searchValue = '';

const loadingButton = new LoadButton({
    selector: ".submit-btn",
    isHidden: true,
});

//submitting search for a first page
function onSubmitForm(e) {
    e.preventDefault();    
    const eForm = e.currentTarget;
    const inputValue = eForm.elements.searchQuery.value.trim();
    searchValue = inputValue;
    page = 1;

    loadingButton.hideButton();
    clearGallery();
    loadingButton.disableButton();

    if(inputValue === 0) {
        searchBtn.disabled = true;
        Notiflix.Notify.warning('Add a search parameter');
    }

    API.fetchPixabay(inputValue)
    .then(data => {
        if(data.hits.length === 0) {
            Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
        }
        return data.hits.reduce((markup, hit) => markup + addMarkUp(hit), 
        " "
        );
    })
    .then(updateSearch)
    .then(loadingButton.showButton())
    .catch(onError)
    .finally(() => searchForm.reset());
}


//creating uploading func
function onUploadingMore() {
    page += 1;

    API.fetchPixabay(searchValue, page) 
    .then(data => {
        if(data.hits.length === 0) {
            throw new Error("Sorry, there are no images matching your search query. Please try again.");
        }
        return data.hits.reduce((markup, hit) => markup + addMarkUp(hit), 
        " "
        );
    })
    .then(updateSearch)
    .catch(onError);
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
function addMarkUp(hit) {
    const {webformatURL, largeImaheURL, tags, likes, views, comments, downloads} = hit;
    return `
    <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
    alert(error);
}

searchForm.addEventListener('submit', onSubmitForm);
submitBtn.addEventListener('click', onUploadingMore);

