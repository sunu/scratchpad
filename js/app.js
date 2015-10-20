var localforage = require('localforage');
var Autolinker = require( 'autolinker' );

var input, overlay, helpdiv;
var overlayActive, insertModeMessage, viewModeMessage;

window.onload = function() {
    input = document.querySelector('#input');
    overlay = document.querySelector("#overlay");
    helpdiv = document.querySelector("#help");

    insertModeMessage = 'Currently in `Insert` mode. Press `Esc` to switch to `View` mode.'
    viewModeMessage = 'Currently in `View` mode. Press `Enter` to switch to `Insert` mode.'

    overlay.onclick = activateInput;
    window.onkeydown = handleKeyboardInput;

    localforage.getItem('savedContent', function(err, value) {
        if (err) {
            input.value = "Sorry, your browser doesn't support localStorage. Please switch to a modern browser.";
        } else {
            input.value = value || "Hello there! Let's write some notes.";
            input.onkeyup = saveContent;
            input.onblur = saveContent;
            input.onblur = activateOverlay;
            activateOverlay();
        };
    });
};

function saveContent(e) {
    localforage.setItem('savedContent', e.target.value)
               .then(function(){
                    // Chrome persistence bug workaround.
                    localforage.getItem('savedContent');
               })
    input.value = e.target.value;
}

function activateInput() {
    overlay.style.zIndex = -100;
    overlayActive = false;
    helpdiv.innerHTML = insertModeMessage;
    var temp = input.value;
    input.value = '';
    input.focus();
    input.value = temp;
}

function activateOverlay() {
    input.blur();
    var linkedText = Autolinker.link(input.value);
    overlay.innerHTML = linkedText;
    overlay.style.zIndex = 100;
    overlayActive = true;
    helpdiv.innerHTML = viewModeMessage;
}

function handleKeyboardInput(e) {
    if (e.keyCode===27){
        activateOverlay();
    }
    if ((e.keyCode===13) && (overlayActive==true)){
        e.preventDefault();
        activateInput();
    }
}
