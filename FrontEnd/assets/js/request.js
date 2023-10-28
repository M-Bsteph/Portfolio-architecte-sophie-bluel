
// Fonction générique pour effectuer une requête POST
export const postRequest = (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());
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
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .catch(error => console.error('Error:', error));
  }
  
  // Fonction pour effectuer une requête HTTP DELETE
  export function deleteRequest(url) {
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .catch(error => console.error('Error:', error));
  }
  // Fonction pour charger les œuvres depuis l'API
export function loadWorks() {
    return fetch("http://localhost:5678/api/works").then(response => response.json());
  }
  
  // Fonction pour charger les catégories depuis l'API
  export function loadCategories() {
    return fetch("http://localhost:5678/api/categories").then(response => response.json());
  }

export async function deleteWork(workId) {
    const token = localStorage.getItem("tokenIdentification");

    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token },
        });

        if (response.ok) {
            return true; // Suppression réussie
        } else {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors de la suppression de l'image");
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'image :', error);
        throw error;
    }
}

export async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors du chargement des œuvres");
        }
    } catch (error) {
        console.error('Erreur lors du chargement des œuvres :', error);
        throw error;
    }
}

// Fonction pour récupérer les images depuis l'API
export function fetchImages() {
    return fetch('http://localhost:5678/api/works')
        .then(response => response.json());
}

// Fonction pour supprimer une image en fonction de son identifiant
export function deleteImageRequest(id) {
    const apiUrl = `http://localhost:5678/api/works/${id}`;

    return fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur lors de la suppression de l'image: ${response.status}`);
        }
    });
}

// Fonction pour récupérer les catégories depuis l'API
export function fetchCategories() {
    return fetch('http://localhost:5678/api/categories')
        .then(response => response.json());
}
