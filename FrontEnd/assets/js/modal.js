
// Déclaration de variables
let modal = null;

// Fonction pour ouvrir la modal
const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = null;
    target.setAttribute("aria-modal", "true");
    target.removeAttribute("aria-hidden");
    modal = target;
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
};

// Fonction pour fermer la modal
const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal = null;
};

// Fonction pour arrêter la propagation des événements
const stopPropagation = function (e) {
    e.stopPropagation();
};

// Écouteur d'événement pour ouvrir la première modal
let clickModal = document.querySelector(".js-modal");
clickModal.addEventListener("click", openModal);

// Écouteur d'événement pour fermer la modal en appuyant sur la touche "Escape"
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
});

// Déclaration de variables pour la deuxième modal
let modal2 = null;

// Fonction pour ouvrir la deuxième modal
const openModal2 = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = null;
    target.setAttribute("aria-modal", "true");
    target.removeAttribute("aria-hidden");
    modal2 = target;
    modal2.querySelector(".js-modal-close").addEventListener("click", closeModal2);
};

// Fonction pour fermer la deuxième modal
const closeModal2 = function (e) {
    if (modal2 === null) return;
    e.preventDefault();
    modal2.style.display = "none";
    modal2.setAttribute("aria-hidden", "true");
    modal2.removeAttribute("aria-modal");
    modal2.querySelector(".js-modal-close").removeEventListener("click", closeModal2);
    modal2 = null;
};

// Écouteur d'événement pour ouvrir la deuxième modal
let clickModal2 = document.getElementById("open-modal2");
clickModal2.addEventListener("click", openModal2);

// Écouteur d'événement pour fermer la deuxième modal en appuyant sur la touche "Escape"
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal2(e);
    }
});

// Écouteur d'événement pour afficher les catégories en cliquant sur une flèche
chevronCategories = document.querySelector(".fa-chevron-down");
chevronCategories.addEventListener("click", function () {
    // Effectue une requête HTTP pour récupérer les catégories depuis une API locale
    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(data => {
            // Parcourt les catégories et les ajoute à un élément de formulaire
            for (let id in data) {
                let category = data[id];
                let options = document.createElement("option");
                options.textContent = category.name;
                options.innerHTML = category.name;
                inputCategorie = document.getElementById("categorie");
                inputCategorie.appendChild(options);
            }
        });
});
