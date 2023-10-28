// Importe les fonctions de requête
import { getRequest, postRequest, deleteRequest } from './request.js';

// Fonction pour vérifier l'état de connexion
function checkConnection() {
  return localStorage.getItem("tokenIdentification") !== null;
}

// Fonction pour afficher le bandeau et le bouton de modification
function showHeaderAndButton() {
  const headband = document.querySelector(".black-headband");
  const btnModif = document.getElementById("open-modal");

  headband.style.display = "flex";
  btnModif.style.display = "inline-block";
}

// Fonction pour masquer le bouton de modification
function hideButton() {
  const btnModif = document.getElementById("open-modal");
  btnModif.style.display = "none";
}

// Fonction pour déconnecter l'utilisateur
function logoutUser() {
  const deleteTokenStorage = document.getElementById("logout");

  deleteTokenStorage.addEventListener("click", () => {
      deleteRequest("http://api.example.com/logout") // Remplace l'URL par celle de ta déconnexion
        .then(() => {
          localStorage.removeItem("tokenIdentification");
          window.location.href = "http://127.0.0.1:5500/index.html";
        })
        .catch(error => console.error('Error:', error));
  });
}

// Fonction principale exécutée après le chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
  const showLogout = document.getElementById("login");

  if (checkConnection()) {
      showLogout.textContent = "logout";
      showLogout.id = "logout";

      // Appeler la fonction pour déconnecter l'utilisateur
      logoutUser();

      // Appeler la fonction pour afficher le bandeau et le bouton de modification
      showHeaderAndButton();
  } else {
      // Appeler la fonction pour masquer le bouton de modification
      hideButton();
  }
});
