// Importe les fonctions getRequest, postRequest et deleteRequest depuis le fichier request.js
import { getRequest, postRequest, deleteRequest } from './request.js';

function showPreview(event) {
    console.log('Files:', this.files);

    const blocToAddPicture = document.querySelector(".blocToAddPicture");
    blocToAddPicture.innerHTML = "";

    if (this.files.length > 0) {
        const image = this.files[0];

        blocToAddPicture.innerHTML = /* html */
            `<label for="addPictureFile" class="labelPicturePreview">
                <img class="formPicturePreview">
            </label>
            <input id="addPictureFile" type="file" name="addPictureFile" class="pictureBtnHidden addFile" accept=".jpg, .png">
        `;

        const formPicturePreview = /** @type {HTMLImageElement} */ (document.querySelector(".formPicturePreview"));
        formPicturePreview.src = URL.createObjectURL(image);

        const pictureTitle = /** @type {HTMLInputElement} */ (document.querySelector(".pictureTitle"));
        formPicturePreview.alt = pictureTitle.value;

        const addFile = document.querySelector(".addFile");
        addFile.addEventListener("change", showPreview);

        // Ajoute un console.log pour afficher des informations dans la console
        console.log('Fichier sélectionné :', image);
    } else {
        console.log('Aucun fichier sélectionné.');
    }
}


// Récupère le bouton "Modifier" et la première modal
const openModalButton = document.getElementById('open-modal');
const modal = document.createElement('div');
const secondModal = document.createElement('div'); // Déclarez secondModal ici

// Ajoute les classes et le contenu à la première modal
modal.classList.add('modal');
modal.innerHTML = `
    <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Galerie photo</h2>
        <div id="image-container"></div>
        <button id="add-photo-button">Ajouter une photo</button>
    </div>
`;

// Récupère le bouton pour fermer la première modal
const closeModalButton = modal.querySelector('.close-modal');

// Ajoute la première modal au body
document.body.appendChild(modal);

// Fonction pour ouvrir la première modal
function openFirstModal() {
    modal.style.display = 'block';
}

// Fonction pour fermer la première modal
function closeModal() {
    modal.style.display = 'none';
}

// Événement au clic sur le bouton "Modifier"
openModalButton.addEventListener('click', () => {
    openFirstModal();
    loadImages();
});

// Événement au clic sur la croix pour fermer la première modal
closeModalButton.addEventListener('click', closeModal);

// Événement pour fermer la première modal en dehors de celle-ci
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Empêche l'ouverture automatique de la première modal lors de l'actualisation de la page
document.addEventListener('DOMContentLoaded', () => {
    closeModal();
});

// Fonction pour charger les images dans la première modal
function loadImages() {
    getRequest("http://localhost:5678/api/works")
        .then(images => {
            // Sélectionne l'élément où tu veux ajouter les images (par exemple, un div avec l'id 'image-container')
            const imageContainer = modal.querySelector('#image-container');

            // Vide le contenu actuel de l'élément
            imageContainer.innerHTML = '';

            // Ajoute chaque image à l'élément
            images.forEach(image => {
                const imgElement = document.createElement('div');
                imgElement.id = "modal-work-" + image.id;
                imgElement.innerHTML = `
                    <img src="${image.imageUrl}" alt="${image.title}">
                    <i class="fa fa-trash-can trash-btn" data-id=${image.id}></i>
                `;
                imageContainer.appendChild(imgElement);
            });
        })
        .then(() => {
            const trashButtons = document.querySelectorAll(".trash-btn");
            console.log(trashButtons);
            trashButtons.forEach((btn) => {
                btn.addEventListener("click", function () {
                    deleteImage(btn.dataset.id)
                });
            });
        })
        .catch(error => console.error('Erreur lors du chargement des images:', error));
}

// Récupère le bouton "Ajouter une photo" à l'intérieur de la première modal
const addPhotoButton = modal.querySelector('#add-photo-button');

// Événement au clic sur le bouton "Ajouter une photo" à l'intérieur de la première modal
addPhotoButton.addEventListener('click', () => {
    // Ajoute ici le code pour ouvrir la deuxième modal d'ajout de photo
    openSecondModal();
});

