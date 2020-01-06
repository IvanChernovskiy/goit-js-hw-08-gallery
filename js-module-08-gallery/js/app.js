"use strict";

import gallery from "./default-js.js";
import refs from "./reference.js";

function createMarkup({ preview, original, description }) {
  const createImages = `
  <li class="gallery__item">
  <a class="gallery__link" href="${original}">
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
  </li>`;

  return createImages;
}

function addImgToHTML(parent, galleryItem) {
  parent.insertAdjacentHTML(
    "afterbegin",
    galleryItem.map(elem => createMarkup(elem)).join(" ")
  );
}

addImgToHTML(refs.gallery, gallery);

function openModal(e) {
  e.preventDefault();
  const { target } = e;
  if (e.target === e.currentTarget) {
    return;
  }
  refs.imageLightbox.setAttribute("src", target.dataset.source);
  refs.imageLightbox.setAttribute("alt", target.alt);
  refs.lightbox.classList.add("is-open");
}

function closeModal() {
  refs.lightbox.classList.remove("is-open");
  refs.imageLightbox.removeAttribute("src");
  refs.imageLightbox.removeAttribute("alt");
}

function closeModalByClick({ target }) {
  if (target.className !== "lightbox__content") {
    return;
  }
  closeModal();
}

function closeModalByEsc(e) {
  if (e.code !== "Escape") {
    return;
  }
  closeModal();
}

function nextAndPrevImg(e) {
  if (e.keyCode === 37 || e.keyCode === 39) {
    const currentValues = refs.imageLightbox;
    if (!currentValues.hasAttribute("src")) {
      return;
    }

    const { src } = currentValues;
    const arr = Array.from(gallery);
    let arrIndex = arr.findIndex(elem => elem.original === src);
    if (arrIndex !== -1) {
      if (e.keyCode === 39) arrIndex += 1;
      if (e.keyCode === 37) arrIndex -= 1;
      if (arrIndex <= 0) arrIndex = 0;
      if (arrIndex >= arr.length - 1) arrIndex = arr.length - 1;

      refs.imageLightbox.removeAttribute("src");
      refs.imageLightbox.removeAttribute("alt");

      const { original, description } = arr[arrIndex];

      refs.imageLightbox.setAttribute("src", original);
      refs.imageLightbox.setAttribute("alt", description);
    }
  }
}

refs.gallery.addEventListener("click", openModal);
refs.button.addEventListener("click", closeModal);
refs.lightbox.addEventListener("click", closeModalByClick);
window.document.addEventListener("keydown", closeModalByEsc);
window.document.addEventListener("keydown", nextAndPrevImg);
