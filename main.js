const urlBase = "http://gateway.marvel.com/v1/public/";
let ts = "ts=1";
const publicKey = "&apikey=8dc1b4319121c44d910512cac0b27563";
const hash = "&hash=d05cdf669e3cc07e2dbef29e98d4ed2f";

document.addEventListener("DOMContentLoaded", async () => {
    
    // Función para obtener datos de la API
    const fetchData = async (title) => {
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

    // Función para construir las tarjetas
    const buildCards = async () => {
        const cardContainer = document.getElementById("results-section");
        const data = await fetchData();

        if (data) {
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
        }
    };

  
    buildCards();
});