//<!-- Fonction pour ouvrir la deuxième modal -->
function openSecondModal() {

    secondModal.classList.add('modal');
    secondModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <button class="js-modal2-back"><i class="fa-solid fa-arrow-left"></i></button>
            <h2>Ajouter une photo</h2>

            <form class="formModal" enctype="multipart/form-data" method="post" >
                <div class="blocToAddPicture">
                    <i class="fa-regular fa-image iconeFormPicture"></i>
                    <label for="addPictureFile" class="addPictureBtn">+ Ajouter une photo</label>
                    <input id="addPictureFile" type="file" name="addPictureFile" class="pictureBtnHidden addFile" accept=".jpg, .png" required>
                    <p class="formatIndication">jpg, png : 4mo max</p>
                </div>
                <label for="pictureTitle" class="titleFormLabel">Titre</label>
                <input type="text" id="pictureTitle" name="pictureTitle" class="pictureTitle" required>

                <label for="categoryName" class="titleFormLabel">Catégorie</label>
                <select id="categoryName" name="categoryName" class="categoryName" required>
                    <option class="blankChoiceCategory"></option>
                </select>
                <hr class="formLine">
                <button type="submit" class="submitBtn">Valider</button>
            </form>
        </div>
    `;

    // Appelle la fonction pour ajouter les options de catégories
    categoriesOptions(secondModal.querySelector('.formModal'));

    // Récupère le bouton pour fermer la deuxième modal
    const closeSecondModalButton = secondModal.querySelector('.close-modal');

    // Récupère le bouton de retour vers la première modal
    const modal2BackButton = secondModal.querySelector('.js-modal2-back');

    // Récupère le champ de sélection de l'image
    const fileInput = secondModal.querySelector('#addPictureFile');
     // Ajoute un événement au changement de la sélection de fichier
     fileInput.addEventListener('change', showPreview);

    // Ajoute un événement au changement de la sélection de fichier
    fileInput.addEventListener('change', showPreview);

  
    // Événement au clic sur la croix pour fermer la deuxième modal
    closeSecondModalButton.addEventListener('click', () => {
        document.body.removeChild(secondModal);
    });

    // Événement au clic sur le bouton de retour vers la première modal
    modal2BackButton.addEventListener('click', () => {
        document.body.removeChild(secondModal);
        openFirstModal(); // Réouvre la première modal
        loadImages(); // Charge à nouveau les images si nécessaire
    });



     // Récupère le bouton "Submit" par son id
const submitButton = secondModal.querySelector('.submitBtn');


// Événement au clic sur le bouton "Submit" dans la deuxième modal
submitButton.addEventListener('click', function(event) {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    // Récupère les valeurs des champs du formulaire
    const title = secondModal.querySelector('#pictureTitle').value;
    const category = secondModal.querySelector('#categoryName').value;
    const image = secondModal.querySelector('#addPictureFile').files[0];

    // Crée un objet FormData
    const formData = new FormData();
    formData.append('title', title); 
    formData.append('category', category); 
    formData.append('image', image);

    console.log('Title :', title);
    console.log('Catégory :', category);
    console.log('Image :', image);

    // Vérifie que tous les champs nécessaires sont remplis
    if (title && category && image) {
        

        // Appelle la fonction pour ajouter la photo en utilisant postRequest
        postRequest('http://localhost:5678/api/works', formData, { Authorization: `Bearer ${token}` })
            .then(function(response) {
                console.log('Photo ajoutée avec succès:', response);

                // Ferme la deuxième modal après l'ajout de la photo
                document.body.removeChild(secondModal);

                // Recharge les images dans la première modal
                loadImages();
            })
            .catch(function(error) {
                console.error('Erreur lors de l\'ajout de la photo:', error);
                window.alert('Erreur lors de l\'ajout de la photo');
            });
    } else {
        window.alert('Veuillez remplir tous les champs obligatoires.');
    }
});

    // Ajoute la deuxième modal au body
    document.body.appendChild(secondModal);
}

// Fonction pour supprimer une photo en fonction de son identifiant
function deleteImage(id) {
    deleteRequest('http://localhost:5678/api/works/' + id)
        .then(() => {
            const deletedWorkElement = document.getElementById(`work-${id}`);
            const deletedModalElement = document.getElementById(`modal-work-${id}`);

            if (deletedWorkElement) {
                deletedWorkElement.remove();
            }

            if (deletedModalElement) {
                deletedModalElement.remove();
            }
        })
        .catch(error => console.error('Erreur lors de la suppression de l\'image:', error));
}

// Fonction pour ajouter les options de catégories au formulaire d'ajout d'image
function categoriesOptions(modalAddPictureForm) {
    fetch("http://localhost:5678/api/categories")
        .then(data => data.json())
        .then(categories => {
            categories.forEach((category) => {
                const categoryChoice = document.createElement("option");
                categoryChoice.classList.add("categoryChoice");
                categoryChoice.setAttribute("value", category.id);
                categoryChoice.innerText = category.name;
                modalAddPictureForm.querySelector(".categoryName").appendChild(categoryChoice);
            });
        });
};