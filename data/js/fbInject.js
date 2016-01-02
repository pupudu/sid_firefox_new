/* globals Chart,fbstrings,commonstrings,notie,fbSkipStrings,addSidAnalyticsMenu,fbNonSkipStrings,getURL,hex_md5,popUpOnIconByID: false */

//console.log();

var timeLineCName = document.getElementById(fbstrings.profileName);		//element to identify fb profile
var timeLineHLine = document.getElementById(fbstrings.fbTimelineHeadline);			//element to identify fb page

removeAds();
identify();	

function removeAds(){
	if(document.getElementsByClassName("ego_section").length>0){
		document.getElementsByClassName("ego_section")[0].remove();
	}
}

/**identify web page and take required actions*/
function identify(){
	console.log(".. Identifying Web Page");
	if(timeLineCName!==null && timeLineHLine!==null){
		var selectedTab = document.getElementsByClassName(fbstrings.selectedTab)[0].innerHTML;
		console.log(".. .. selected tab is: " + selectedTab);
		
		updateProfPic(false);
		addSidAnalyticsMenu();
		
		if(selectedTab.indexOf("About") === 0) {
			var subsection = document.getElementsByClassName(fbstrings.subSection)[0].innerHTML;
			if(subsection.indexOf("Work and Education") ===0 ){
				//manipulateAboutWork();		
				manipulateAbout(fbstrings.workClaim,"Work");
			}				
			else if(subsection.indexOf("Life Events") ===0 ){
				//manipulateLifeEvents();		
				manipulateAbout(fbstrings.lifeEventClaim,"Events");
			}
			else if(subsection.indexOf("Overview") ===0 ){
				//manipulateOverview();
				manipulateAbout(fbstrings.lifeEventClaim,"Overview");
			}
			
		}else if (selectedTab.indexOf("Timeline") === 0){
			console.log("selectedTab: "+ selectedTab);
			manipulateTimeLine();	
			updFrndsProfInTimeLine();
		}
	}else{
		console.log("timeline if condition false");
	}
}

/** Appends sid-rating state over fb profile picture*/
function updateProfPic(manual){
	if(document.getElementById(fbstrings.sidSign)!==null && !manual){
		if(document.getElementById(fbstrings.sidSign).src.length>10){
			console.log(".. .. Profile pic already updated");
			return;
		}
	}
	console.log(".. .. updating profile pic");
	var profPic = document.getElementsByClassName(fbstrings.photoContainer)[0];
	var icon = document.createElement("DIV");
	var imgURL;
	var profID = extractId(1);
	icon.innerHTML = "<img id ="+fbstrings.sidSign+" class = 'profIcon'>";
	profPic.appendChild(icon);
	
	$.post(commonstrings.sidServer+"/rate/facebook/getOverallProfileRating",
	{
		targetid: profID	
	},
	function(data){
		console.log(data);
		imgURL = getURL("prof",data.ratingLevel);
		if(document.getElementById(fbstrings.sidSign) !== null){
			document.getElementById(fbstrings.sidSign).src = imgURL;
		}
		$("#"+fbstrings.sidSign).fadeIn(2000);
	});
}

/** Appends sid-rating state over fb profile picture*/
function updFrndsProfInTimeLine(){
	/**updating friends profile pics*/
	var timelineRecent = document.getElementById(fbstrings.timelineRecent);
	var friendAr = timelineRecent.getElementsByClassName(fbstrings.friendProfiles);
	var altAr = document.getElementsByClassName("_3s6w");
	
	for(var i=0;i<friendAr.length;i++){
		var profID = extractFriendId(friendAr[i],altAr[i]);
		var friendStr = "friend"+i;
		var icon = document.createElement("DIV");
		
		if(document.getElementById(friendStr) === null){ 
			icon.innerHTML = "<img id='friend"+i+"' class = 'friendProfIcon' >";
			friendAr[i].parentNode.appendChild(icon);
			if(document.getElementById(friendStr) !== null){ 
				if(document.getElementById(friendStr).src === null ){ return; } 
			}
			addIconToFriendProf(profID,friendStr);
		}
	}
}

function addIconToFriendProf(profID, friendStr){
	try{
		$.post(commonstrings.sidServer+"/rate/facebook/getOverallProfileRating",
		{
			targetid: profID	
		},
		function(data){
			var imgURL = getURL("prof",data.ratingLevel);
			document.getElementById(friendStr).src = imgURL;
		});
	}catch(e){
		var imgURL = getURL("prof","N");
		document.getElementById(friendStr).src = imgURL;
	}
}

