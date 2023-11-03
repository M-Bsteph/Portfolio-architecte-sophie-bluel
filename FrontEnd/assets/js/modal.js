// Importe les fonctions getRequest, postRequest et deleteRequest depuis le fichier request.js
import { getRequest, postRequest, deleteRequest } from './request.js';

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
                    <i class="fa fa-trash-can trash-btn" data-id=${image.id} ></i>
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
    // Crée la deuxième modal
    const secondModal = document.createElement('div');
    secondModal.classList.add('modal');
    secondModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <button class="js-modal2-back"><i class="fa-solid fa-arrow-left"></i></button>
            <h2>Ajouter une photo</h2>
            
            <form class="add-picture-form" method="post" action="" id="form">
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
                        <option value="1">Objets</option>
                        <option value="2">Appartements</option>
                        <option value="3">Hotel & Restaurants</option>
                        <!-- Ajoute ici les options de catégorie -->
                    </select>
                </div>
                <hr class="bordure-ajout-img">
                
                <!-- Ajoute un bouton Submit avec un id -->
                <button type="submit" class="submit-button" id="submit-btn">Valider</button>
            </form>
        </div>
    `;

    // Récupère le bouton pour fermer la deuxième modal
    const closeSecondModalButton = secondModal.querySelector('.close-modal');

    // Récupère le bouton de retour vers la première modal
    const modal2BackButton = secondModal.querySelector('.js-modal2-back');

    // Récupère le champ de sélection de l'image
    const fileInput = secondModal.querySelector('#id-input');

    // Ajoute un événement au changement de la sélection de fichier
    fileInput.addEventListener('change', showPreview);

    // Récupère le bouton "Submit" par son id
    const submitButton = secondModal.querySelector('#submit-btn');

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

    // Ajoute un événement au clic sur le bouton "Submit"
    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Empêche le comportement par défaut du formulaire

        // Ici, tu peux ajouter le code pour traiter les données du formulaire
        // Par exemple, récupérer les valeurs des champs et effectuer une action en conséquence

        // Une fois le traitement effectué, tu peux fermer la deuxième modal
        document.body.removeChild(secondModal);
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
// Ajoute une fonction pour envoyer une nouvelle œuvre en utilisant la méthode POST
function addPhoto(title, category, image) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('titre', title);
    formData.append('catégorie', category);

    postRequest("http://localhost:5678/api/works", formData)
        .then(response => {
            console.log('Photo ajoutée avec succès:', response);
            closeModal(); // Ferme la première modal après l'ajout de la photo
            loadImages(); // Charge à nouveau les images si nécessaire
        })
        .catch(error => console.error('Erreur lors de l\'ajout de la photo:', error));
}


// Événement au clic sur le bouton "Submit" dans la deuxième modal
submitButton.addEventListener('click', (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    // Récupère les valeurs des champs du formulaire
    const title = secondModal.querySelector('#titre').value;
    const category = secondModal.querySelector('#categorie').value;
    const image = secondModal.querySelector('#id-input').files[0];

    // Appelle la fonction pour ajouter la photo
    addPhoto(title, category, image);
});