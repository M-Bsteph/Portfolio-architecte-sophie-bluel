//nous définissions que nous ne commes pas connecté
let isConnect = false
console.log(isConnect)

// si le token n'est pas vide, nous pouvons acceder à la page
console.log(localStorage.getItem("tokenIdentification"))
if (localStorage.getItem("tokenIdentification") != null) {
    //   window.location.href = "http://127.0.0.1:5500"
    isConnect = true
    console.log(isConnect)
}

// création boutton "tous"
const sectFiltre = document.querySelector(".filters")
const btnTrierTous = document.createElement("button")
btnTrierTous.innerText = "Tous"
btnTrierTous.id = "btn-tous"
btnTrierTous.value = "all"
btnTrierTous.classList = "active"
sectFiltre.appendChild(btnTrierTous)

// fonction pour charger les travaux 
async function loadWorks() {
    response = await fetch("http://localhost:5678/api/works")
    works = await response.json()
    return works
}

// fonction pour charger les catégories
async function loadCategories() {
    response = await fetch("http://localhost:5678/api/categories")
    categories = await response.json()
    return categories
}


//nous appelons les catégories via fetch afin de les utiliser pour nos filtres
fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(data => {

        // parcourir les catégories pour les associer aux boutons de tri
        for (let id in data) {
            let category = data[id]

            //Création des boutons de tri via parcours de des infos des catégories appelées avec fetch 
            let button = document.createElement("button")
            button.value = category.id
            button.textContent = category.name
            //console.log(category.name)


            //Je place mes bouttons de filtres dans la div filters
            let categories = document.querySelector(".filters")
            categories.appendChild(button)
        }

        // application de css sur les bouttons de tri avec la fonction click
        let filters = document.querySelectorAll(".filters button")
        filters.forEach((filter) => {
            filter.addEventListener("click", () => {
                // désactivation/activation de la class "active"
                filters.forEach((filter) => {
                    filter.classList.remove("active")
                })
                filter.classList.add("active")

                // Vider gallery
                document.querySelector(".gallery").innerHTML = "";

                // Puis charger les travaux selon la catégorie cliquée
                loadWorks().then(works => {
                    for (let id in works) {
                        let work = works[id]
                        if (filter.value == "all") {
                            let figElement = document.createElement("figure")

                            let imgElement = document.createElement("img")
                            imgElement.src = work.imageUrl
                            imgElement.alt = work.title

                            let figCaptionElement = document.createElement("figCaption")
                            figCaptionElement.textContent = work.title

                            figElement.appendChild(imgElement)
                            figElement.appendChild(figCaptionElement)

                            //l'ensemble des éléments crées dans figElement vont être placés dans ma div gallery et se nommerons travaux
                            let travaux = document.querySelector(".gallery")
                            travaux.appendChild(figElement)

                        } else {
                            if (work.category.id == filter.value) {
                                let figElement = document.createElement("figure")

                                let imgElement = document.createElement("img")
                                imgElement.src = work.imageUrl
                                imgElement.alt = work.title

                                let figCaptionElement = document.createElement("figCaption")
                                figCaptionElement.textContent = work.title

                                figElement.appendChild(imgElement)
                                figElement.appendChild(figCaptionElement)

                                //l'ensemble des éléments crées dans figElement vont être placés dans ma div gallery et se nommerons travaux
                                let travaux = document.querySelector(".gallery")
                                travaux.appendChild(figElement)
                            }
                        }
                    }
                });

            })
        })

    })

function showWorks() {
    // Récupération des travaux qui vont apparaitre sans avoir cliquer sur les boutons de tri
    fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(data => {
            console.log(data)

            //on parcours la liste des éléments id présents dans data
            for (let id in data) {
                let object = data[id]

                //Création d'une balise figure qui contiendras l'image et sa description
                let figElement = document.createElement("figure")

                let imgElement = document.createElement("img")
                imgElement.src = object.imageUrl
                imgElement.alt = object.title

                let figCaptionElement = document.createElement("figCaption")
                figCaptionElement.textContent = object.title


                figElement.appendChild(imgElement)
                figElement.appendChild(figCaptionElement)

                //l'ensemble des éléments crées dans figElement vont être placés dans ma div gallery et se nommerons travaux
                let travaux = document.querySelector(".gallery")
                travaux.appendChild(figElement)
            }
        })
}
showWorks()