function manipulateAbout(claimType,style){
	var claimAr = document.getElementsByClassName(claimType);
	var claimCount = claimAr.length; //Number of claims on about page
	
	for(var i=0;i<claimCount;i++){
		var claim = claimAr[i];
		scoreClaims(i,claim,style); 
	}
}

function manipulateTimeLine(){
	var claimContainerAr = document.getElementsByClassName(fbstrings.timelineClaimContainer);
	var claimCount = claimContainerAr.length; //Number of claims on timeline
	
	/**Scoring claim summary*/
	for(var i=0;i<claimCount;i++){
		var claim = claimContainerAr[i].getElementsByClassName(fbstrings.timelineClaim)[0];
		scoreClaims(i,claim,"");
	}
}

function processAnalyticsHTML(data){
	console.log(".. .. .. adding sid analytics pop up menu");
	var node = document.createElement("DIV");  
	node.innerHTML = data;
	document.getElementsByClassName(fbstrings.fbMenubar)[0].appendChild(node);
	
	var profId = extractId(1);
	var headerURL = getURL("image","analytics_header");
	var legendURL = getURL("image","legend");
	
	document.getElementById("analytics_header").src = headerURL;
	document.getElementById("analytics_legend").src = legendURL;
	
	commitDropdownChart(profId,node);
	
	try{
		$.post(commonstrings.sidServer+"/test/getLinkedinURL",{
			uid : profId
		},
		function(data){
			document.getElementById("li_nav").href=data.url;
		});
	}catch(e){
		document.getElementById("li_nav").addEventListener('click',function(){
			notie.alert(3, 'Linked In profile not connected', 3);
		});
	}
}

function commitDropdownChart(profId,node){
	$.post(commonstrings.sidServer+"/rate/facebook/getAllRatingsCount",{
		targetid : profId
	},
	function(rating /*,status*/){
		//console.log(rating);
		var chartData = {};
		chartData.yesCount = rating.yes;
		chartData.noCount = rating.no;
		chartData.notSureCount = rating.notSure;
		
		var chartConfigs = {};
		chartConfigs.animation = true;
		chartConfigs.type = "drop";
		chartConfigs.base = "_9ry _p";
		
		addChartListener(chartData,chartConfigs,node);
	});
}

function scoreClaims(arrIndex, claim, classOffset){

	var targetId = extractId(1);
	var myId = extractId(0);
	var rateIcon = document.createElement("DIV");
	var iconId = 'claimR'+classOffset+arrIndex;
	var iconClass = 'claim';
	var claimScore = 'T';
	
	if(classOffset === "" || classOffset === "Overview"){
		if(clearIconsIfSkip(claim)){
			return;
		}
	}
	
	/*Avoid adding icons again if already added*/
	if(claim.getAttribute("data-html")===null){
		var html = claim.innerHTML.replace(/web./g,"www.");
		claim.setAttribute("data-html",html);
	}
	if(claim.getElementsByClassName(commonstrings.rateIconContainer).length === 0){
		rateIcon.className = "rateIconContainer "+ classOffset;
		rateIcon.innerHTML = "<img id = '" + iconId + "' class = '" + iconClass + classOffset + "' >";
		claim.appendChild(rateIcon);
	}
	if(claim.getElementsByClassName(commonstrings.rateIconContainer)[0].childElementCount>1){
		return;
	}
	
	var claimId = hex_md5(claim.getAttribute("data-html"));
	
	try{
	$.post(commonstrings.sidServer+"/rate/facebook/getRating",{
		targetid : targetId,
		claimid : claimId,
		myid : myId
	},
	function(data){
		
		claimScore = data.claimScore;
		var imgURL = getURL(iconClass,claimScore);
		var icon = document.getElementById(iconId);
		if(icon!==null){
			icon.src = imgURL;
			
			var popupData={};
			popupData.claim = claim;
			popupData.iconId = iconId;
			popupData.iconClass = iconClass;
			popupData.classOffset = classOffset;
			popupData.yes = data.yes;
			popupData.no = data.no;
			popupData.notSure = data.notSure;
			popupData.myRating = data.myrating;
			
			popUpOnIconByID(popupData);
		}
		else{
			console.log("info .. .. .. Icons already added");
		}
	});
	}catch(e){
		
		var imgURL = getURL(iconClass,"N");
		var icon = document.getElementById(iconId);
		if(icon!==null){
			icon.src = imgURL;
			
			var popupData={};
			popupData.claim = claim;
			popupData.iconId = iconId;
			popupData.iconClass = iconClass;
			popupData.classOffset = classOffset;
			popupData.yes = 1;
			popupData.no = 1;
			popupData.notSure = 1;
			popupData.myRating = -10;
			
			popUpOnIconByID(popupData);
		}
	}
}

