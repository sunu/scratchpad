var localforage = require('localforage');

window.onload = function() {
    var input = document.querySelector('#input');

    localforage.getItem('savedContent', function(err, value) {
        if (err) {
            input.value = "Sorry, your browser doesn't support localStorage. Please switch to a modern browser.";
        } else {
            input.value = value || "Hello there! Let's write some notes.";
            input.onkeyup = saveContent;
            input.onblur = saveContent;
        };
    });
};

function saveContent(e) {
    console.log("Saving content...")
    localforage.setItem('savedContent', e.target.value);
    input.value = e.target.value;
}
