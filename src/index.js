window.onload = () => {
    onloadPopular();
}

const allData = document.getElementById('main');
let page = 1;
let description;

const onloadPopular = async () => {
    document.getElementById("pagination").style.display = 'flex';
    await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=574d4246c632c7411a6f4ac3fcc28fbe&language=en-US&page=${page}`)
        .then(response => response.json())
        .then(data => {
            allData.innerHTML = `<ul id='popular_content'></ul>`;
            const popular_content = document.getElementById("popular_content");
            description = data.results;
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < data.results.length; i++) {
                popular_content.innerHTML = `${popular_content.innerHTML} <li class='item' data.id='${data.results[i].id}'>
                    <p class ='inner' id="${i}">  ${data.results[i].original_name} </p>
                    <img src='https://image.tmdb.org/t/p/w500_and_h282_face${data.results[i].backdrop_path}' alt="Image ${data.results[i].original_name} is not available"></li`
                fragment.appendChild(popular_content)
            }
            allData.appendChild(fragment)
            toDescription();
        },
        )
        .catch(error => console.error(error))

    const next = document.getElementById("next");
    next.onclick = () => {
        if (page <= 999) {
            page += 1
            onloadPopular()
        }
    }

    const previous = document.getElementById("previous");
    previous.onclick = () => {
        if (page >= 2) {
            page -= 1;
            onloadPopular()
        }
    }
}

const toDescription = () => {
    for (let i = 0; i < description.length; i++) { 
        document.getElementsByClassName('item')[i].onclick = () => {
            const id_serial = description[i].id;
            fetch(`https://api.themoviedb.org/3/tv/${id_serial}?api_key=574d4246c632c7411a6f4ac3fcc28fbe&language=en-US`)
                .then(response => response.json()
                    .then(data_serial => {
                        document.getElementById("popular_content") ? document.getElementById("popular_content").style.display = 'none' : null;
                        allData.innerHTML = `<ul id='serial'>
                                <li>1.Назва: ${data_serial.original_name}</li>
                                <li>2.Опис: ${data_serial.overview}</li>
                                <li><img src='https://image.tmdb.org/t/p/w500_and_h282_face${data_serial.poster_path}' alt="Image ${data_serial.original_name} is not available"></li>
                                <li>4.Кількість сезонів: ${data_serial.number_of_seasons}</li>
                                <li>5.Кількість епізодів: ${data_serial.number_of_episodes}</li>
                                <li id='data'><p id='big_text'>Сезони:</p><ol id='seasons'></ol></li>
                                </ul>`
                        const seasons = document.getElementById('seasons');
                        const fragment = document.createDocumentFragment();
                        for (let i = 0; i < data_serial.seasons.length; i++) {
                            seasons.innerHTML = `${seasons.innerHTML} <li class='season'> ${data_serial.seasons[i].name} </li>`
                            fragment.appendChild(seasons)
                        }
                        document.getElementById('data').appendChild(fragment)
                        toSeason(data_serial);
                    }))
        }
    };
}

