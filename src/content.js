window.addEventListener('message', function (event) {
    let data = event.data;
    chrome.extension.sendMessage(data);
}, false);
  
  
let gameCanvas = document.querySelector("#layaCanvas");
if (gameCanvas) {

} else {
    console.log("no find laya game!");
}

  
  