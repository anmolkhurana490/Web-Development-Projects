// wrap additional text content into given length with ...
function wrap_text(text, len) {
    if (text.length > len) {
        return text.slice(0, len - 3) + '...';
    }
    else return text;
}

// format given description (list or string) accordingly
function format_description(desc) {
    if (typeof desc == "object")
        return desc.join(', ');
    else return desc;
}

// load object data from json file
async function load_data(data_path) {
    return fetch(data_path)
        .then(response => response.json())
        .catch(error => console.log("Errorwhile fetching data:", error));
}

// load content data from data_path into given section element
function add_content(data_path, element_selector) {
    const element = document.querySelector(element_selector);
    load_data(data_path).then(data => {
        data.forEach((item, idx) => {
            let block = document.createElement('div');
            block.setAttribute('class', 'block');

            block.setAttribute('data-path', data_path);
            block.setAttribute('data-id', idx);

            block.innerHTML = `
                <div class="image-play-container">
                    <div class="block-image" style="background-image: url('${item.image}')"></div>
                    <button class="play-button"></button>
                </div>
                <div class="block-info">
                    <name>${wrap_text(item.name, 35)}</name>
                    <p>${wrap_text(format_description(item.description), 35)}</p>
                </div>
                <button class="three-dots"></button>
            `;

            block.addEventListener('click', e => {
                if (!e.target.classList.contains('three-dots'))
                    update_music_player(block.dataset)
            });
            element.append(block);
        });
    });
}

// load html template
async function load_template(template_path) {
    const response = await fetch(template_path);
    return response.text();
}

// add default (home) content 
function add_default_spotify_content() {
    load_template('templates/default-spotify-content.html').then(template => {
        document.getElementById('spotify-content').innerHTML = template;
    }).then(() => {
        add_content('data/artists.json', '#artists-section .content-container');
        add_content('data/albums.json', '#albums-section .content-container');
        add_content('data/radios.json', '#radios-section .content-container');
        add_content('data/featured-charts.json', '#featured-charts-section .content-container');
        add_content('data/playlists.json', '#playlists-section .content-container');
    })
}


// add empty library default content
function default_empty_library() {
    load_template('templates/empty_library.html').then(template => {
        document.getElementById('playlists-container').innerHTML = template;
    })
}

// updating library every time of playlist addition or removal
function updateLibrary() {
    const library = localStorage.library;
    if (!library) default_empty_library();
    else {
        const container = document.getElementById('playlists-container');
        container.innerHTML = '';
        const libraryItems = JSON.parse(library);

        libraryItems.map(item => {
            load_data(item.path).then(data => {
                let item_data = data[item.id];
                item_div = document.createElement('div');
                item_div.setAttribute('class', 'item-card');

                item_div.setAttribute('data-path', item.path);
                item_div.setAttribute('data-id', item.id);

                item_div.innerHTML = `
                        <div class="thumbnail-container">
                            <div class="thumbnail" style="background-image: url('${item_data.image}')"></div>
                            <div class="play-button"></div>
                        </div>
                        <div class="item-info">
                            <h4>${item_data.name}</h4>
                            <p>${format_description(item_data.description)}</p>
                        </div>
                        <button class="three-dots"></button>
                    `;

                container.append(item_div);
                return item_div;
            }).then((item_div) => {
                item_div.addEventListener('click', e => {
                    if (!e.target.classList.contains('three-dots'))
                        update_music_player(item_div.dataset)
                });
            });
        });
    }
}
updateLibrary();

// to remove context-menu
function removeContextMenu() {
    const menu = document.querySelector('.context-menu');
    if (menu) {
        menu.remove();
    }
}

// to create context menu
function createContextElement(e, menuMap, focusElement) {
    let cmenu = document.createElement('div');
    cmenu.setAttribute('class', 'context-menu');

    for (const item in menuMap) {
        cmenu.innerHTML += `<div id='${item}' class='menu-button'>${menuMap[item].name}</div>`;
        cmenu.querySelector('#' + item).addEventListener('click', e => menuMap[item].function(focusElement));
    }

    cmenu.style.top = `${e.clientY}px`;
    cmenu.style.left = `${e.clientX}px`;

    document.body.append(cmenu);
    console.log(menuMap, focusElement);
    e.preventDefault();
}


// add into library
function addToLibrary(element) {
    let library = JSON.parse(localStorage.getItem('library'));
    if (!library) library = [];
    library.unshift(element.dataset);
    localStorage.setItem('library', JSON.stringify(library));
    updateLibrary();
}

