import './css/styles.css';
import {fetchImg} from './js/fetchImg';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const endOfSearchText = document.querySelector('.gallery__text');

let query = '';
let page = 1;
let loadedHits = 0;
const perPage = 40;


searchForm.addEventListener('submit', onSearchForm);

async function onSearchForm(e) {
    e.preventDefault();

    page = 1;
    loadedHits = 0;
    query = e.currentTarget.searchQuery.value.trim();
    gallery.innerHTML = '';

    endOfSearchText.classList.add('is-hidden');
    
    if (query === '') {
        alertEmptySearch();
        return;
    }
    try {
        createCollection();
    } catch (error) {
        Notiflix.Notify.failure("Ooops...Something goes wrong");
    }
}

async function createCollection() {
    const object = await fetchImg(query, page, perPage);
    const objData = object.data;
    const totalHits = objData.totalHits;
    loadedHits += objData.hits.length;

    if (objData.totalHits === 0) {
        alertNoImagesFound();
        return;
    } else if (page === 1) {
        alertImagesToFound(objData);
    } 
    
    renderGallery(objData.hits);
    const simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    
    page += 1;
    io.observe(getLastImgEl());
    
    if (loadedHits === totalHits) {
        endOfSearchText.classList.remove('is-hidden');
    }
}

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
        return;
    }
    getLastImgEl();
      createCollection();
  });
});

function getLastImgEl() {
    return document.querySelector('.gallery__link:last-child');
}


function renderGallery(images) {
    const galleryMarkup = images
        .map(({ id, largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
            return `
                <a class="gallery__link" href="${largeImageURL}">
                    <div class="photo-card" id="${id}">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
                </div>
                </a>
    `
        })
        .join('');

gallery.insertAdjacentHTML('beforeend', galleryMarkup);
}



function alertImagesToFound(objData) {
    Notiflix.Notify.success(`Hooray! We found ${objData.totalHits} images.`);
}

function alertEmptySearch() {
    Notiflix.Notify.failure('This field cannot be empty!');
}

function alertNoImagesFound() {
    Notiflix.Notify.failure('No images were found for this request, try something else.');
}
