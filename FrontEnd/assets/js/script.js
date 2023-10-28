import { deleteWork, getWorks } from ' ./request.js';

document.addEventListener('DOMContentLoaded', async function () {
    let isConnect = localStorage.getItem("tokenIdentification") !== null;
    const gallery = document.querySelector(".gallery");
    const modalImgContainer = document.querySelector(".modal-img");

    if (modalImgContainer) {
        await loadImgModal();
    }
});

async function loadImgModal() {
    const works = await getWorks();
    const modalImgContainer = document.querySelector(".modal-img");

    if (modalImgContainer) {
        works.forEach((work) => {
            const figElement = createFigure(work);
            figElement.id = `modal-work-${work.id}`;

            const trashCanIcon = document.createElement("i");
            trashCanIcon.className = "fa-solid fa-trash-can";
            trashCanIcon.id = work.id;
            trashCanIcon.addEventListener("click", (event) => deleteImg(event));

            figElement.appendChild(trashCanIcon);
            modalImgContainer.appendChild(figElement);
        });
    }
}

async function deleteImg(event) {
    const workId = event.target.id;

    try {
        const deletionSuccessful = await deleteWork(workId);

        if (deletionSuccessful) {
            const deletedWorkElement = document.getElementById(`work-${workId}`);
            const deletedModalElement = document.getElementById(`modal-work-${workId}`);

            if (deletedWorkElement) {
                deletedWorkElement.remove();
            }

            if (deletedModalElement) {
                deletedModalElement.remove();
            }
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'image :', error);
    }
}

async function loadWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
}

function createFigure(work) {
    const figElement = document.createElement("figure");
    figElement.id = `work-${work.id}`;

    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;

    const figCaptionElement = document.createElement("figcaption");
    figCaptionElement.textContent = work.title;

    figElement.appendChild(imgElement);
    figElement.appendChild(figCaptionElement);

    return figElement;
}
