// Fonction pour gérer la connexion de l'utilisateur
function logIn() {
    // Sélectionne le formulaire de connexion dans le DOM
    const loginForm = document.querySelector("form");

    // Ajoute un écouteur d'événements pour le soumission du formulaire
    loginForm.addEventListener("submit", function (event) {
        // Empêche le comportement par défaut du formulaire (rechargement de la page)
        event.preventDefault();

        // Récupère les valeurs de l'email et du mot de passe depuis le formulaire
        const emailValue = document.getElementById("email").value;
        const passwordValue = document.getElementById("password").value;

        // Sélectionne l'élément d'affichage des messages d'erreur
        const errorMessage = document.querySelector(".errorMessage");

        // Crée un objet avec les informations de l'utilisateur
        const userIdentifier = {
            email: emailValue,
            password: passwordValue,
        };

        // Effectue une requête POST vers le serveur avec les informations de l'utilisateur
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userIdentifier)
        })
        .then(response => response.json())
        .then(identifiers => {
            // Vérifie si le serveur a renvoyé un jeton (token) d'authentification
            if (identifiers.token) {
                // Stocke le jeton dans le stockage local du navigateur
                localStorage.setItem("token", identifiers.token);
                // Redirige l'utilisateur vers la page d'accueil
                window.location.href = "./index.html";
            } else {
                // Affiche un message d'erreur si l'authentification a échoué
                errorMessage.textContent = "Erreur dans l'identifiant ou le mot de passe";
                errorMessage.classList.add("error");
            }
        });
    });
}

// Appelle la fonction logIn pour activer la gestion de la connexion
logIn();
