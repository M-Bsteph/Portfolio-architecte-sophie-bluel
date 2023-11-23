// Attendre que le contenu du DOM soit entièrement chargé
document.addEventListener("DOMContentLoaded", function () {});

// Obtenir une référence vers l'élément du DOM pour la modale
const modal = document.querySelector(".modal");
// Obtenir une référence vers le bouton de modification
const modifyBtn = document.querySelector(".modifyBtn");
// Récupérer le jeton d'authentification depuis le stockage local
const token = localStorage.getItem("token");

// Ajouter un écouteur d'événements au bouton de modification pour générer la galerie modale
modifyBtn.addEventListener("click", generateModalGallery);

// Fonction pour générer la galerie modale
function generateModalGallery(event) {
  event.preventDefault();
  modal.innerHTML = "";
  modal.style.display = "flex";
  modal.removeAttribute("aria-hidden");
  modal.ariaModal = "true";
  modalGalleryElements();
}

// Fonction pour créer les éléments à l'intérieur de la galerie modale
function modalGalleryElements() {
  // Ajouter un écouteur d'événements de clic pour fermer la modale en cliquant à l'extérieur du contenu
  modal.addEventListener("click", closeModal);

  // Créer une div pour la galerie modale
  const modalGallery = document.createElement("div");
  modalGallery.classList.add("modalGallery");
  modalGallery.setAttribute("id", "modalGallery");
  modalGallery.addEventListener("click", stopPropagation);

  // Remplir la galerie modale avec du contenu HTML
  modalGallery.innerHTML =
    /* html */
    `<i class="fa-solid fa-xmark fa-xl closeModal"></i>
        <h3 class="modalTitle">Galerie photo</h3>
        <div class="miniGallery"></div>
        <hr>
        <button class="addPictureButton">Ajouter une photo</button>`;

  // Ajouter des écouteurs d'événements sur les éléments nouvellement créés
  modalGallery
    .querySelector(".closeModal")
    .addEventListener("click", closeModal);
  modalGallery
    .querySelector(".addPictureButton")
    .addEventListener("click", modalAddPicture);

  // Ajouter la galerie modale à la modale principale
  modal.appendChild(modalGallery);
  retrieveModalGallery();
}

// Fonction pour récupérer la galerie modale depuis le serveur
function retrieveModalGallery() {
  fetch("http://localhost:5678/api/works")
    .then((data) => data.json())
    .then((worksGallery) => {
      const gallery = document.querySelector(".miniGallery");
      gallery.innerHTML = "";
      for (let i = 0; i < worksGallery.length; i++) {
        const figureModal = document.createElement("figure");
        figureModal.classList.add("figureModal");
        figureModal.setAttribute("data-id", worksGallery[i].id);

        figureModal.innerHTML =
          /* html */
          `<img class="miniPictureGallery" src=${worksGallery[i].imageUrl} alt=${worksGallery[i].title}>
                    <span class="deletePictureBtn">
                        <i class="fa-solid fa-trash-can fa-xs"></i>
                    </span>`;

        figureModal
          .querySelector(".deletePictureBtn")
          .addEventListener("click", function (event) {
            event.preventDefault();
            deletePicture(figureModal);
          });

        gallery.appendChild(figureModal);
      }
    })
    .catch((error) => {
      console.log("Un problème est survenue lors de la récupération:", error);
    });
}

