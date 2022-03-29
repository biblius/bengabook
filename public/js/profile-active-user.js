import requests from './modules.js';
const { getResource, setAttributes, acceptFriendship, getActiveUserId } = requests;

const userId = await getActiveUserId();
const pendingRequests = await getResource('requests', userId);
const friends = await getResource('friends', userId);
const haps = await getResource('haps', userId);

const friendContainer = document.querySelector('.friend-list');
const photoMenu = document.querySelector('.change-pic');
const editAbout = document.querySelector('.edit-about-btn');

const toggleAbout = () => {
    if (!document.querySelector('.edit-container')) {
        const editContainer = document.createElement('div');
        editContainer.classList.add('edit-container');
        const aboutForm = document.createElement('form');
        setAttributes(aboutForm, {
            "action": `/about/${userId}`,
            "method": "post",
            "class": "about-form"
        });
        const formText = document.createElement('textarea');
        setAttributes(formText, {
            "name": "about",
            "class": "about-textarea"
        });
        const submit = document.createElement('input');
        setAttributes(submit, {
            "type": "submit",
            "value": "Submit",
            "class": "about-form-submit"
        });
        aboutForm.appendChild(formText);
        aboutForm.appendChild(submit);
        editContainer.appendChild(aboutForm)
        document.querySelector('.user-about').appendChild(editContainer)
    } else {
        const editContainer = document.querySelector('.edit-container');
        document.querySelector('.user-about').removeChild(editContainer);
    }
};

editAbout.addEventListener('click', () => {
    toggleAbout();
})

//turns photomenu on/off
const togglePhotoMenu = () => {
    if (document.querySelector('.change-photo-menu') == null) {
        const changePhotoMenu = document.createElement('nav');
        const chooseFromPhotos = document.createElement('button');
        const uploadPhoto = document.createElement('button');
        chooseFromPhotos.innerHTML = "From photos";
        uploadPhoto.innerHTML = "Upload";

        changePhotoMenu.classList.add('change-photo-menu');
        chooseFromPhotos.classList.add('choose-from-photos');
        uploadPhoto.classList.add('upload-photo-btn');

        changePhotoMenu.appendChild(chooseFromPhotos);
        changePhotoMenu.appendChild(uploadPhoto);
        photoMenu.appendChild(changePhotoMenu);
    } else {
        document.querySelector('.change-photo-menu').remove();
    };
};

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
        const befriend = document.createElement('button');
        befriend.innerHTML = 'Befriend';
        const deny = document.createElement('button');

        befriend.addEventListener('click', () => {
            acceptFriendship(request.from._id)
        });

        requestsInDiv.appendChild(thumb)
        requestsInDiv.appendChild(name);
        requestsInDiv.appendChild(befriend);
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

//change profile pic functionality
// const changePhoto = document.querySelector('.update-profile-pic');
// changePhoto.addEventListener('click', () => {
//     togglePhotoMenu();
// });