window.addEventListener('message', function (event) {
    if(typeof chrome.app.isInstalled !== undefined && event !== null) { 
        let data = event.data;
        if (chrome && chrome.extension) {
            chrome.extension.sendMessage(data);
        }
    }
}, false);
  
  
let gameCanvas = document.querySelector("#layaCanvas");
if (gameCanvas) {

} else {
    console.log("no find laya game!");
}

  
  