import { loginRequest } from './request.js';


let formulaire = document.getElementById("form");
formulaire.addEventListener("submit", (event) => {
    // Empêcher le comportement par défaut du formulaire
    event.preventDefault();

    // Récupérer les valeurs de l'identifiant et du mot de passe
    let user = document.getElementById("e-mail").value;
    let password = document.getElementById("mot-de-passe").value;

    // Utiliser la fonction d'authentification
    loginRequest(user, password)
        .then((data) => {
            console.log(data);

            if (data.token != null) {
                // Stocker le token dans le stockage local
                localStorage.setItem("tokenIdentification", data.token);
                // Rediriger vers la page autorisée
                window.location.href = "http://127.0.0.1:5500";
            } else {
                // Afficher une alerte en cas d'identifiant ou de mot de passe incorrect
                alert("Identifiant ou mot de passe incorrect");
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la requête d'authentification", error);
        });
});
