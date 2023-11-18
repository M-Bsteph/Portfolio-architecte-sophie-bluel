function blackHeadband() {
    const blackHeadband = document.querySelector(".black-headband");
    blackHeadband.style.display = "flex";

    const editionGallery = document.querySelector(".editionGallery");
    editionGallery.style.marginBottom = "80px";

    const modifyBtn = document.querySelector(".modifyBtn");
    modifyBtn.style.display = "block";

    const filters = document.querySelector(".filters");
    filters.style.display = "none";

    const btnLog = document.querySelector(".btnLog");
    btnLog.innerHTML = "logout";

    btnLog.addEventListener("click", function () {
        localStorage.removeItem("token");
    });
}

function connected() {
    const userConnected = localStorage.getItem("token");
    if (userConnected) {
        blackHeadband();
        mainGallery();
    } else {
        filters();
        mainGallery();
    }
}

connected();
