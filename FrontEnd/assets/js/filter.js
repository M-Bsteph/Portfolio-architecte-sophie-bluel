document.addEventListener('DOMContentLoaded', function() {
  let isConnect = localStorage.getItem("tokenIdentification") !== null;
  const filterSection = document.querySelector(".filters");
  const gallery = document.querySelector(".gallery");
  const modalImg = document.querySelector(".projects-modal");

  const btnFilterAll = createButton("Tous", "all", "active");
  filterSection.appendChild(btnFilterAll);

  btnFilterAll.addEventListener("click", () => {
      handleFilterClick("all");
  });

  async function loadWorks() {
      const response = await fetch("http://localhost:5678/api/works");
      return await response.json();
  }

  function createButton(text, value, className) {
      const button = document.createElement("button");
      button.innerText = text;
      button.value = value;
      button.classList = className;
      return button;
  }

  function handleFilterClick(filterValue) {
      const filters = document.querySelectorAll(".filters button");
      filters.forEach((filter) => filter.classList.remove("active"));
      event.target.classList.add("active");

      gallery.innerHTML = "";

      loadWorks().then((works) => {
          for (const id in works) {
              const work = works[id];
              if (filterValue == "all" || work.category.id == filterValue) {
                  const figElement = createFigure(work);
                  gallery.appendChild(figElement);
              }
          }
      });
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

  async function loadCategories() {
      const response = await fetch("http://localhost:5678/api/categories");
      return await response.json();
  }

  function createCategoryButtons(categories) {
      categories.forEach((category) => {
          const button = createButton(category.name, category.id, "");
          button.addEventListener("click", () => handleFilterClick(category.id));
          filterSection.appendChild(button);
      });
  }

  loadCategories().then((categories) => createCategoryButtons(categories));

  loadWorks().then((works) => works.forEach((work) => gallery.appendChild(createFigure(work))));
});
