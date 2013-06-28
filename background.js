chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': chrome.extension.getURL('popup.html')}, function(tab) {
    });
});

/*

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('background.js received message.');
    console.log(request);
    if (request.action == "crowlLoaded"){
      if(request.forWhom == "GARTNER"){
      }else if(request.forWhom == "FORRESTER"){
      }else if(request.forWhom == "CUTTER"){
      }else if(request.forWhom == "BURTON"){
      }
    }else if (request.action == "crowlForGartnerLoaded"){
      sendResponse({links: ['4', '5', '6']});
    }else{
      sendResponse({links: 'Dont knwo'});

    }
  }
);


function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url.indexOf('gartner.com') > -1) {
    chrome.pageAction.show(tabId);
  }
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.webRequest.onCompleted.addListener(function(req) { 
    console.log('post was done!');
    console.log(req);
    if(req.method == 'POST'){
      //chrome.tabs.sendMessage({action: "loginSuccessful"});
    }
  },
  { urls: ["http://www.cutter.com/login"] },
  ["responseHeaders"]
);

*/