function processRatepopup(node,myRating){
	var verified = node.getElementsByClassName(commonstrings.popVerifiedIcon);
	var neutral = node.getElementsByClassName(commonstrings.popNeutralIcon);
	var refuted = node.getElementsByClassName(commonstrings.popRefutedIcon);
	var popupBase = node.getElementsByClassName(commonstrings.popupbase);
	
	var R = "R";
	var C = "C";
	var T = "T";
	switch(myRating){
		case -1:
			R = R + "_my";
			break;
		case 0:
			C = C + "_my";
			break;
		case 1:
			T = T + "_my";
			break;
		case -10:
			//console.error("claim not rated by me");
			break;
		default:
			//console.error("Unexpected my rating value" + myRating);
			break;
	}
	
	var verImgUrl = getURL("claim",T);
	var neuImgUrl = getURL("claim",C);
	var refImgUrl = getURL("claim",R);
	var baseImgUrl = getURL("image","popupBase");
	
	verified[0].src = verImgUrl;
	neutral[0].src = neuImgUrl;
	refuted[0].src = refImgUrl;
	popupBase[0].src = baseImgUrl;
}

function configureListners(node,popupData){
	
	addEventToSendData(node,commonstrings.btnVerifiedIcon,popupData,1);
	addEventToSendData(node,commonstrings.btnRefutedIcon,popupData,-1);
	addEventToSendData(node,commonstrings.btnNeutralIcon,popupData,0);
	
	var chartData = {};
	chartData.yesCount = popupData.yes;
	chartData.noCount = popupData.no;
	chartData.notSureCount = popupData.notSure;
	
	var chartConfigs = {};
	chartConfigs.animation = false;
	chartConfigs.type = "mini";
	chartConfigs.base = "popupbase";
	
	addChartListener(chartData,chartConfigs,popupData.claim);
}

function addEventToSendData(node,menuItemName,popupData,rate){
	
	var claimId = hex_md5(popupData.claim.getAttribute("data-html"));
	var menuItem =  popupData.claim.getElementsByClassName(menuItemName)[0];
	var targetId = extractId(1);
	var myId = extractId(0);
	
	menuItem.addEventListener("click",function(){

		notie.alert(4, 'Adding rating to siD system', 2);
		var claimData = popupData.claim.getAttribute("data-html");
		$.post(commonstrings.sidServer+"/rate/facebook/addRating",{
			myid: myId,
			targetid: targetId,
			claimid: claimId,
			claim: claimData,
			rating: rate
		},
		function(data){
			
			if(data.success !== true){
				setTimeout(function(){
					notie.alert(3, 'An unexpected error occured! Please Try Again', 3);
					console.log("An unexpected error occured! Please Try Again");
				},1000);
			}else{
				setTimeout(function(){
					notie.alert(1, 'Rating added successfully!', 3);
					console.log("Rating added successfully");
					updateProfPic(true);
				},1000);
				$.post(commonstrings.sidServer+"/rate/facebook/getRating",{
					targetid : targetId,
					myid: myId,
					claimid : claimId
				},function(data){
					console.log(data);
					processRatepopup(node,data.myrating);
					var chartData = {};
					chartData.yesCount = data.yes;
					chartData.noCount = data.no;
					chartData.notSureCount = data.notSure;
					
					var chartConfigs = {};
					chartConfigs.animation = true;
					chartConfigs.type = "mini";
					chartConfigs.base = "popupbase";
					
					var imgURL = getURL(popupData.iconClass,data.claimScore);
					document.getElementById(popupData.iconId).src=imgURL;
					drawPieChart(chartData,chartConfigs,popupData.claim);
					addChartListener(chartData,chartConfigs,popupData.claim);
				});
				
				var dropdown = document.getElementsByClassName("sid_dropdown")[0];
				commitDropdownChart(targetId,dropdown);
			}
		});
	});
}

function clearIconsIfSkip(item){
	if(clearIconIfSkipUsingString(item)){return true;}
	if(clearEmptyIcons(item)){return true;}
	return false;
}

