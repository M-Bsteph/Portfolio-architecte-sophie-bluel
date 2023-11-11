const token = localStorage.getItem("tokenIdentification");
console.log("Token:", token);
// Fonction générique pour effectuer une requête POST
export const postRequest = (url, data = {}) => {
    return fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        
        },
        body: JSON.stringify(data),
    })
    .then((response) => {
        
        return response.json();
    })
    .catch((error) => {
        console.error('Erreur lors de la requête POST:', error);
      
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

