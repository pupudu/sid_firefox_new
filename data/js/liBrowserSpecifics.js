var count = 0;
setInterval(function(){
	console.log(count++);
	startScript();
},6000);

/*need separate implementation for firefox and chrome*/
function getURL(type,item){
	return self.options.url[type.toString()][item.toString()];
}

/*need separate implementation for firefox and chrome*/
function addSidAnalyticsMenu(){
	setTimeout(function(){
		if(document.getElementById(fbstrings.sidDropdown) === null){
			processAnalyticsHTML(self.options.sidChart);
		}
	},1000);
}

/*needs a separate implementations for firefox and chrome*/
function popUpOnIconByID(popupData){ 

	var node = document.createElement("DIV");  
	
	popupData.classOffset = popupData.classOffset+"_d";
	if(popupData.claim.getElementsByClassName(popupData.iconClass+popupData.classOffset).length > 0){
		return;
	}
	
	node.innerHTML = self.options.ratePopup;
	node.className=popupData.iconClass+popupData.classOffset;
	document.getElementById(popupData.iconId).parentNode.appendChild(node);
	
	processRatepopup(node,popupData.myRating);
	configureListners(node,popupData);
}

function getMyId(){
	var email = self.options.email;
	//console.log(email);
	$.post(commonstrings.sidServer+"/rate/linkedin/getUrl",{email:email},function(data){
		var url = data.url;
		var id = getQueryVariable("id",url);
		myId = id;
	});
}