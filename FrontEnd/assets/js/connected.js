// Fonction pour afficher la barre noire et effectuer des ajustements visuels
function blackHeadband() {
    // Sélectionne l'élément avec la classe "black-headband" dans le DOM
    const blackHeadband = document.querySelector(".black-headband");
    // Affiche la barre noire en utilisant le style flex
    blackHeadband.style.display = "flex";

    // Ajuste la marge inférieure de l'élément avec la classe "editionGallery"
    const editionGallery = document.querySelector(".editionGallery");
    editionGallery.style.marginBottom = "80px";

    // Affiche le bouton de modification en utilisant le style block
    const modifyBtn = document.querySelector(".modifyBtn");
    modifyBtn.style.display = "block";

    // Cache l'élément avec la classe "filters"
    const filters = document.querySelector(".filters");
    filters.style.display = "none";

    // Modifie le texte du bouton de connexion pour afficher "logout"
    const btnLog = document.querySelector(".btnLog");
    btnLog.innerHTML = "logout";

    // Ajoute un écouteur d'événements au bouton de connexion pour déconnecter l'utilisateur
    btnLog.addEventListener("click", function () {
        // Supprime le jeton d'authentification du stockage local
        localStorage.removeItem("token");
    });
}

// Fonction pour vérifier si un utilisateur est connecté
function connected() {
    // Récupère le jeton d'authentification du stockage local
    const userConnected = localStorage.getItem("token");

    // Vérifie si un utilisateur est connecté
    if (userConnected) {
        // Si connecté, appelle la fonction blackHeadband pour afficher la barre noire
        // et effectue d'autres ajustements visuels, puis appelle mainGallery
        blackHeadband();
        mainGallery();
    } else {
        // Si non connecté, appelle la fonction filters pour afficher les filtres,
        // puis appelle mainGallery
        filters();
        mainGallery();
    }
}

// Appelle la fonction connected pour déterminer l'état de connexion lors du chargement de la page
connected();
