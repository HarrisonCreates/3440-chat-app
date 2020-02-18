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
