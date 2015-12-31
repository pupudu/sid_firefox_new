/**
~~~~ToDo List LinkedIn~~~~
	*Everything

~~~~ToDo List FB~~~~
	* attaching styles - done
	* Add profile pic - done
	* Add analytics menu - done
	* Add icons to claims - done 
	* Add popup menus to claim icons - done 
	* Attach content scripts for every page update event
	* Reomve skip icons
	* Fix rating issue in about sections
	* save login session
	
~~~~Todo List Commons~~~~
	* Rate twice issue in b/e 
	* Replace not rated grey icon 
	* Get valid ssl certificate
	* premium accounts
*/

var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");

//For testing purposes only
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
    "16": "./icons/icon-16.png",
    "32": "./icons/icon-32.png",
    "64": "./icons/icon-64.png"
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


//replaced with pageMod
function runScript(tab) {
	
  //if(tab.url.search("https://web.facebook.com")!= -1){

    console.log("Hello Facebook*********");
	console.log(tab.url);

    //tab.attach({
		/*contentScriptFile: [
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
		}*//*,
		contentStyleFile: [self.data.url("css/fbInject.css"),self.data.url("css/dropdown.css")]*/
    //});
  //}
}


var pageMod = require("sdk/page-mod");

pageMod.PageMod({
	include: "*.facebook.com",
	contentStyleFile: [
		"./css/fbInject.css",
		"./css/dropdown.css",
		"./css/popUpStyles.css"
	],
	contentScriptFile: [
		self.data.url("js/configs.js"),
		self.data.url("js/jquery-1.11.3.min.js"),
		self.data.url("js/chart.min.js"),
		self.data.url("js/fbBrowserSpecifics.js"),
		self.data.url("js/fbInject.js"),
		self.data.url("js/notie.js")
	],
	contentScriptOptions: {
		claimPng: {"C" : self.data.url("icons/claimC.png"), "R" : self.data.url("icons/claimR.png"), "T" : self.data.url("icons/claimT.png") , "N" : self.data.url("icons/claimN.png")},
		ringPng: {"C" : self.data.url("icons/ringC.png"), "R" : self.data.url("icons/ringR.png"), "T" : self.data.url("icons/ringT.png") , "N" : self.data.url("icons/ringN.png")},
		profPng:{"C" : self.data.url("icons/profC.png"), "R" : self.data.url("icons/profR.png"), "T" : self.data.url("icons/profT.png") , "N" : self.data.url("icons/profN.png")},
		profLiPng:{"C" : self.data.url("icons/prof_li_C.png"), "R" : self.data.url("icons/prof_li_R.png"), "T" : self.data.url("icons/prof_li_T.png") , "N" : self.data.url("icons/prof_li_N.png")},
		popupBase:  self.data.url("icons/popupBase.png"),
		anaHeader:  self.data.url("images/analytics_header.png"),
		anaLegend:  self.data.url("images/legend.png"),
		notRatedInfo:  self.data.url("images/notRatedInfo.png"),
		
		sidChart:self.data.load("html/sidAnalytics.html"),
		ratePopup:self.data.load("html/ratePopup.html"),
		
		url: {
			"prof":{
				"C" : self.data.url("icons/profC.png"), "R" : self.data.url("icons/profR.png"), "T" : self.data.url("icons/profT.png") , "N" : self.data.url("icons/profN.png")
			},
			"claim":{
				"C" : self.data.url("icons/claimC.png"), "R" : self.data.url("icons/claimR.png"), "T" : self.data.url("icons/claimT.png") , "N" : self.data.url("icons/claimN.png"),
				"C_my" : self.data.url("icons/claimC_my.png"), "R_my" : self.data.url("icons/claimR_my.png"), "T_my" : self.data.url("icons/claimT_my.png") 
			},
			"ring":{
				"C" : self.data.url("icons/ringC.png"), "R" : self.data.url("icons/ringR.png"), "T" : self.data.url("icons/ringT.png") , "N" : self.data.url("icons/ringN.png")
			},
			"profLi":{
				"C" : self.data.url("icons/prof_li_C.png"), "R" : self.data.url("icons/prof_li_R.png"), "T" : self.data.url("icons/prof_li_T.png") , "N" : self.data.url("icons/prof_li_N.png")
			},
			"image":{
				"popupBase" : self.data.url("images/popupBase.png"), "analytics_header" : self.data.url("images/analytics_header.png"), "legend" : self.data.url("images/legend.png"), "notRatedInfo": self.data.url("images/notRatedInfo.png")
			}
		}
	}
});

  