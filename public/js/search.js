import requests from './modules.js';
const { sendRequest, setAttributes, acceptFriendship } = requests;

const addFriendButtons = document.querySelectorAll(".add-friend-btn");
const acceptFriendButtons = document.querySelectorAll(".accept-btn");
const viewProfileButtons = document.querySelectorAll(".view-user-profile");

viewProfileButtons.forEach(button => {
    button.setAttribute('onClick', `location.href = '/user/${button.closest('li').id}'`)
    console.log(button.closest('li').id)

})

addFriendButtons.forEach(button => {
    button.addEventListener('click', () => {
        sendRequest(button.id);
    })
});

acceptFriendButtons.forEach(button => {
    button.addEventListener('click', () => {
        acceptFriendship(button.id.slice(5));
    })
});


