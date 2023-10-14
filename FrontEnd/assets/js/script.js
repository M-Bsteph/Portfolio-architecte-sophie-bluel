// Vérifie si un token d'identification est présent dans le stockage local
let isConnect = localStorage.getItem("tokenIdentification") !== null;

// Sélectionne des éléments du DOM
const sectFiltre = document.querySelector(".filters");
const gallery = document.querySelector(".gallery");
const modalImg = document.querySelector(".modal-img");

// Crée un bouton "Tous" et l'ajoute à la section de filtres
const btnTrierTous = createButton("Tous", "all", "active");
sectFiltre.appendChild(btnTrierTous);

// Ajoute un gestionnaire d'événements pour le clic sur le bouton "Tous"
btnTrierTous.addEventListener("click", () => {
    handleFilterClick("all");
});

// Fonction asynchrone pour charger les œuvres depuis une API
async function loadWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
}

// Fonction asynchrone pour charger les catégories depuis une API
async function loadCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
}

// Fonction pour créer un bouton avec du texte, une valeur et une classe
function createButton(text, value, className) {
    const button = document.createElement("button");
    button.innerText = text;
    button.value = value;
    button.classList = className;
    return button;
}

// Fonction appelée lors du clic sur un bouton de filtre
function handleFilterClick(filterValue) {
    const filters = document.querySelectorAll(".filters button");
    filters.forEach((filter) => filter.classList.remove("active"));
    event.target.classList.add("active");

    gallery.innerHTML = "";

    // Charge les œuvres et les filtre en fonction de la valeur de filtre
    loadWorks().then((works) => {
        for (const id in works) {
            const work = works[id];
            if (filterValue == "all" || work.category.id == filterValue) {
                const figElement = createFigure(work);
                gallery.appendChild(figElement);
            }
        }
    });
}

// Fonction pour créer un élément figure à partir d'une œuvre
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

// Fonction pour créer des boutons de catégorie et les ajouter à la section de filtres
function createCategoryButtons(categories) {
    categories.forEach((category) => {
        const button = createButton(category.name, category.id, "");
        button.addEventListener("click", () => handleFilterClick(category.id));
        sectFiltre.appendChild(button);
    });
}

// Charge les catégories et crée les boutons de catégorie
fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => createCategoryButtons(categories));

// Charge les œuvres et les affiche dans la galerie
fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => works.forEach((work) => gallery.appendChild(createFigure(work))));

// Sélectionne des éléments du DOM
const headband = document.querySelector(".black-headband");
const btnModif = document.getElementById("open-modal");
const btnOpenModal2 = document.getElementById("modal2");
const showLogout = document.getElementById("login");

// Cache initialement certains éléments
headband.style.display = "none";
btnModif.style.display = "none";
btnOpenModal2.style.display = "none";

// Vérifie si l'utilisateur est connecté
if (isConnect) {
    // Affiche le bouton de déconnexion
    showLogout.textContent = "logout";
    showLogout.id = "logout";
    const deleteTokenStorage = document.getElementById("logout");
    deleteTokenStorage.addEventListener("click", () => {
        // Supprime le token du stockage local et redirige vers la page d'accueil
        localStorage.removeItem("tokenIdentification");
        window.location.href = "http://127.0.0.1:5500/index.html";
    });

    // Affiche certains éléments liés à la connexion
    headband.style.display = "flex";
    btnModif.style.display = "inline-block";
    sectFiltre.style.display = "none";
} else {
    // Cache le bouton de modification si l'utilisateur n'est pas connecté
    btnModif.style.display = "none";
}

// Fonction pour supprimer une image
function deleteImg(event) {
    const workId = event.target.id;
    const token = localStorage.getItem("tokenIdentification");

    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token },
    })
    .then(response => {
        if (response.ok) {
            // Supprime l'œuvre supprimée de la galerie
            const deletedWorkElement = document.getElementById(`work-${workId}`);
            if (deletedWorkElement) {
                deletedWorkElement.remove();
            }

            // Supprime l'œuvre supprimée du modal
            const deletedModalElement = document.getElementById(`modal-work-${workId}`);
            if (deletedModalElement) {
                deletedModalElement.remove();
            }
        }
    })
    .catch(error => {
        console.error('Erreur lors de la suppression de l\'image :', error);
    });
}

// Fonction asynchrone pour charger les images dans le modal
async function loadImgModal() {
    const works = await loadWorks();
    const modalImg = document.querySelector(".modal-img");

    works.forEach((work) => {
        const figElement = createFigure(work);
        figElement.id = `modal-work-${work.id}`;

        // Crée une icône de poubelle pour supprimer l'image
        const poubelle = document.createElement("i");
        poubelle.className = "fa-solid fa-trash-can";
        poubelle.id = work.id;

        poubelle.addEventListener("click", (event) => deleteImg(event));
        figElement.appendChild(poubelle);
        modalImg.appendChild(figElement);
    });
}

// Charge les images dans le modal
loadImgModal();