// Fonction pour supprimer une image de la galerie modale
function deletePicture(figureModal) {
  const projectId = figureModal.dataset.id;
  fetch("http://localhost:5678/api/works/" + projectId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((Response) => {
      if (Response.ok) {
        retrieveModalGallery();
        mainGallery();
      } else {
        window.alert(
          "Une erreur s'est produite, le projet n'a pas été supprimé"
        );
      }
    })
    .catch((error) => {
      console.log("Un problème est survenue lors de la suppresion:", error);
    });
}

// Fonction pour ajouter une nouvelle image à la galerie modale
function modalAddPicture(event) {
  event.preventDefault();
  modal.innerHTML = "";

  // Créer un formulaire pour ajouter une nouvelle image
  const modalAddPictureForm = document.createElement("div");
  modalAddPictureForm.classList.add("modalAddPictureForm");
  modalAddPictureForm.addEventListener("click", stopPropagation);
  modalAddPictureForm.innerHTML =
    /* html */
    `<i class="fa-solid fa-arrow-left fa-xl previousModal"></i>
        <i class="fa-solid fa-xmark fa-xl closeModal"></i>
        <h3 class="modalTitle">Ajout photo</h3>
        <form class="formModal">
            <div class="blocToAddPicture">
                <i class="fa-regular fa-image  iconeFormPicture"></i>
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
            <button type="submit" class="submitBtn btnDisabled">Valider</button>
        </form>`;

  // Ajouter des écouteurs d'événements sur les éléments du formulaire
  modalAddPictureForm
    .querySelector(".previousModal")
    .addEventListener("click", generateModalGallery);
  modalAddPictureForm
    .querySelector(".closeModal")
    .addEventListener("click", closeModal);
  modalAddPictureForm
    .querySelector(".addFile")
    .addEventListener("change", picturePreview);

  // Ajouter les options de catégorie au formulaire
  categoriesOptions(modalAddPictureForm);

  // Récupérer les éléments du formulaire
  const formModal = modalAddPictureForm.querySelector(".formModal");
  const pictureTitle = modalAddPictureForm.querySelector(".pictureTitle");
  const addFile = modalAddPictureForm.querySelector(".addFile");
  const categoryName = modalAddPictureForm.querySelector(".categoryName");
  const submitForm = modalAddPictureForm.querySelector(".submitBtn");

  // Vérifier les entrées du formulaire en temps réel
  verifyInputForm({
    formModal,
    addFile,
    pictureTitle,
    categoryName,
    submitForm,
  });

  // Envoyer le nouveau projet au serveur
  sendNewProject({ formModal, pictureTitle, addFile, categoryName });

  // Ajouter le formulaire à la modale
  modal.appendChild(modalAddPictureForm);
}

// Fonction pour prévisualiser l'image sélectionnée
function picturePreview() {
  const blocToAddPicture = document.querySelector(".blocToAddPicture");
  blocToAddPicture.innerHTML = "";

  blocToAddPicture.innerHTML =
    /* html */
    `<label for="addPictureFile" class="labelPicturePreview">
            <img class="formPicturePreview">
        </label>
        <input id="addPictureFile" type="file" name="addPictureFile" class="pictureBtnHidden addFile" accept=".jpg, .png">`;

  const formPicturePreview = document.querySelector(".formPicturePreview");
  formPicturePreview.src = URL.createObjectURL(this.files[0]);

  const pictureTitle = document.querySelector(".pictureTitle");
  formPicturePreview.alt = pictureTitle.value;

  const addFile = document.querySelector(".addFile");
  addFile.addEventListener("change", picturePreview);
}

// Fonction pour vérifier les entrées du formulaire en temps réel
function verifyInputForm({
  formModal,
  addFile,
  pictureTitle,
  categoryName,
  submitForm,
}) {
  formModal.addEventListener("change", function () {
    if (
      addFile.files[0] &&
      pictureTitle.value != "" &&
      categoryName.value != ""
    ) {
      submitForm.classList.remove("btnDisabled");
    } else {
      submitForm.classList.add("btnDisabled");
    }
  });
}

// Fonction pour envoyer un nouveau projet au serveur
function sendNewProject({ formModal, pictureTitle, addFile, categoryName }) {
  formModal.addEventListener("submit", function (event) {
    event.preventDefault();

    // Créer un objet FormData pour les données du formulaire
    const formData = new FormData();
    formData.append("title", pictureTitle.value);
    formData.append("image", addFile.files[0]);
    formData.append("category", categoryName.value);

    // Envoyer la requête POST au serveur
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          window.alert(
            "Un problème est survenu, l'image n'a pas pu être ajoutée"
          );
        }
      })
      .then((work) => {
        // Logguer la réponse du serveur
        console.log(work);

        // Ajouter la nouvelle œuvre à la galerie principale
        const gallery = document.querySelector(".gallery");
        const figure = document.createElement("figure");
        figure.setAttribute("data-id", work.categoryID);
        const image = document.createElement("img");
        image.src = work.imageUrl;
        image.alt = work.titlle;
        const figCaption = document.createElement("figcaption");
        figCaption.innerText = work.tittle;
        figure.appendChild(image);
        figure.appendChild(figCaption);
        gallery.appendChild(figure);

        // Réinitialiser la modale et régénérer la galerie
        modal.innerHTML = "";
        modalGalleryElements();
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout d'une nouvelle œuvre :", error);
      });
  });
}

// Fonction pour ajouter les options de catégorie au formulaire
function categoriesOptions(modalAddPictureForm) {
  fetch("http://localhost:5678/api/categories")
    .then((data) => data.json())
    .then((categories) => {
      categories.forEach((category) => {
        const categoryChoice = document.createElement("option");
        categoryChoice.classList.add("categoryChoice");
        categoryChoice.setAttribute("value", category.id);
        categoryChoice.innerText = category.name;
        modalAddPictureForm
          .querySelector(".categoryName")
          .appendChild(categoryChoice);
      });
    })
    .catch((error) => {
      console.log("Un problème est survenue lors de la récupération:", error);
    });
}

// Fonction pour fermer la modale
function closeModal(event) {
  event.preventDefault();
  modal.style.display = "none";
  modal.ariaHidden = "true";
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".closeModal").removeEventListener("click", closeModal);
}

// Fonction pour arrêter la propagation de l'événement
function stopPropagation(event) {
  event.stopPropagation();
}
