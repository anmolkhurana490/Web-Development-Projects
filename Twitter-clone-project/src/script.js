let posts_for_you, posts_following, current_profile;
let top_options_container;
let menu_button, sideMenuBar, overBody;
let new_tweet_btn, postbox_popup;
let textareas;

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// gives formatted age of post (how much time ago, it was posted)
function format_time(timeData) {
    let time_diff = Date.now() - timeData;
    let timeUnits = [
        { unit: 'year', duration: 31579200000 },
        { unit: 'month', duration: 2592000000 },
        { unit: 'day', duration: 86400000 },
        { unit: 'hour', duration: 3600000 },
        { unit: 'minute', duration: 60000 },
        { unit: 'second', duration: 1000 }
    ];

    for (const { unit, duration } of timeUnits) {
        if (time_diff >= duration) {
            const calculatedTime = Math.floor(time_diff / duration)
            return calculatedTime == 1 ? `1 ${unit}` : `${calculatedTime} ${unit}s`;
        }
    }
    return 'now';
}

// convert to Thousands, Millions shorthand
function format_numData(num) {
    if (!num) return '';
    else if (num > 1000000) {
        return Math.floor(num / 1000000) + 'M';
    }
    else if (num > 1000) {
        return Math.floor(num / 1000) + 'K';
    }
    else return num;
}

function format_postText(text) {
    // formatting next lines
    text = text.trim().replaceAll('\n', '<br>');

    // formatting each url
    const urlPattern = /http:\/\/[^\s]+/g;
    text = text.replace(urlPattern, (url) => {
        return `<a href="${url}" class="text-blue-500 break-words">${url}</a>`;
    });
    return text;
}

