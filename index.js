/**
~~~~ToDo List LinkedIn~~~~
	*Everything

~~~~ToDo List FB~~~~
	* attaching styles - done
	* Add profile pic - done
	* Add analytics menu - done
	* Add icons to claims - done 
	* Add popup menus to claim icons - done 
	* Attach content scripts for every page update event - done with timeouts
	* Reomve skip icons	-done
	* Fix rating issue in about sections - done
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
var pageMod = require("sdk/page-mod");

//For testing purposes only
tabs.open("https://sid.projects.mrt.ac.lk:9000");
tabs.open("https://www.facebook.com/pupudu");

function popupLogin(){
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

	login_popup.show({
		position:{
		  top:0,
		  right: 0
		}
	});
  
	login_popup.port.on("logout_popup", function handleMyMessage(myMessagePayload) {
		console.log("----------------On Message(Auth Success)----------------");
		require("sdk/tabs").on("ready", runScript);
		if (login_popup) {
		  login_popup.hide();
		}

		panel = require("sdk/panel").Panel({
		  contentURL: require("sdk/self").data.url("main.html"),
		  contentScriptFile: [self.data.url("js/jquery-1.11.3.min.js"), self.data.url("js/bootstrap.min.js"), self.data.url("js/cookie.js"), self.data.url("js/main.js")],
		  contentScriptWhen: "ready"
		});

		panel.show({
		  position: {
			top: 0,
			right: 0
		  }
		});

		panel.port.on("login_popup", function handleMyMessage(myMessagePayload) {
		  console.log("-------------LOGOUT BUTTON CLICKED-----------------");
		  if (panel) {
			panel.hide();
		  }
		  popupLogin();
		});
	});
}
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
  /*login_popup.show({
    position:{
      top:0,
      right: 0
    }
  });*/
  popupLogin();
}

function runScript(tab) {
	if (tab.url.search("https://www.facebook.com") != -1 || tab.url.search("https://web.facebook.com") != -1) {
		tab.attach({
			contentScriptFile: [
				self.data.url("js/cookie.js"),
				self.data.url("js/configs.js"),
				self.data.url("js/jquery-1.11.3.min.js"),
				self.data.url("js/chart.min.js"),
				self.data.url("js/hash.js"),
				self.data.url("js/fbBrowserSpecifics.js"),
				self.data.url("js/fbInject.js"),
				self.data.url("js/notie.js")
			],
			contentScriptOptions: {
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
	}
};
  
pageMod.PageMod({
	include: "*.facebook.com",
	contentStyleFile: [
		"./css/fbInject.css",
		"./css/dropdown.css",
		"./css/popUpStyles.css"
	]
});

