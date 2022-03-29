import requests from './modules.js';
const { getResource, setAttributes, acceptFriendship, setProfilePic } = requests;

const userImages = document.querySelector('.user-images');

userImages.childNodes.forEach(image => {
    image.addEventListener('click', () => {
        console.log(image.children[0].src)
       setProfilePic(image.children[0].src);
    })
})