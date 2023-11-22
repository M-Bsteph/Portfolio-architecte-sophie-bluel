// Attend que le DOM soit entièrement chargé avant d'exécuter le code
document.addEventListener("DOMContentLoaded", function() {
  // Appelle la fonction principale pour initialiser la galerie
  mainGallery();
});

// Fonction pour récupérer et afficher les filtres
function filters() {
  // Effectue une requête pour obtenir la liste des catégories depuis l'API
  fetch("http://localhost:5678/api/categories")
      .then(data => data.json())
      .then(categories => {
          // Sélectionne l'élément HTML avec la classe "filters"
          const filters = document.querySelector(".filters");

          // Crée un bouton "Tous" sélectionné par défaut
          const btnAll = document.createElement("button");
          btnAll.classList.add("filtersBtn", "filtersBtnSelected");
          btnAll.innerText = "Tous";
          btnAll.setAttribute("data-id", "0");
          filters.appendChild(btnAll);

          // Crée des boutons pour chaque catégorie
          categories.forEach((category) => {
              const btnCategory = document.createElement("button");
              btnCategory.classList.add("filtersBtn");
              btnCategory.setAttribute("data-id", category.id);
              btnCategory.innerText = category.name;
              filters.appendChild(btnCategory);
          })

          // Initialise les événements de sélection des boutons
          buttonSelected();
      })
      .catch(error => {
          console.error("Un problème est survenu lors de la récupération des données:", error);
      });
}

// Fonction principale pour afficher la galerie d'images
function mainGallery() {
  // Effectue une requête pour obtenir la liste des œuvres depuis l'API
  fetch("http://localhost:5678/api/works")
      .then(data => data.json())
      .then(works => {
          // Sélectionne l'élément HTML avec la classe "gallery"
          const gallery = document.querySelector(".gallery");
          gallery.innerHTML = ""; // Réinitialise le contenu de la galerie

          // Crée une figure pour chaque œuvre et l'ajoute à la galerie
          for (let i = 0; i < works.length; i++) {
              const figure = document.createElement("figure");
              figure.setAttribute("data-id", works[i].categoryId);

              const image = document.createElement("img");
              image.src = works[i].imageUrl;
              image.alt = works[i].title;

              const figCaption = document.createElement("figcaption");
              figCaption.innerText = works[i].title;

              figure.appendChild(image);
              figure.appendChild(figCaption);
              gallery.appendChild(figure);
          }
      })
      .catch(error => {
          console.error("Un problème est survenu lors de la récupération des données:", error);
      });
}

// Fonction pour gérer la sélection des boutons de filtre
function buttonSelected() {
  // Sélectionne tous les boutons
  const allBtn = document.querySelectorAll("button");

  // Ajoute un écouteur d'événement à chaque bouton
  allBtn.forEach((buttons) => {
      buttons.addEventListener("click", function () {
          // Désélectionne le bouton précédemment sélectionné
          const btnDisabled = document.querySelector(".filtersBtnSelected");
          btnDisabled.classList.remove("filtersBtnSelected");

          // Sélectionne le bouton cliqué
          buttons.classList.add("filtersBtnSelected");

          // Sélectionne toutes les figures
          const allFigures = document.querySelectorAll("figure");

          // Affiche ou masque les figures en fonction du filtre sélectionné
          allFigures.forEach((figure) => {
              if (figure.dataset.id === buttons.dataset.id || buttons.dataset.id === "0" || figure.dataset.id === "0") {
                  figure.style.display = "block";
              } else {
                  figure.style.display = "none";
              }
          });
      });
  });
}