// remove from library
function removeFromLibrary(element) {
    let library = JSON.parse(localStorage.getItem('library'));
    library = library.filter(item => {
        return item.id != element.dataset.id || item.path != element.dataset.path;
    });
    localStorage.setItem('library', JSON.stringify(library));
    updateLibrary();
}

// initialize music section
function initialize_music_player() {
    music_section = document.createElement('div');
    music_section.setAttribute('id', 'music-player-section');
    document.body.append(music_section);
    return music_section;
}

//update song to music section
function update_music_player(data) {
    let music_section = document.getElementById('music-player-section');
    if (!music_section) music_section = initialize_music_player();
    localStorage.setItem('play-music', JSON.stringify(data));
    load_data(data.path).then((data_obj) => {
        const music_data = data_obj[data.id];
        music_section.innerHTML = `
            <div id="music-info-container">
                <div class="thumbnail" style="background-image: url('${music_data.image}')"></div>
                <div class="music-info">
                    <h4>${wrap_text(music_data.name, 40)}</h4>
                    <p>${wrap_text(format_description(music_data.description), 40)}</p>
                </div>
            </div>
            <div id="music-audio-player-container">
                <audio src="${music_data.song}" id="audio-player"></audio>
                <div id="custom-music-player">
                    <div id="music-control-buttons">
                        <button onclick="play_pause_music()"><i class="fas fa-random"></i></button>
                        <button onclick="previous_music()"><i class="fas fa-step-backward"></i></button>
                        <button onclick="play_pause_music()" class="play"><i class="fas fa-play"></i></button>
                        <button onclick="next_music()"><i class="fas fa-step-forward"></i></button>
                        <button onclick="repeat_music()" class="repeat"><i class="fas fa-repeat"></i></button>
                    </div>
                    <div id="audio-progress-container">
                        <span id="current-time">0:00</span>
                        <input type="range" id="audio-progress-bar" min="0" max="100" value="0"></input>
                        <span id="total-time">0:00</span>
                    </div>
                </div>
            </div>
            <div id="volume-control-container">
                <button onclick="mute_unmute_volume()" class="volume mute"><i class="fas fa-volume-up"></i></button>
                <input type="range" id="volume-bar" min="0" max="1" step="0.1" value="1"></input>
            </div>
        `;

        const audio = document.getElementById('audio-player');
        const currentTime = document.getElementById('current-time');
        const audioDuration = document.getElementById('total-time');
        const progressBar = document.getElementById('audio-progress-bar');
        const volumeBar = document.getElementById('volume-bar');

        audio.addEventListener('loadedmetadata', () => {
            audioDuration.innerText = format_time(audio.duration);
        })

        audio.addEventListener('timeupdate', () => {
            currentTime.innerText = format_time(audio.currentTime);
            progressBar.value = audio.currentTime / audio.duration * 100;
        });

        progressBar.addEventListener('input', () => {
            audio.currentTime = progressBar.value / 100 * audio.duration;
        });

        volumeBar.addEventListener('input', () => {
            audio.volume = volumeBar.value;
        });

        play_pause_music();
    });
}


// functionalities like play, pause, mute, unmute, previous, next music
function play_pause_music() {
    let play_button = document.querySelector('#music-control-buttons button.play');
    let audio = document.getElementById('audio-player');

    if (play_button.classList.contains('pause')) audio.pause();
    else audio.play();

    play_button.classList.toggle('pause');
    play_button.innerHTML = '<i class="fas fa-play">';
    if (play_button.classList.contains('pause')) play_button.innerHTML = '<i class="fas fa-pause">';
}

function previous_music() {
    let music_data = JSON.parse(localStorage.getItem('play-music'));
    let idx = Number(music_data.id);
    load_data(music_data.path).then(data => {
        let prev = data[idx - 1];
        if (prev) {
            update_music_player({ path: music_data.path, id: idx - 1 });
        }
        else console.log('not found');
    })
}

function next_music() {
    let music_data = JSON.parse(localStorage.getItem('play-music'));
    let idx = Number(music_data.id);
    load_data(music_data.path).then(data => {
        let next = data[idx + 1];
        if (next) {
            update_music_player({ path: music_data.path, id: idx + 1 });
        }
        else console.log('not found');
    })
}

