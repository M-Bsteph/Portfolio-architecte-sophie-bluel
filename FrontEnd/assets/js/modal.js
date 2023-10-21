document.addEventListener("DOMContentLoaded", function () {
    console.log("Le DOM est chargé");

    const boutonOuvrirModal = document.getElementById("open-modal");
    const modal1 = document.getElementById("modal1");
    const boutonsFermerModal = document.querySelectorAll(".js-modal-close");
    const overlay = document.querySelector(".overlay");
    const projetsModal = document.querySelector(".projets-modal");
    const inputPhoto = document.getElementById("photo-input");
    const modal2 = document.getElementById("js-modal-add-project");
    const imagePreview = document.getElementById("imgpreview");
    const titleInput = document.getElementById("Title-photo");
    const categoriesSelect = document.getElementById("categories");

    function ouvrirModal() {
        console.log("Ouverture du modal");
        modal1.style.display = "block";
        overlay.style.display = "block";
    }

    function fermerModal() {
        console.log("Fermeture du modal");
        modal1.style.display = "none";
        overlay.style.display = "none";
    }

    function changerImage(event) {
        console.log("Changement d'image");
        const fichierInput = event.target;

        if (imagePreview && fichierInput.files.length > 0) {
            console.log("Début du chargement de l'image");
       
             
                const lecteur = new FileReader();
                lecteur.onload = function () {
                    console.log("L'image a été chargée avec succès");
                    imagePreview.src = lecteur.result;
                    // Cache l'élément imageFormDisplay
            const imageFormDisplay = document.querySelector(".imageFormDisplay");
            if (imageFormDisplay) {
                imageFormDisplay.style.display = "none";
            }
            };

            lecteur.readAsDataURL(fichierInput.files[0]);
        }
    }

    function supprimerTravail(travailId) {
        // Supprimer l'élément du DOM
        const workContainer = document.querySelector(`.work-container[data-id="${travailId}"]`);
        if (workContainer) {
            workContainer.remove();
        }

        // Envoyer une requête au serveur pour supprimer le travail côté serveur
        fetch(`http://localhost:5678/api/works/${travailId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log("Travail supprimé avec succès :", data);
        })
        .catch(error => console.error("Erreur lors de la suppression du travail :", error));
    }

    function ouvrirModal2() {
        console.log("Ouverture du modal 2");
        modal2.style.display = "block";
        overlay.style.display = "block";
        // Appelle changerImage pour mettre à jour l'aperçu de l'image lorsque le modal est ouvert
    changerImage({ target: inputPhoto });
    }

    function retourModal1() {
        console.log("Retour à modal 1");
        modal2.style.display = "none";
        overlay.style.display = "none";
        ouvrirModal(); // Ouvrir à nouveau modal1
    }

    boutonOuvrirModal.addEventListener("click", ouvrirModal);

    boutonsFermerModal.forEach(function (bouton) {
        bouton.addEventListener("click", fermerModal);
    });

    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            fermerModal();
        }
    });

    inputPhoto.addEventListener("input", ouvrirModal2);

    const addPhotoInput = document.querySelector(".add-photo");

    addPhotoInput.addEventListener("click", ouvrirModal2);

    const boutonRetourModal2 = document.querySelector(".js-modal-return");

    boutonRetourModal2.addEventListener("click", retourModal1);

    // Récupérer les catégories depuis l'API 
    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.text = category.name;
                categoriesSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Erreur lors de la récupération des catégories :", error));

    fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(data => {
            console.log("Données récupérées avec succès :", data);

            data.forEach(item => {
                const imageUrl = item.imageUrl;
                console.log("Image URL:", imageUrl);

                const workContainer = document.createElement("div");
                workContainer.classList.add("work-container");
                workContainer.dataset.id = item.id;

                const imageElement = document.createElement("img");
                imageElement.src = imageUrl;
                console.log("Image Element SRC:", imageElement.src);
                workContainer.appendChild(imageElement);

                const deleteButton = document.createElement("i");
                deleteButton.classList.add("fas", "fa-trash-alt", "delete-button");
                deleteButton.addEventListener("click", function () {
                    supprimerTravail(item.id);
                });
                workContainer.appendChild(deleteButton);

                projetsModal.appendChild(workContainer);
            });
        })
        .catch(error => console.error("Erreur lors de la récupération des données :", error));

    inputPhoto.addEventListener("change", changerImage);
});



// Ajouter un écouteur d'événements au formulaire modal pour la soumission
const form = document.querySelector('.modal-form'); // Ajout de cette ligne pour sélectionner le formulaire

form.addEventListener('submit', function (event) {
    event.preventDefault(); // Empêcher la soumission par défaut du formulaire
    var formData = new FormData(form);

    // Effectuer une requête POST vers le serveur local
    fetch("http://localhost:5678/api/works", {
        method: "POST", // Utiliser la méthode POST pour envoyer les données
        body: formData, // Utiliser l'objet FormData comme corps de la requête
    })
    .then(response => response.json())
    .then(data => {
        // Gère la réponse du serveur ou de l'API
        console.log(data);
        // Ajouter des actions supplémentaires ici, par exemple, fermer le modal
        fermerModal();
    })
    .catch(error => {
        // Gère les erreurs d'envoi
        console.error('Erreur d\'envoi du formulaire:', error);
    });
})

// Fonction pour retirer l'image
function removeImage() {
    const imagePreview = document.getElementById("imgpreview");
    const imageFormDisplay = document.querySelector(".imageFormDisplay");
    const faimage = document.querySelector(".fa-image");
    const fileUpload = document.querySelector(".file-upload");
    const photoInput = document.querySelector("#photo-input");
    const fileFormat = document.querySelector(".fileFormat");

    imageFormDisplay.style.display = "none";
    faimage.style.display = "block";
    fileUpload.style.display = "block";
    photoInput.style.display = "none";
    fileFormat.style.display = "block";
    imagePreview.src = "";
}
inputPhoto.addEventListener("change", changerImage);

// Appelle la fonction removeImage au moment approprié, par exemple, lorsqu'un bouton "Supprimer" est cliqué.
const boutonSupprimerImage = document.getElementById("boutonSupprimerImage");

boutonSupprimerImage.addEventListener("click", removeImage);
