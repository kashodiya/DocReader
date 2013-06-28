var config = { login: '', password: ''};
openSites();

function openSites(){
  openTab('http://www.cutter.com');
  openTab('http://my.gartner.com');
  openTab('http://www.forrester.com/reg/dataexplorer.xhtml#/reports/latest');
}

function openTab(url){
  chrome.tabs.create({ url: url, active: false });
}

function doInCurrentTab(tabCallback) {
  chrome.tabs.query(
    { currentWindow: true, active: true },
    function (tabArray) { tabCallback(tabArray[0]); }
  );
}

function openDocs(links, sectionName){
  jQuery.each(links, function(i, ele){
    openInHiddenIFrame(ele, sectionName);
  });
}

jQuery(function(){
  restoreConfigValues();
  jQuery("#openConfig").click(function(){
    //console.log('Show');
    if(jQuery('#configSection').is(":visible")){
      jQuery('#configSection').hide();
    }else{
      jQuery('#configSection').show();
    }

    return false;
  });

  jQuery("#saveConfigBtn").click(function(){
    //console.log('Sss');
    localStorage["login"] = $("#login").val();
    localStorage["password"] = $("#password").val();
    config.login = $("#login").val();
    config.password = $("#password").val();
    jQuery('#configSection').hide();
  });
});

  
function restoreConfigValues(){
  $("#login").val(localStorage["login"]);
  $("#password").val(localStorage["password"]);
  config.login = localStorage["login"];
  config.password = localStorage["password"];
}


function openInHiddenIFrame(link, sectionName){
  //console.log('Loading url ... - ' + link.url);
  //console.log('Title ... - ' + link.title);
  jQuery('#' + sectionName + ' .progressMsg').html('Visiting docs...');

  var iFrames = jQuery('#iFrames')[0];
  //var iframe = document.body.appendChild(document.createElement('iframe'));
  var iframe = iFrames.appendChild(document.createElement('iframe'));
  iframe.style = "display: none;";
  iframe.src = link.url;


  $('#' + sectionName + ' .visitedDocList').append(
      $('<li>').append(
          $('<a>').attr('href', link.url).append(
              $('<span>').attr('class', 'tab').append(link.title)
  )));   


  iframe.onload = function() {
    //console.log('Title = ' + link.title);
    //console.log('Url is loaded - ' + link.url);
    jQuery('#' + sectionName + ' .visitedDocList li a[href="' + link.url + '"]').parent().addClass('bulletNotDone');
    var totalLinks = jQuery('#' + sectionName + ' .visitedDocList li').length;
    var doneLinks = jQuery('#' + sectionName + ' .visitedDocList li.bulletNotDone').length;
    jQuery('#' + sectionName + ' .progressCtr').html('[' + doneLinks + '/' + totalLinks + ']');
    if(totalLinks == doneLinks){
      jQuery('#' + sectionName + ' .progressMsg').html('Visited All. Done!');
      jQuery('#doneSound')[0].play();
    }else{
      jQuery('#doneAllSound')[0].play();
    }

    //console.log(iframe.contentDocument.title);
  };
}



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //console.log(request.action + ' - ' + request.pageFor + ' - LoggedIn? =' + request.isLoggedIn);
    //console.log(request);
    if (request.action == "crowlLoaded"){
      if(request.pageFor == 'GARTNER'){
        openDocs(request.docLinks, 'gartnerSection');
      }else if(request.pageFor == 'FORRESTER'){
        openDocs(request.docLinks, 'forresterSection');
      }else if(request.pageFor == 'CUTTER'){
        if(request.url == 'http://www.cutter.com/index.html'){
          chrome.tabs.query({
            url: request.url
          }, function(tabs){
            //console.log('found tabs for cutter');
            //console.log(tabs);
            chrome.tabs.update(tabs[0].id, {url: 'http://www.cutter.com/welcome.html'});
          });
        }else{
          openDocs(request.docLinks, 'cutterSection');
        }
        //chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});  
      }
    }else if (request.action == "getConfig"){
      sendResponse({config: config});
    }
  }
);



