
// Importe les fonctions depuis request.js
import { getRequest} from './request.js';

document.addEventListener('DOMContentLoaded', function () {
  // Variables
  let isConnect = localStorage.getItem("tokenIdentification") !== null;
  const filterSection = document.querySelector(".filters");
  const gallery = document.querySelector(".gallery");

  // Écouteurs d'événements
  const btnFilterAll = createButton("Tous", "all", "active");
  filterSection.appendChild(btnFilterAll);
  btnFilterAll.addEventListener("click", () => handleFilterClick("all"));

  // Fonctions

  // Fonction pour créer un bouton
  function createButton(text, value, className) {
    const button = document.createElement("button");
    button.innerText = text;
    button.value = value;
    button.classList = className;
    return button;
  }

  // Fonction pour gérer le clic sur un filtre
  function handleFilterClick(filterValue) {
    const filters = document.querySelectorAll(".filters button");
    filters.forEach((filter) => filter.classList.remove("active"));
    event.target.classList.add("active");

    gallery.innerHTML = "";

    // Utilise loadWorks ici
    getRequest("http://localhost:5678/api/works").then((works) => {
      for (const id in works) {
        const work = works[id];
        if (filterValue == "all" || work.category.id == filterValue) {
          const figElement = createFigure(work);
          gallery.appendChild(figElement);
        }
      }
    });
  }

  // Fonction pour créer un élément de figure (représentant une œuvre)
  function createFigure(work) {
    const figElement = document.createElement("figure");
    figElement.id = `work-${work.id}`;

    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;

    const figCaptionElement = document.createElement("figcaption");
    figCaptionElement.textContent = work.title;

    figElement.appendChild(imgElement);
    figElement.appendChild(figCaptionElement);

    return figElement;
  }

  // Fonction pour créer des boutons de catégorie
  function createCategoryButtons(categories) {
    categories.forEach((category) => {
      const button = createButton(category.name, category.id, "");
      button.addEventListener("click", () => handleFilterClick(category.id));
      filterSection.appendChild(button);
    });
  }

  // Initialisation

  // Charger les catégories et créer les boutons correspondants
 getRequest("http://localhost:5678/api/categories").then((categories) => createCategoryButtons(categories));

  // Charger les œuvres et créer les éléments de figure correspondants dans la galerie
  getRequest("http://localhost:5678/api/works").then((works) => works.forEach((work) => gallery.appendChild(createFigure(work))));
});
