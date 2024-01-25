const urlBase = "http://gateway.marvel.com/v1/public/";
let ts = "ts=1";
const publicKey = "&apikey=8dc1b4319121c44d910512cac0b27563";
const hash = "&hash=d05cdf669e3cc07e2dbef29e98d4ed2f";

document.addEventListener("DOMContentLoaded", async () => {
    const filterSelect = document.getElementById("filter-select");
    const searchButton = document.getElementById("search-button");

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

    const fetchComics = async (title) => {
        try {
            let bringTitle = title ? `&title=${title}` : "";
            const apiUrl = `${urlBase}comics?${ts}${publicKey}${hash}${bringTitle}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log(data.data.results);
            return data.data.results;
        } catch (error) {
            console.error("Error al obtener datos de la API:", error);
        }
    };

    const fetchCharacters = async (name) => {
        try {
            let bringName = name ? `&name=${name}` : "";
            const apiUrl = `${urlBase}characters?${ts}${publicKey}${hash}${bringName}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log(data.data.results);
            return data.data.results;
        } catch (error) {
            console.error("Error al obtener datos de la API:", error);
        }
    };

    const handleSearch = async () => {
        const selectedValue = filterSelect.value;

        if (selectedValue === "title") {
            const comicsData = await fetchComics();
            buildComicCards(comicsData);
        } else if (selectedValue === "name") {
            const charactersData = await fetchCharacters();
            buildCharacterCards(charactersData);
        }
    };

    // Construir tarjetas de cómics por defecto
    await handleSearch();

    searchButton.addEventListener("click", handleSearch);
});