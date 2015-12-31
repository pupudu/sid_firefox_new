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

/*need separate implementation for firefox and chrome*/
function getURL(type,item){
	console.log(type+" "+item);
	return self.options.url[type.toString()][item.toString()];
}