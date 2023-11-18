document.addEventListener("DOMContentLoaded", function() {
   
    mainGallery();
});

function filters() {
    fetch("http://localhost:5678/api/categories")
        .then(data => data.json())
        .then(categories => {
            const filters = document.querySelector(".filters");
            const btnAll = document.createElement("button");
            btnAll.classList.add("filtersBtn", "filtersBtnSelected");
            btnAll.innerText = "Tous";
            btnAll.setAttribute("data-id", "0");
            filters.appendChild(btnAll);

            categories.forEach((category) => {
                const btnCategory = document.createElement("button");
                btnCategory.classList.add("filtersBtn");
                btnCategory.setAttribute("data-id", category.id);
                btnCategory.innerText = category.name;
                filters.appendChild(btnCategory)
            })

            buttonSelected();
        })
        .catch(error => {
            console.error("Un problème est survenu lors de la récupération des données:", error);
        });
}
function mainGallery() {
    fetch("http://localhost:5678/api/works")
        .then(data => data.json())
        .then(works => {
            const gallery = document.querySelector(".gallery");
            gallery.innerHTML = "";
            for (let i = 0; i < works.length; i++) {
                const figure = document.createElement("figure");
                figure.setAttribute("data-id", works[i].categoryId);

                const image = document.createElement("img");
                image.src = works[i].imageUrl;
                image.alt = works[i].title;

                const figCaption = document.createElement("figcaption");
                figCaption.innerText = works[i].title;

                figure.appendChild(image);
                figure.appendChild(figCaption);
                gallery.appendChild(figure);
            }
        })
        .catch(error => {
            console.error("Un problème est survenu lors de la récupération des données:", error);
        });
}

function buttonSelected() {
    const allBtn = document.querySelectorAll("button");
    allBtn.forEach((buttons) => {
        buttons.addEventListener("click", function () {

            const btnDisabled = document.querySelector(".filtersBtnSelected");
            btnDisabled.classList.remove("filtersBtnSelected");
            buttons.classList.add("filtersBtnSelected");

            const allFigures = document.querySelectorAll("figure");
            allFigures.forEach((figure) => {
                if (figure.dataset.id === buttons.dataset.id || buttons.dataset.id === "0" || figure.dataset.id === "0") {
                    figure.style.display = "block";
                } else {
                    figure.style.display = "none";
                }
            });
        });
    });
}
