var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");

var login_popup = require("sdk/panel").Panel({
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
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
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