function clearIconIfSkipUsingString(item){
	
	var skipStringAr = fbSkipStrings;
	var nonSkipStringAr = fbNonSkipStrings;
	var text = item.textContent;
	if(text.length <= 2){
		text = item.outerHTML.toString();
	}
	for(var j=0;j<skipStringAr.length;j++){
		if(text.indexOf(skipStringAr[j])>=0){
			console.log(".. .. .. .. Will clear "+ item+ " due to "+ skipStringAr[j]);
			var skipClear = false;
			for(var k=0;k<nonSkipStringAr.length;k++){
				if(text.indexOf(nonSkipStringAr[k])>=0){
					console.log(".. .. .. .. will not clear" + item+ " due to "+ nonSkipStringAr[k]);
					skipClear = true;
					break;
				}
			}
			if(skipClear){
				continue;
			}
			return true;
		}
	}
	return false;
}

function clearEmptyIcons(item){
	if(item.parentNode.parentNode.firstChild.firstChild){
		if(item.parentNode.parentNode.firstChild.firstChild.nodeName === "BUTTON"){
			return true;
		}
	}
	return false;
}

/**Returns user id of viewer(0) or profile owner(1) as a string*/
function extractId(userType){
	if(userType === 0){
		return document.getElementsByClassName(fbstrings.myPicHeader)[0].id.substring(19);
	}else{
		var str;
		var profID;
		var strObj;
		try{
			str = document.getElementById(fbstrings.timelineMain).getAttribute("data-gt");
			strObj = JSON.parse(str);
			if(userType === 1){
				profID = strObj.profile_owner;
			}
		}catch(e){
			console.error(e);
			console.log(userType);
		}
		return profID;
	}
}

/**Returns user id of a person in timeline friendlist as a string*/
function extractFriendId(node,alt){
	var str;
	var profId;
	var strObj;
	try{
		str = node.parentNode.getAtrribute("data-hovercard");
		profId = getQueryVariable("id",str);
	}catch(e1){
		try{
			str = alt.firstChild.getAttribute("data-hovercard");
			profId = getQueryVariable("id",str);
		}catch(e3){
			try{
				str = node.parentNode.getAttribute("data-gt");
				strObj = JSON.parse(str);
				profId = strObj.engagement.eng_tid;
			}catch(e2){
				console.error(e1);
				console.error(e2);
				console.error(e3);
			}
		}
	}
	return profId;
}

/**Generate an Id given an string
function hashIds(str){
    var hash = 0;
    if (str.length <= 2){ 
		return hash;
	}
	str = str.trim();
    for (var i = 0; i < str.length; i++) {
        var character = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}*/

function addChartListener(chartData,chartConfigs,parent){
	var sidDropdown = parent.getElementsByClassName(chartConfigs.base)[0];
	console.log(chartConfigs.base+".............."+sidDropdown);
	sidDropdown.addEventListener('mouseover', function() {
		if(document.getElementsByClassName("ego_section").length>0){
			document.getElementsByClassName("ego_section")[0].remove();
		}
		drawPieChart(chartData,chartConfigs,parent);
	});
}

function drawPieChart(chartData,chartConfigs,parent){
	console.log("drawing chart" + chartData.yesCount);
	var verified =chartData.yesCount;
	var rejected =chartData.noCount;
	var uncertain=chartData.notSureCount;
	var total = verified + rejected + uncertain;
	
	var pieData = [
		{
			value: rejected,
			color:"#F7464A",
			highlight: "#FF5A5E",
			label: "Rejected"
		},
		{
			value: verified,
			color: "#46BF7D",
			highlight: "#5AD391",
			label: "Verified"
		},
		{
			value: uncertain,
			color: "#FDB45C",
			highlight: "#FFC870",
			label: "Uncertain"
		}
	];
	
	var chartHolder = parent.getElementsByClassName("chartHolder")[0];
	chartHolder.firstChild.remove();
	chartHolder.innerHTML = '<canvas class='+chartConfigs.type+'_chart'+'></canvas>';

	var ctx = parent.getElementsByClassName(chartConfigs.type+'_chart')[0].getContext("2d");
	if(total>0){
		try{
			var myPie;
			myPie = new Chart(ctx).Pie(pieData,{
				animation: chartConfigs.animation,
				animationEasing: "easeInOutQuart",
				segmentStrokeColor : "#ffffff"
				//add more chart configs here as needed
			});
		}catch(err){
			console.log(err);
		}
	}else{
		var imgUrl = getURL("image","notRatedInfo");
		var base_image = new Image();
		base_image.src = imgUrl;
		ctx.drawImage(base_image,0,0,300,150);
	}
}

function getQueryVariable(variable,string) {
    var qId = string.indexOf("?");
    var query = string.substring(qId+1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}