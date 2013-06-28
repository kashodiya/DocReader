//console.log('from crowl.js 1');

var pageFor = '';
var config = { login: '', password: ''};

if(document.location.href.indexOf('forrester.com') > -1){
  pageFor = 'FORRESTER';
}else if(document.location.href.indexOf('gartner.com') > -1){
  pageFor = 'GARTNER';
}else if(document.location.href.indexOf('cutter.com') > -1){
  pageFor = 'CUTTER';
}


function getDocsLinks(){
  var links = [];
  if(pageFor == 'GARTNER'){
    jQuery('div[id^="weeklyPicksCollapse"] a[href*="WEEKLY_PICKS"]').each(function(i, ele){
      console.log(ele.href);
      links.push({url: ele.href, title: jQuery(ele).text()});
    });
  }else if(pageFor == 'FORRESTER'){
    jQuery('.search_resultlist_custom h4 a').each(function(i, ele){
      console.log(ele.href);
      links.push({url: ele.href, title: jQuery(ele).text()});
    });
  }else if(pageFor == 'CUTTER'){
    jQuery('.hit-title a').each(function(i, ele){
      console.log(ele.href);
      links.push({url: ele.href, title: jQuery(ele).text()});
    });
  }
  return links;
}

chrome.runtime.sendMessage({
    action: "getConfig"
}, function(response) {
  //console.log(response);
  config = response.config;

  chrome.runtime.sendMessage({
      action: "crowlLoaded", 
      url: document.location.href,
      isLoggedIn: isLoggedIn(),
      pageFor: pageFor,
      docLinks: getDocsLinks() 
  }, function(response) {
    //console.log(response);
  });

});




function isLoggedIn(){
  if(pageFor == 'GARTNER'){
    if(jQuery('#tool_settings').length > 0){
      return true;
    }
  }else if(pageFor == 'FORRESTER'){
    if(jQuery('#pt-logoff-link').length > 0){
      return true;
    }
  }else if(pageFor == 'CUTTER'){
    //console.log('checking for logging in cutter');
    if(jQuery('#logout-anchor').is(":visible")){
      return true;
    }else{
      //console.log('logging in cutter');
      //console.log(config);
      jQuery('form[action="/login"] input[name=username]').val(config.login);
      jQuery('form[action="/login"] input[name=password]').val(config.password);
      jQuery('form[action="/login"]').submit();
      return false;
    }
  }
  return false;
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //console.log('message handler in crowl.js received message.');
    if (request.msgType == "isLoggedIn"){
      sendResponse({isLoggedIn: isLoggedIn()});
    }else{
      sendResponse({links: 'From crowl.js'});
    }
  }
);