// to add posts dynamically to home page
function add_post(post_data) {
    const {
        '_id': post_id,
        'post-profile': { profile_photo, profile_name, profile_id, profile_verified },
        'post-content': { text, media: { image } },
        'post-meta-data': { post_time, post_comments, post_reposts, post_likes, post_views, post_bookmarks, post_shares }
    } = post_data;

    const display_length = 400;
    const truncatedText = text.length > display_length ? text.substring(0, display_length) + '...' : text;
    const showMoreLink = text.length > display_length ? '<a href="#" class="show-more text-blue-500">Show More</a>' : '';

    const formated_truncatedText = format_postText(truncatedText);
    const formated_fullText = format_postText(text);

    const postHTML = `
        <div class="profile-picture bg-[url('${profile_photo}')]"></div>
        <div class="post-details w-[88%]">
            <div class="post-header flex [&>*]:mx-1 flex-wrap">
                <p class="profile_name font-bold">${profile_name}</p>
                ${profile_verified ? `<div><i class="fa-solid fa-circle-check text-blue-500"></i></div>` : ''}
                <p class="x-profile_id text-white/70">${profile_id}</p>
                <p class="seperator">∙</p>
                <p class="post-time">${format_time(post_time)}</p>
            </div>
            <div class="post-content flex flex-col gap-4 mb-4">
                <div class="post-text">
                    <p class="displaying-text flex-wrap">${formated_truncatedText}</p>
                    ${showMoreLink}
                </div>
                <div class="post-media">
                    <img class="rounded-2xl max-h-[35rem]" src="${image}">
                </div>
            </div >
            <div class="post-footer flex justify-between small-gray">
                <button id="comment" class="post-footer-btn"><i class="fa-regular fa-comment"></i> ${format_numData(post_comments)}</button>
                <button id="repost" class="post-footer-btn"><i class="fa-solid fa-retweet"></i> ${format_numData(post_reposts)}</button>
                <button id="like" class="post-footer-btn"><i class="fa-regular fa-heart"></i> ${format_numData(post_likes)}</button>
                <button id="view" class="post-footer-btn"><i class="fa-solid fa-chart-column"></i> ${format_numData(post_views)}</button>
                <button id="bookmark" class="post-footer-btn"><i class="fa-regular fa-bookmark"></i> ${format_numData(post_bookmarks)}</button>
                <button id="share" class="post-footer-btn"><i class="fa-solid fa-arrow-up-from-bracket"></i> ${format_numData(post_shares)}</button>
            </div>
        </div >
    `

    const postElement = document.createElement('div');
    postElement.setAttribute('class', 'x-post flex gap-2 px-4 py-3 bottom-line');
    postElement.setAttribute('data-post_id', post_id);
    postElement.innerHTML = postHTML;
    posts_for_you.appendChild(postElement);

    //  show more/less functionality
    const showMoreElement = postElement.querySelector('.show-more');
    if (showMoreElement) showMoreElement.addEventListener('click', (event) => {
        event.preventDefault();
        const postText = showMoreElement.previousElementSibling;
        if (showMoreElement.classList.contains('less')) { // will show less
            postText.innerHTML = formated_truncatedText;
            showMoreElement.innerText = 'Show More';
        }
        else { // will show more
            showMoreElement.previousElementSibling.innerHTML = formated_fullText;
            showMoreElement.innerText = 'Show Less';
        }
        showMoreElement.classList.toggle('less');
    });

    postElement.addEventListener('click', (e) => {
        let command_btn = e.target.closest('.post-footer-btn');
        if(command_btn){
            fetch('/post_footer_command', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'post-id': post_id,
                    'update': `post_${command_btn.id}s`
                })
            }).then(data => {
                command_btn.querySelector('i').classList.toggle('fa-solid');
            })
            .catch(err => console.log(err));
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    current_profile = document.querySelector('#current-profile');
    posts_for_you = document.getElementById('posts-for-you-container');
    posts_following = document.getElementById('posts-following-container');
    top_options_container = document.getElementById('top-options-container');
    postbox_popup = document.getElementById('postbox-popup');
    overBody = document.querySelector('.over-body');
    textareas = document.querySelectorAll('textarea');

    // for small mobile screens only
    menu_button = document.querySelector('nav.small-top #current-profile');
    sideMenuBar = document.querySelector('nav.large');

    fetch('/get_posts', { method: 'POST' }).then(response => response.json())
        .then(data => {
            data.forEach(post => add_post(post));
        }).catch(error => console.log(error));

    // Toggle between For You posts and Following posts
    top_options_container.addEventListener('click', (event) => {
        if (event.target.closest('.for-you-option')) {
            posts_for_you.classList.remove('hidden');
            posts_following.classList.add('hidden');

            // moving selected option underline
            top_options_container.querySelector('.for-you-option .under-line').classList.remove('hidden');
            top_options_container.querySelector('.following-option .under-line').classList.add('hidden');
        }
        else {
            posts_for_you.classList.add('hidden');
            posts_following.classList.remove('hidden');

            top_options_container.querySelector('.for-you-option .under-line').classList.add('hidden');
            top_options_container.querySelector('.following-option .under-line').classList.remove('hidden');
        }
    })

    // Hanldle Side Menu Bar (in mobile view)
    document.addEventListener('click', (event) => {
        if (menu_button.contains(event.target)) {
            sideMenuBar.classList.add('active');
            overBody.classList.add('active');
        }
        else if (overBody.contains(event.target)) {
            sideMenuBar.classList.remove('active');
            overBody.classList.remove('active');
        }
    });

    // Handle Post Box Popup
    document.addEventListener('click', (event) => {
        if (event.target.closest('.new-tweet-btn')) {
            event.preventDefault();
            postbox_popup.classList.add('active');
            overBody.classList.add('active');
        }
        else if (event.target == overBody || event.target.closest('#close-btn')) {
            postbox_popup.classList.remove('active');
            overBody.classList.remove('active');
        }
    });

    // Control size of text area for post input
    textareas.forEach(textarea => {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px'; // Set the height to the scroll height

            const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
            let textrows = Math.floor(textarea.scrollHeight / lineHeight);
            textarea.rows = Math.min(Math.max(textrows, 2), 10); // Set rows between 2 and 10
        })
    });

    // Handle Post Upload
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('post-btn')) {
            const postbox = event.target.closest('.postbox');
            const postText = postbox.querySelector("[name='post-text']").value;
            fetch('/upload_post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'post-profile': {
                        profile_photo: current_profile.querySelector('.profile-picture').style.backgroundImage,
                        profile_name: current_profile.querySelector('.name').innerText,
                        profile_id: current_profile.querySelector('.x-id').innerText,
                        profile_verified: true
                    },
                    'post-content': {
                        text: postText,
                        media: {
                            'image': '',
                            'video': ''
                        }
                    }
                })
            }).then(data => {
                if (data.status == 202) alert('Post Successfully Uploaded!');
                console.log(data)
            }).catch(error => console.log(error));
        }
    })
})