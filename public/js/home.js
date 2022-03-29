import requests from './modules.js';
const {setUnsetLabamba} = requests;

const labambaButtons = document.querySelectorAll('.labamba-post-btn');
console.log(labambaButtons)

labambaButtons.forEach(button => {
    button.addEventListener('click', () => {
        setUnsetLabamba(button.closest('article').id);
    });
});

const fileInput = document.querySelector('#file');
const formImg = document.querySelector('#formImg');
fileInput.onchange = el => {
    const file = fileInput.files;
    if(file) {
        formImg.src = URL.createObjectURL(file);
    }
}
