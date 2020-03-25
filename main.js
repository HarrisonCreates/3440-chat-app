message_space = document.querySelector('.message_space');
let text_input = document.querySelector('.user_msg');
let notification_sound = new Audio('assets/sound.mp3');
let username = '';
let fullname = '';
let dropdown = document.querySelector('.dropdown');
let profile_pic = document.querySelector('.sidebar > .options > .profile_image');
let profile_image_uploader = document.querySelector('.profile_image_uploader');
let name_field = document.querySelector('.username_edit > .editable_name');

localStorage.status = "Online";

name_field.value = localStorage.username;

name_field.addEventListener('change', () => {
   localStorage.username = name_field.value;
});

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

// Checking if a user is logged in. If not, redirect to sign-in page
if(localStorage.username && localStorage.fullname){
  // Grabbing localstorage variables to use for our content
  username = localStorage.username;
  fullname = localStorage.fullname;
} else {
  window.location = "signin.html";
}

dropdown.addEventListener('change', () => {
  localStorage.status = dropdown.value;
});

profile_image_uploader.addEventListener("change", (e) => {
  var reader = new FileReader();
  reader.onload = function (e) {
    localStorage.setItem("profile_picture", e.target.result);
    profile_pic.style.backgroundImage = "url(" + e.target.result + ")";
  }
  reader.readAsDataURL(e.target.files[0]);
});

if(localStorage.getItem("profile_picture")){
   profile_pic.style.backgroundImage = "url(" + localStorage.getItem("profile_picture") + ")";
} else {
  profile_pic.style.backgroundImage = "url('assets/profile_default.svg')";
}

//var image = new Image();
//image.src = localStorage.getItem("profile_picture");
//document.body.appendChild(image);

// Slidebar functionality

menu_state = false;
let sidebar = document.querySelector('.sidebar');

function menu_toggle(){
   if(!menu_state){
     sidebar.style.left = "0vw";
     menu_state = true;
   } else {
     sidebar.style.left = "-100vw";
     menu_state = false;
   }
}

function display_message(e){
  let new_message_dom = document.createElement('div');
  if(e.sentBy == localStorage.username){
    new_message_dom.setAttribute('class', "you");
  } else {
    new_message_dom.setAttribute('class', "other");
  }

  let header_span = document.createElement('span');

  let name = document.createElement('h3');
  name.innerHTML = e.sentBy;

  let dash = document.createElement('h5');
  dash.innerHTML = "-";

  let timestamp = document.createElement('h5');
  timestamp.innerHTML = e.dateStamp;

  header_span.appendChild(name);
  header_span.appendChild(dash);
  header_span.appendChild(timestamp);

  let final_message = document.createElement('p');
  final_message.innerHTML = e.message;

  new_message_dom.appendChild(header_span);
  new_message_dom.appendChild(final_message);

  message_space.appendChild(new_message_dom);

  new_message_dom.scrollIntoView();
}

function send_msg(){
  let user_input = text_input.value;
  if(user_input.trim() != ''){
    let curr_date = new Date();
    let month = curr_date.getMonth() + 1;
    let date_str = month.toString() + "/" + curr_date.getDate().toString() + "/" + curr_date.getFullYear().toString();
    let new_message = {
      sentBy: localStorage.username,
      dateStamp: date_str,
      message: user_input
    }

    saveMessageToFirebase(new_message);

    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    notification_sound.play();

    text_input.value = "";
    text_input.focus();
  }
}

watchFirebaseForChanges(function(msg){display_message(msg.data())});

document.querySelector('.menu_open_btn').addEventListener('click', menu_toggle);
document.querySelector('.menu_close_btn').addEventListener('click', menu_toggle);
document.querySelector('.send_btn').addEventListener('click', send_msg);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(function() {
    }, function() {
    });
  } else {
}

var deferredPrompt;

window.addEventListener('beforeinstallprompt', function (e) {
  deferredPrompt = e;
  showAddToHomeScreen();
});

function showAddToHomeScreen() {
    var a2hsBtn = document.querySelector(".ad2hs-prompt");
    a2hsBtn.style.display = "block";
    a2hsBtn.addEventListener("click", addToHomeScreen);
}
function addToHomeScreen() {
  var a2hsBtn = document.querySelector(".ad2hs-prompt");
  a2hsBtn.style.display = 'none';
  deferredPrompt.prompt();
  deferredPrompt.userChoice
    .then(function(choiceResult){
      if (choiceResult.outcome === 'accepted') {
      } else {
      }
      deferredPrompt = null;
    });
}
