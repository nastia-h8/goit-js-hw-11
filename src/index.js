import './css/styles.css';
import {fetchImg} from './js/fetchImg';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
const perPage = 40;
let simpleLightbox = null;


searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

async function onSearchForm(e) {
    e.preventDefault();

    page = 1;
    query = e.currentTarget.searchQuery.value.trim();
    gallery.innerHTML = '';

    if (query === '') {
        alertEmptySearch();
        return;
    }
    // fetchImg(query, page, perPage)
    //     .then(({data}) => {
    //         if (data.totalHits === 0) {
    //             alertNoImagesFound();
    //         } else {
    //             renderGallery(data.hits);
    //             alertImagesToFound(data);
    //             simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    //         }

    //         if (data.totalHits > perPage) {
    //             loadMoreBtn.classList.remove('is-hidden');
    //         }
    //     }
    // )
    //     .catch(error => console.log(error));


    try {
        const object = await fetchImg(query, page, perPage);
        const objData = object.data;
        if (objData.totalHits === 0) {
                alertNoImagesFound();
            } else {
                renderGallery(objData.hits);
                alertImagesToFound(objData);
                simpleLightBox = new SimpleLightbox('.gallery a').refresh();
            }

            if (objData.totalHits > perPage) {
                loadMoreBtn.classList.remove('is-hidden');
            }
        
        onScroll();
        
    } catch (error) {
        console.log(error);
    }

}


async function onLoadMoreBtn() {
    page += 1;

    // fetchImg(query, page, perPage)
    //     .then(({ data }) => {
    //         const totalPages = Math.ceil(data.totalHits / perPage);
        
    //         if (page > totalPages) {
    //             loadMoreBtn.classList.add('is-hidden');
    //             alertEndOfSearch();
    //         } else {
    //             renderGallery(data.hits);
    //             simpleLightbox = new SimpleLightbox('.gallery a').refresh();
    //         }

            
    //     })
    //     .catch(error => console.log(error));

    try {
        const object = await fetchImg(query, page, perPage);
        const objData = object.data;
        const totalPages = Math.ceil(objData.totalHits / perPage);

        if (page > totalPages) {
                loadMoreBtn.classList.add('is-hidden');
                alertEndOfSearch();
            } else {
                renderGallery(objData.hits);
                simpleLightbox = new SimpleLightbox('.gallery a').refresh();
        }
        onScrollMore();
    } catch (error) {
        console.log(error);
    }

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

function alertEndOfSearch() {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
}


function onScroll () {
      window.scrollBy({
        top: 0,
        behavior: 'smooth',
      });
}


function onScrollMore () {
     const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
}