const toSeason = (data_serial) => {
    document.getElementById("pagination").style.display = 'none';
    for (let i = 0; i <= data_serial.number_of_seasons; i++) {
        if (document.getElementsByClassName('season')[0].textContent === 'Specials') {
            id_season = i;
        } else if (data_serial.number_of_seasons === 1) {
            i = 0;
            id_season = 1;
            data_serial.number_of_seasons = 0;
        } else {
            id_season = i + 1;
        }
        for (let i = 0; i <= data_serial.number_of_seasons; i++) {
            document.getElementsByClassName('season')[i].onclick = () => {
                const id_serial = data_serial.id;

                if (document.getElementsByClassName('season').length === 1) {
                    id_season = 1;
                } else {
                    id_season = i;
                }
                fetch(`https://api.themoviedb.org/3/tv/${id_serial}/season/${id_season}?api_key=574d4246c632c7411a6f4ac3fcc28fbe&language=en-US`)
                    .then(response => response.json()
                        .then(data => {
                            const count_episodes = data.episodes;
                            document.getElementById("popular_content") ? document.getElementById("popular_content").style.display = 'none' : null;
                            allData.innerHTML = `<ul id='serial'>
                                <li>1.Назва: ${data.name}</li>
                                <li>2.Опис: ${data.overview}</li>
                                <li><img src="https://image.tmdb.org/t/p/w500_and_h282_face${data.poster_path}" alt="Image ${data.name} is not available"></li>
                                <li>4.Номер сезону: ${data.season_number}</li>
                                <li>5.Кількість епізодів: ${data.episodes.length}</li>
                                <li id="data"><p id='big_text'>Епізоди:</p><ol id='season'></ol></li>
                                </ul>`
                            const season = document.getElementById('season');
                            const fragment = document.createDocumentFragment();
                            for (let i = 0; i < data.episodes.length; i++) {
                                season.innerHTML = `${season.innerHTML}
                                    <li class='episode'>${data.episodes[i].name}</li>`
                                fragment.appendChild(season)
                            }
                            document.getElementById('data').appendChild(fragment)
                            toEpisode(count_episodes, id_serial)
                        }))
            }
        };
    }
}

const toEpisode = (count_episodes, id_serial) => {
    for (let i = 0; i < count_episodes.length; i++) {
        document.getElementsByClassName('episode')[i].onclick = () => {
            const id_episode = i + 1;
            fetch(`https://api.themoviedb.org/3/tv/${id_serial}/season/${id_season}/episode/${id_episode}?api_key=574d4246c632c7411a6f4ac3fcc28fbe&language=en-US`)
                .then(response => response.json()
                    .then(data => {
                        document.getElementById("popular_content") ? document.getElementById("popular_content").style.display = 'none' : null;
                        allData.innerHTML = `<ul id='episode'>
                            <li>1.Назва: ${data.name}</li>
                            <li>2.Опис: ${data.overview}</li>
                            <li><img src='https://image.tmdb.org/t/p/w500_and_h282_face${data.still_path}' alt="Image ${data.name} is not available"></li>
                            <li>4.Номер епізоду: ${id_episode}</li>
                            <li>5.Номер сезону: ${data.season_number}</li>
                            </ul>`
                    }))
        }
    };
}

const popular = document.getElementById("popular");
const ranted = document.getElementById("ranted");

ranted.onclick = () => {
    page = 1;
    document.getElementById("popular_content") ? document.getElementById("popular_content").style.display = 'none' : null;
    toRanted();

    const next = document.getElementById("next");
    next.onclick = () => {
        if (page <= 999) {
            page += 1
            toRanted();
        }
    }

    const previous = document.getElementById("previous");
    previous.onclick = () => {
        if (page >= 2) {
            page -= 1;
            toRanted();
        }
    }
}

const toRanted = async () => {
    document.getElementById("pagination").style.display = 'flex';
    await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=574d4246c632c7411a6f4ac3fcc28fbe&language=en-US&page=${page}`)
        .then(response => response.json())
        .then(data => {
            allData.innerHTML = `<ol id='ranted_content'> </ol>`;
            const ranted_content = document.getElementById("ranted_content");
            description = data.results;
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < data.results.length; i++) {
                ranted_content.innerHTML = `${ranted_content.innerHTML}<li class='item'>
                    <p class ='inner' id="${i}">${data.results[i].original_name}</p><img src='https://image.tmdb.org/t/p/w500_and_h282_face${data.results[i].backdrop_path}' alt="Image ${data.results[i].original_name} is not available "></li>`
                fragment.appendChild(ranted_content);
            }
            allData.appendChild(fragment);
            toDescription();
        })
        .catch(error => console.error(error));
}

popular.onclick = () => {
    page = 1;
    document.getElementById("ranted_content") ? document.getElementById("ranted_content").style.display = 'none' && onloadPopular() : onloadPopular();
}
