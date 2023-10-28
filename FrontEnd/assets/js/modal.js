// Ton fichier principal

import { fetchImages, deleteImageRequest, fetchCategories } from './request.js';

// Fonction pour afficher l'aperçu de l'image sélectionnée
function showPreview(event) {
    const input = event.target;
    const previewImage = document.getElementById('preview-new-image');
    const choosePictureDiv = document.querySelector('.choose-picture');

    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            // Remplace le contenu de la div "choose-picture" par l'image
            choosePictureDiv.innerHTML = `<img src="${e.target.result}" alt="Selected Image">`;
        };
        reader.readAsDataURL(file);
    }
}

// Récupère le bouton "Modifier" et la première modal
const openModalButton = document.getElementById('open-modal');
const modal = document.createElement('div');

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
    fetchImages()
        .then(images => {
            // Sélectionne l'élément où tu veux ajouter les images (par exemple, un div avec l'id 'image-container')
            const imageContainer = modal.querySelector('#image-container');

            // Vide le contenu actuel de l'élément
            imageContainer.innerHTML = '';

            // Ajoute chaque image à l'élément
            images.forEach(image => {
                const imgElement = document.createElement('div');
                imgElement.innerHTML = `
                    <img src="${image.imageUrl}" alt="${image.title}">
                    <i class="fa fa-trash-can" onclick="deleteImage(${image.id})"></i>
                `;
                imageContainer.appendChild(imgElement);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des images:', error));
}

// Récupère le bouton "Ajouter une photo" à l'intérieur de la première modal
const addPhotoButton = modal.querySelector('#add-photo-button');

// Vérifie si la deuxième modal d'ajout de photo existe déjà
let addPhotoModal = document.getElementById('add-photo-modal');

// Événement au clic sur le bouton "Ajouter une photo" à l'intérieur de la première modal
addPhotoButton.addEventListener('click', () => {
    // Si la deuxième modal existe déjà, l'affiche, sinon, la crée
    if (!addPhotoModal) {
        addPhotoModal = document.createElement('div');
        addPhotoModal.id = 'add-photo-modal';
        addPhotoModal.classList.add('modal');
        addPhotoModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <button class="js-modal2-back"><i class="fa-solid fa-arrow-left"></i></button>
                <h2>Ajout photo</h2>
                <form method="post" action="" id="form">
                    <div class="choose-picture">
                        <div class="preview-upload">
                            <img src="" alt="" id="preview-new-image">
                        </div>
                        <i class="fa-regular fa-image"></i>
                        <input type="file" class="upload-picture" name="photo" id="id-input" style="display:none">
                        <label class="upload-picture" id="btn-add-img" for="id-input">+ Ajouter photo</label>
                        <p class="max-size-img">jpg, png : 4mo max</p>
                    </div>
                    <div class="formulaire-modal2">
                        <label for="titre">Titre</label>
                        <input type="text" name="Titre" id="titre" autofocus required>
                    </div>
                    <div class="formulaire-modal2">
                        <label for="categorie">Catégorie</label>
                        <select name="categorie" id="categorie" required>
                            <option value=""></option>
                        </select>
                        </div>
                        <hr class="bordure-ajout-img">
                        <button type="submit" id="valider-nouvelle-img" class="add-img-valider">Valider</button>
                </form>
            </div>
        `;

        // Récupère le bouton pour fermer la deuxième modal
        const closeAddPhotoModalButton = addPhotoModal.querySelector('.close-modal');
        // Récupère le bouton de retour à l'intérieur de la deuxième modal
        const backToGalleryButton = addPhotoModal.querySelector('.js-modal2-back');

        // Ajoute la deuxième modal au body
        document.body.appendChild(addPhotoModal);

        // Fonction pour fermer la deuxième modal
        function closeAddPhotoModal() {
            addPhotoModal.style.display = 'none';
        }

        // Événement au clic sur la croix pour fermer la deuxième modal
        closeAddPhotoModalButton.addEventListener('click', closeAddPhotoModal);

        // Événement au clic sur le bouton de retour pour retourner à la galerie (première modal)
        backToGalleryButton.addEventListener('click', () => {
            closeAddPhotoModal();
            openFirstModal(); // Fonction pour ouvrir la première modal
        });

        // Récupère le formulaire dans la deuxième modal
        const form = addPhotoModal.querySelector('#form');

        // Événement de soumission du formulaire
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de la page)

            // Ajoute ici le code pour traiter les données du formulaire
            // (par exemple, envoyer une requête HTTP pour enregistrer les données sur le serveur)

            // Ensuite, tu peux fermer la deuxième modal si nécessaire
            closeAddPhotoModal();
        });

        // Récupère le champ de fichier
        const fileInput = addPhotoModal.querySelector('#id-input');

        // Écoute les changements dans le champ de fichier
        fileInput.addEventListener('change', function(event) {
            showPreview(event);
        });

        // Appelle la fonction pour charger les catégories dans le dropdown
        loadCategoriesDropdown();

        // Événement pour fermer la deuxième modal en dehors de celle-ci
        window.addEventListener('click', (event) => {
            if (event.target === addPhotoModal) {
                closeAddPhotoModal();
            }
        });
    }

    // Ouvre la deuxième modal d'ajout de photos
    addPhotoModal.style.display = 'block';
});

// Fonction pour supprimer une photo en fonction de son identifiant
function deleteImage(id) {
    deleteImageRequest(id)
        .then(() => {
            loadImages(); // Recharge les images après la suppression
        })
        .catch(error => console.error('Erreur lors de la suppression de l\'image:', error));
}

// Fonction pour charger les catégories depuis l'API
function loadCategoriesDropdown() {
    fetchCategories()
        .then(categories => {
            const categoryDropdown = addPhotoModal.querySelector('#categorie');

            // Vide le contenu actuel du dropdown
            categoryDropdown.innerHTML = '';

            // Ajoute chaque catégorie comme une option du dropdown
            categories.forEach(category => {
                const optionElement = document.createElement('option');
                optionElement.value = category.id;
                optionElement.textContent = category.name;
                categoryDropdown.appendChild(optionElement);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des catégories:', error));
}
