const urlBase = "http://gateway.marvel.com/v1/public/";
        let ts = "ts=1";
        const publicKey = "&apikey=8dc1b4319121c44d910512cac0b27563";
        const hash = "&hash=d05cdf669e3cc07e2dbef29e98d4ed2f";

        document.addEventListener("DOMContentLoaded", async () => {
            const filterSelect = document.getElementById("filter-select");
            const searchButton = document.getElementById("search-button");
            const totalResultsElement = document.getElementById("total-results");
            const sortSelect = document.getElementById("sort-select");
            const searchInput = document.getElementById("search-input");

            const updateSortOptions = (selectedType, selectedSort) => {
                const sortOptions = sortSelect.options;

                sortOptions[1].style.display = "block";
                sortOptions[2].style.display = "block";
                sortOptions[3].style.display = "block";

                if (selectedType === "name" || selectedType === "characters") {
                    sortOptions[2].style.display = "none";
                    sortOptions[3].style.display = "none";
                }

                for (let i = 0; i < sortOptions.length; i++) {
                    if (sortOptions[i].value === selectedSort) {
                        sortOptions[i].selected = true;
                        break;
                    }
                }
            };

            const buildComicCards = (data) => {
                const cardContainer = document.getElementById("results-section");
                cardContainer.innerHTML = "";

                data.forEach((comic) => {
                    const card = document.createElement("div");
                    card.classList.add("card");
                    const thumbnailSrc = comic.thumbnail
                        ? `${comic.thumbnail.path}.${comic.thumbnail.extension}`
                        : 'placeholder.jpg';

                    card.innerHTML = `
                        <img src="${thumbnailSrc}" alt="${comic.title}">
                        <h2>${comic.title}</h2>
                    `;

                    cardContainer.appendChild(card);
                });
            };

            const buildCharacterCards = (data) => {
                const cardContainer = document.getElementById("results-section");
                cardContainer.innerHTML = "";

                data.forEach((character) => {
                    const card = document.createElement("div");
                    card.classList.add("card");
                    const thumbnailSrc = character.thumbnail
                        ? `${character.thumbnail.path}.${character.thumbnail.extension}`
                        : 'placeholder.jpg';

                    card.innerHTML = `
                        <img src="${thumbnailSrc}" alt="${character.name}">
                        <h2>${character.name}</h2>
                    `;

                    cardContainer.appendChild(card);
                });
            };

            const updateTotalResults = (total) => {
                totalResultsElement.textContent = total;
            };

            const fetchComics = async (title, sortOrder) => {
                try {
                    const partialTitle = title ? `&titleStartsWith=${title}` : "";
                    const orderOptions = {
                        ascendant: "title",
                        falling: "-title",
                        newer: "-focDate",
                        older: "focDate",
                    };
                    const orderBy = orderOptions[sortOrder] || "title";
                    const apiUrl = `${urlBase}comics?${ts}${publicKey}${hash}${partialTitle}&orderBy=${orderBy}`;
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    console.log(data.data.results);
                    return { results: data.data.results, total: data.data.total };
                } catch (error) {
                    console.error("Error al obtener datos de la API:", error);
                }
            };
            
            const fetchCharacters = async (name, sortOrder) => {
                try {
                    const partialName = name ? `&nameStartsWith=${name}` : "";
                    const orderOptions = {
                        ascendant: "name",
                        falling: "-name",
                    };
                    const orderBy = orderOptions[sortOrder] || "name";
                    const apiUrl = `${urlBase}characters?${ts}${publicKey}${hash}${partialName}&orderBy=${orderBy}`;
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    console.log(data.data.results);
                    return { results: data.data.results, total: data.data.total };
                } catch (error) {
                    console.error("Error al obtener datos de la API:", error);
                }
            };
            

            const handleSearch = async () => {
                const selectedValue = filterSelect.value;
                const selectedSort = sortSelect.value;
                const searchTerm = searchInput.value;
                updateSortOptions(selectedValue, selectedSort);
        
                if (selectedValue === "title") {
                    const comicsData = await fetchComics(searchTerm, selectedSort);
                    updateTotalResults(comicsData.total);
                    buildComicCards(comicsData.results);
                } else if (selectedValue === "name") {
                    const charactersData = await fetchCharacters(searchTerm, selectedSort);
                    updateTotalResults(charactersData.total);
                    buildCharacterCards(charactersData.results);
                }
            };

            // Construir tarjetas de cómics por defecto
            await handleSearch();

            // Agregar evento input para filtrar resultados en tiempo real
            searchInput.addEventListener("input", async () => {
                await handleSearch();
            });

            searchButton.addEventListener("input", handleSearch);
        });