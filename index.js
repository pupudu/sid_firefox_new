var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");

tabs.open("https://sid.projects.mrt.ac.lk:9000");
tabs.open("https://www.facebook.com/pupudu");

require("sdk/tabs").on("ready", runScript);

var login_popup = require("sdk/panel").Panel({
	
	width:250,
	height:350,
	contentURL: self.data.url("popup.html"),
	contentScriptFile: [
		self.data.url("js/jquery-1.11.3.min.js"),
		self.data.url("js/bootstrap.min.js"),
		self.data.url("js/cookie.js"),
		self.data.url("js/auth.js")],
	contentStyleFile: self.data.url("css/popup.css"),
	contentScriptWhen:"ready"
});

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
  icon: {
    "16": "./resources/icons/icon-16.png",
    "32": "./resources/icons/icon-32.png",
    "64": "./resources/icons/icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  login_popup.show({
    position:{
      top:0,
      right: 0
    }
	
  });
}

function runScript(tab) {
	
  //if(tab.url.search("https://web.facebook.com")!= -1){

    console.log("Hello Facebook*********");
	console.log(tab.url);

    tab.attach({
		contentScriptFile: [
			self.data.url("js/configs.js"),
			self.data.url("js/jquery-1.11.3.min.js"),
			self.data.url("js/chart.min.js"),
			self.data.url("js/fbInject.js")
		],
		contentScriptOptions: {
			claimPng: [self.data.url("resources/icons/claimC.png"),self.data.url("resources/icons/claimR.png"),self.data.url("resources/icons/claimT.png")],
			profPng:[self.data.url("resources/icons/profC.png"),self.data.url("resources/icons/profR.png"),self.data.url("resources/icons/profT.png")],
			sidChart:self.data.load("html/sidAnalytics.html"),
			sidChart1:self.data.url("html/sidAnalytics.html"),
			ratePopup:self.data.load("html/ratePopup.html")
		}/*,
		contentStyleFile: [self.data.url("css/fbInject.css"),self.data.url("css/dropdown.css")]*/
    });
  //}
}


var pageMod = require("sdk/page-mod");

pageMod.PageMod({
  include: "*.facebook.com",
  contentStyleFile: ["./css/fbInject.css","./css/dropdown.css"]
});

  