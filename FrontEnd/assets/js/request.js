const token = localStorage.getItem("tokenIdentification");
console.log("Token:", token);
// Fonction générique pour effectuer une requête POST
export const postRequest = (url, data, headers = {}) => {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...headers,
        },
        body: JSON.stringify(data),
    })
    .then((response) => {
        if (!response.ok) {
            console.error('Erreur lors de la requête POST. Statut:', response.status);
            console.error('Réponse serveur:', response.statusText);

            // Logue la réponse complète du serveur
            response.text().then((text) => console.error('Réponse complète du serveur:', text));

            throw new Error('Erreur lors de la requête POST');
        }
        return response.json();
    })
    .catch((error) => {
        console.error('Erreur lors de la requête POST:', error);
        throw error;
    });
};


// Fonction pour la requête de connexion
export const loginRequest = (user, password) => {
    const url = "http://localhost:5678/api/users/login";
    const data = { email: user, password: password };

    return postRequest(url, data);
};

// Fonction pour effectuer une requête HTTP GET
export function getRequest(url) {
    return fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .catch((error) => console.error("Error:", error));
}

// Fonction pour effectuer une requête HTTP DELETE
export function deleteRequest(url) {
    return fetch(url, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
    })
        .then((response) => response.json())
        .catch((error) => console.error("Error:", error));
}

// Fonction pour ajouter une photo
export function addPhoto(title, category, image) {
    const formData = new FormData();
    formData.append('titre', title);
    formData.append('categorie', category);
    formData.append('image', image);

    console.log("Token avant l'appel fetch:", token);
    console.log("Données à envoyer:", formData);


    return fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            console.error('Erreur lors de la requête. Statut:', response.status);
            console.error('Réponse serveur:', response.statusText); // Ajout de cette ligne
            throw new Error('Erreur lors de l\'ajout de la photo');
        }
        return response.json();
    })
    
        .catch(error => {
            console.error('Erreur lors de l\'ajout de la photo:', error);
            throw error;
        });
}