function mute_unmute_volume() {
    let volume_button = document.querySelector('#volume-control-container button.volume');
    let audio = document.getElementById('audio-player');

    volume_button.classList.toggle('mute');
    if (volume_button.classList.contains('mute')) audio.muted = true;
    else audio.muted = false;

    volume_button.innerHTML = '<i class="fas fa-volume-up"></i>';
    if (volume_button.classList.contains('mute')) volume_button.innerHTML = '<i class="fas fa-volume-off"></i>';
}

// getting formatted time of current time and music duration
function format_time(time_secs) {
    let mins = Math.floor(time_secs / 60);
    let secs = Math.floor(time_secs % 60);
    if (secs < 10) secs = '0' + secs;
    return `${mins}:${secs}`;
}

// toggling repeat music functionality
function repeat_music() {
    let repeat_button = document.querySelector('#music-control-buttons button.repeat');
    let audio = document.getElementById('audio-player');

    audio.loop = !audio.loop;
    repeat_button.classList.toggle('active');
}


function close_all_sections() {
    document.getElementById('library').style.display = 'none';
    document.getElementById('spotify-content-container').style.display = 'none';
    if (document.getElementById('music-player-section'))
        document.getElementById('music-player-section').style.display = 'none';
}

function load_library() {
    close_all_sections();
    document.getElementById('library').style.display = 'block';
}

function load_home() {
    close_all_sections();
    document.getElementById('spotify-content-container').style.display = 'block';
    add_default_spotify_content();
}

function load_music_player() {
    close_all_sections();
    if (document.getElementById('music-player-section'))
        document.getElementById('music-player-section').style.display = 'flex';
    else document.getElementById('spotify-content-container').style.display = 'block';
}

function main() {
    // to open link in new tab (for .openInNewTab button)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('openInNewTab')) {
            window.open(e.target.getAttribute('href'), target = '_blank');
        }
    })

    // when section heading or show all is clicked, then show all contents
    document.addEventListener('click', e => {
        if (e.target.matches('.section-header a') || e.target.matches('.section-header h2')) {
            const section = e.target.closest('.content-section');
            const section_title = section.querySelector('.section-header h2').innerText;
            const content_list = section.querySelector('.content-container').children;

            document.getElementById('spotify-content').innerHTML = `<h1>${section_title}</h1>`;
            let allItemsDiv = document.createElement('div');
            allItemsDiv.setAttribute('class', 'all-items');
            if (section.getAttribute('id') == 'artists-section') allItemsDiv.setAttribute('id', 'artists-section');

            Array.from(content_list).forEach((item) => {
                allItemsDiv.append(item);
            })
            document.getElementById('spotify-content').append(allItemsDiv);
            document.getElementById('spotify-content-container').scrollTop = 0;
        }
    })

    // add default content when home button is clicked
    document.getElementById('home').addEventListener('click', add_default_spotify_content);

    // when page is reloaded
    add_default_spotify_content();

    // listening context menu event
    document.addEventListener('contextmenu', e => {
        removeContextMenu();
        let menuMap, focusElement;
        const blockElement = e.target.closest('.block');
        if (blockElement) {
            menuMap = {
                'add': {
                    'name': 'Add to your Library',
                    'function': addToLibrary
                }
            }
            focusElement = blockElement;
        }
        const libraryElement = e.target.closest('.item-card');
        if (libraryElement) {
            menuMap = {
                'remove': {
                    'name': 'Remove from your Library',
                    'function': removeFromLibrary
                }
            }
            focusElement = libraryElement;
        }
        if (menuMap) createContextElement(e, menuMap, focusElement);
    })

    // removing context menu
    document.addEventListener('click', e => {
        removeContextMenu();
        let event = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            clientX: e.clientX,
            clientY: e.clientY
        });
        if (e.target.classList.contains('three-dots')) {
            e.target.dispatchEvent(event);
        }
    })


    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') removeContextMenu();
    });

    // initializing music player section
    if (localStorage.getItem('play-music')) {
        let play_music_data = JSON.parse(localStorage.getItem('play-music'));
        initialize_music_player();
        update_music_player(play_music_data);
        document.addEventListener('keydown', (e) => {
            if (e.key == ' ' && !e.target.classList.contains('text-input')) {
                play_pause_music();
                e.preventDefault();
            }
        });
    }

    // for viewing different sections mobile view (small screen) with help of menu bar
    document.getElementById('nav-menu-icon').addEventListener('click', () => {
        document.getElementById('nav-menu-icon').classList.toggle('show-menu');
    })
}

main();