headband = document.querySelector(".black-headband")
headband.style.display = "none"

btnModif = document.getElementById("open-modal")
btnModif.style.display = "none"

btnOpenModal2 = document.getElementById("modal2")
btnOpenModal2.style.display = "none"


if (isConnect == true) {
    console.log("connecté")
    showLogout = document.getElementById("login")
    showLogout.textContent = "logout"
    logoutId = document.getElementById("login")
    logoutId.id = "logout"
    deleteTokenStorage = document.getElementById("logout")
    deleteTokenStorage.addEventListener("click", function () {
        localStorage.removeItem("tokenIdentification")
        window.location.href = "http://127.0.0.1:5500/index.html"
    })

    headband.style.display = "flex"
    btnModif.style.display = "inline-block"
    filters = document.querySelector(".filters")
    filters.style.display = "none"

} else {
    console.log("déconnecté")
    btnModif.style.display = "none"
}

let modal = null

const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute("href"))
    target.style.display = null
    target.setAttribute("aria-modal", "true")
    target.removeAttribute("aria-hidden")
    modal = target
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

let clickModal = document.querySelector(".js-modal")
clickModal.addEventListener("click", openModal)

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})

let modal2 = null

const openModal2 = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute("href"))
    target.style.display = null
    target.setAttribute("aria-modal", "true")
    target.removeAttribute("aria-hidden")
    modal2 = target
    modal2.querySelector(".js-modal-close").addEventListener("click", closeModal2)
    //disableValidation()
}

const closeModal2 = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal2.style.display = "none"
    modal2.setAttribute("aria-hidden", "true")
    modal2.removeAttribute("aria-modal")
    modal2.querySelector(".js-modal-close").removeEventListener("click", closeModal2)
    modal2 = null
}

let clickModal2 = document.getElementById("open-modal2")
clickModal2.addEventListener("click", openModal2)

let backToModal = document.querySelector(".fa-arrow-left")
backToModal.addEventListener("click", closeModal2)

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal2(e)
    }
})

function addCategorieToSelect() {
    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(data => {
            for (let id in data) {
                let category = data[id]
                console.log(category.name)

                let options = document.createElement("option")

                options.textContent = category.name
                options.value = category.id
                inputCategorie = document.getElementById("categorie")
                inputCategorie.appendChild(options)
            }
        })
}

addCategorieToSelect()


function deleteImg(event) {
    console.log(event.target.id)
    fetch(`http://localhost:5678/api/works/${event.target.id}`, {
        method: `DELETE`,
        headers: { "Authorization": "Bearer " + localStorage.getItem("tokenIdentification") },
    }).then(() => {
        document.querySelector(".modal-img").innerHTML = "";
        document.querySelector(".gallery").innerHTML = "";
        showWorks()
        loadImgModal()
    })

}


loadImgModal()

async function loadImgModal() {
    response = await fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(data => {

            //on parcours la liste des éléments id présents dans data
            for (let id in data) {
                let object = data[id]

                //Création d'une balise figure qui contiendras l'image et sa description
                let figElement = document.createElement("figure")

                let imgElement = document.createElement("img")
                imgElement.src = object.imageUrl
                imgElement.alt = object.title

                //Création bouton poubelle sur les photos de la modal
                let poubelle = document.createElement('i')

                poubelle.className = "fa-solid fa-trash-can"
                poubelle.id = object.id

                //fonction deleteImg pour le click sur la corbeille
                figElement.appendChild(poubelle)
                poubelle.addEventListener("click", function (event) {
                    deleteImg(event)
                })

                let figCaptionElement = document.createElement("figCaption")
                figCaptionElement.textContent = object.title

                figElement.appendChild(imgElement)

                //l'ensemble des éléments crées dans figElement vont être placés dans la div modal-img et se nommerons travaux
                let travaux = document.querySelector(".modal-img")
                travaux.appendChild(figElement)

            }
        })
}
