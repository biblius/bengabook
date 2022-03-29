import requests from './modules.js';
const { getResource, setAttributes, setUnsetLabamba } = requests;

const userId = window.location.href.slice(27);

const pendingRequests = await getResource('requests', userId);
const friends = await getResource('friends', userId);
const friendContainer = document.querySelector('.friend-list');

//append requests
if (pendingRequests.in.length > 0 || pendingRequests.out.length > 0) {

    //create header
    const pending = document.createElement('h3');
    pending.innerHTML = "Pending:";
    document.querySelector('.user-friends').appendChild(pending);

    //create the section
    const pendingSection = document.createElement('section');
    pendingSection.classList.add("pending-requests");
    document.querySelector('.user-friends').appendChild(pendingSection);
    const requestContainer = document.querySelector('.pending-requests');

    const requestsInDiv = document.createElement('div');
    requestsInDiv.classList.add('requests-in');
    const requestsOutDiv = document.createElement('div');
    requestsOutDiv.classList.add('requests-out');

    if (pendingRequests.in.length > 0) {
        requestContainer.appendChild(requestsInDiv);
    };
    if (pendingRequests.out.length > 0) {
        requestContainer.appendChild(requestsOutDiv);
    };

    pendingRequests.in.forEach(request => {
        //thumbnail
        const thumb = document.createElement('img');
        setAttributes(thumb, {
            "src": request.from.profilePic,
            "width": "50px",
            "height": "50px"
        });
        //name
        const name = document.createElement('p');
        name.innerHTML = 'From ' + request.from.username;
        //buttons
        requestsInDiv.appendChild(thumb)
        requestsInDiv.appendChild(name);
    });

    pendingRequests.out.forEach(request => {
        const thumb = document.createElement('img');
        setAttributes(thumb, {
            "src": request.to.profilePic,
            "width": "50px",
            "height": "50px"
        });
        const name = document.createElement('p');
        name.innerHTML = 'To ' + request.to.username;
        requestsOutDiv.appendChild(thumb)
        requestsOutDiv.appendChild(name);
    });
};
//append friends
friends.forEach(friend => {
    const container = document.createElement('div');
    //thumbnail
    const thumb = document.createElement('img');
    setAttributes(thumb, {
        "src": friend.profilePic,
        "width": "50px",
        "height": "50px"
    });
    //name
    const name = document.createElement('a');
    name.innerHTML = friend.username;
    name.href = `/user/${friend._id}`;

    container.appendChild(thumb);
    container.appendChild(name);
    friendContainer.appendChild(container);
});

const labambaButtons = document.querySelectorAll('.labamba-post-btn');
labambaButtons.forEach(button => {
    button.addEventListener('click', () => {
        setUnsetLabamba(button.closest('article').id);
    });
});