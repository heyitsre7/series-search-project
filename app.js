let input = document.getElementById("input");
let button = document.getElementById("btn");
let modal = document.querySelector(".modal-overlay");
let closeBtn = document.querySelector(".close-btn");
let showContainer = document.getElementById("show-container");

button.addEventListener("click", () => {
    let url = `https://api.tvmaze.com/search/shows?q=${input.value}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            showContainer.innerHTML = ""; // Clear previous results

            if (data.length > 0) {
                data.forEach(e => {
                    let show = e.show;

                    let showItem = document.createElement('div');
                    showItem.classList.add('show-item');

                    let posterElement = document.createElement('img');
                    posterElement.src = show.image ? show.image.medium : "";
                    posterElement.alt = `${show.name} Poster`;

                    // Add a click event listener to the image
                    posterElement.addEventListener('click', () => {
                        fetchEpisodes(show.name);
                    });

                    let detailsElement = document.createElement('div');
                    detailsElement.classList.add('details');

                    let titleElement = document.createElement('h2');
                    titleElement.textContent = show.name;

                    let releaseDateElement = document.createElement('p');
                    releaseDateElement.textContent = `Release Date: ${show.premiered || 'N/A'}`;

                    let descriptionElement = document.createElement('p');
                    descriptionElement.innerHTML = `Description: ${show.summary || 'N/A'}`;

                    let genresElement = document.createElement('p');
                    genresElement.textContent = `Genres: ${show.genres.length > 0 ? show.genres.join(', ') : 'N/A'}`;

                    detailsElement.appendChild(titleElement);
                    detailsElement.appendChild(releaseDateElement);
                    detailsElement.appendChild(descriptionElement);
                    detailsElement.appendChild(genresElement);

                    showItem.appendChild(posterElement);
                    showItem.appendChild(detailsElement);

                    showContainer.appendChild(showItem);
                });

                modal.classList.add("open-modal");
            } else {
                showContainer.innerHTML = "<p>No shows found.</p>";
                modal.classList.add("open-modal");
            }
        })
        .catch(error => {
            console.log('There has been a problem with your fetch operation:', error);
            showContainer.innerHTML = "<p>Error fetching show data.</p>";
            modal.classList.add("open-modal");
        });

    input.value = "";
});

modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.classList.remove("open-modal");
    }
});

closeBtn.addEventListener('click', function() {
    modal.classList.remove("open-modal");
});

function fetchEpisodes(showName) {
    let url = `https://api.tvmaze.com/singlesearch/shows?q=${showName}&embed=episodes`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            showContainer.innerHTML = ""; // Clear previous results

            let show = data;
            let episodes = show._embedded.episodes;

            let titleElement = document.createElement('h2');
            titleElement.textContent = `Episodes of ${show.name}`;

            showContainer.appendChild(titleElement);

            episodes.forEach(episode => {
                let episodeItem = document.createElement('div');
                episodeItem.classList.add('show-item');

                let episodePosterElement = document.createElement('img');
                episodePosterElement.src = episode.image ? episode.image.medium : "";
                episodePosterElement.alt = `${episode.name} Poster`;

                let episodeDetailsElement = document.createElement('div');
                episodeDetailsElement.classList.add('details');

                let episodeTitleElement = document.createElement('h3');
                episodeTitleElement.textContent = episode.name;

                let episodeSummaryElement = document.createElement('p');
                episodeSummaryElement.innerHTML = `Summary: ${episode.summary || 'N/A'}`;
                

                episodeItem.appendChild(episodeTitleElement);
                episodeItem.appendChild(episodeSummaryElement);

                episodeItem.appendChild(episodePosterElement);
                episodeItem.appendChild(episodeDetailsElement);


                showContainer.appendChild(episodeItem);
            });

            modal.classList.add("open-modal");
        })
        .catch(error => {
            console.log('There has been a problem with your fetch operation:', error);
            showContainer.innerHTML = "<p>Error fetching episodes data.</p>";
            modal.classList.add("open-modal");
        });
}
