message_space = document.querySelector('.message_space');
let text_input = document.querySelector('.user_msg');

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

// Slidebar functionality

menu_state = false;
let sidebar = document.querySelector('.sidebar');

function menu_toggle(){
   if(!menu_state){
     sidebar.style.left = "0vw";
     sidebar.style.opacity = "1";
     menu_state = true;
   } else {
     sidebar.style.left = "-100vw";
     sidebar.style.opacity = "0.5";
     menu_state = false;
   }
}

messages = [];

function make_message(sender, datestamp, text){
  let message_object = {
    sentBy: sender,
    dateStamp: datestamp,
    message: text
  }
  messages.push(message_object);
  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
  //console.log(messages);
  let new_message_dom = document.createElement('div');
  new_message_dom.setAttribute('class', sender);

  let name = document.createElement('h3');
  name.innerHTML = sender;

  let final_message = document.createElement('p');
  final_message.innerHTML = text;

  new_message_dom.appendChild(name);
  new_message_dom.appendChild(final_message);

  message_space.appendChild(new_message_dom);

  // Clear the input
  text_input.value = "";
}

function send_msg(){
  let user_input = text_input.value;
  let curr_date = new Date();
  let month = curr_date.getMonth() + 1;
  let date_str = month.toString() + "/" + curr_date.getDate().toString() + "/" + curr_date.getFullYear().toString();
  make_message("you", date_str, user_input);
}

document.querySelector('.menu_open_btn').addEventListener('click', menu_toggle);
document.querySelector('.menu_close_btn').addEventListener('click', menu_toggle);
document.querySelector('.send_btn').addEventListener('click', send_msg);

if ('serviceWorker' in navigator) {
    console.log('CLIENT: service worker registration in progress.');
    navigator.serviceWorker.register('service-worker.js').then(function() {
      console.log('CLIENT: service worker registration complete.');
    }, function() {
      console.log('CLIENT: service worker registration failure.');
    });
  } else {
    console.log('CLIENT: service workers are not supported.');
}

// ADD TO HOME SCREEN STUFF BELOW:

// get ready for the "add to home screen" prompt
var deferredPrompt;

// this is an event that is fired by the browser when it's about to prompt for PWA install
window.addEventListener('beforeinstallprompt', function (e) {
    console.log("Boudda show an install prompt.");

  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  showAddToHomeScreen();

});

function showAddToHomeScreen() {

    var a2hsBtn = document.querySelector(".ad2hs-prompt");

    a2hsBtn.style.display = "block";

    a2hsBtn.addEventListener("click", addToHomeScreen);

}

// this is the function that is called when someone actually clicks the button
function addToHomeScreen() {
  var a2hsBtn = document.querySelector(".ad2hs-prompt");
  // hide our user interface that shows our A2HS button
  a2hsBtn.style.display = 'none';
  // Show the prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
    .then(function(choiceResult){

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }

      deferredPrompt = null;

    });
}
