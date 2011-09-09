window.log = function() {
	log.history = log.history || [];   // store logs to an array for reference
	log.history.push(arguments);
	arguments.callee = arguments.callee.caller;
	if (this.console) console.log(Array.prototype.slice.call(arguments));
};
// make it safe to use console.log always
(function(b) {
	function c() {
	}

	for (var d = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a; a = d.pop();)b[a] = b[a] || c
})(window.console = window.console || {});

var formats = {
	English : {
		format: "$#,###",
		locale: "us"
	},
	German : {
		format: "&euro;#,###",
		locale: "de"
	}
};

function validateData(vo) {
	//Be advised, this is incomplete
	var requirements = new Array('language', 'OTAProfitAmount', 'copy', 'percentPackage');
	var len = requirements.length;
	var foundErrors = false;
	for (var i = 0; i < len; i++) {
		var value = requirements[i];
		if (vo[value] === undefined){
			foundErrors = true;
			log("Fatial trapped exception: "+value+" was not provided to init()");
		}
	}
	if (foundErrors){
		return 0;
	} else {
		return 1;
	}
}

function formatAmericanNumberToLanguage(sourceAmericanNumber, language) {
	var isoNum = $.parseNumber(String(sourceAmericanNumber), formats.English);
	return $.formatNumber(isoNum, formats[language]);
}


function init(vo) {

	if (validateData(vo)) {

		$('#blueContent').stop().animate({
			bottom:'0'
		}, 1000);

		$('#orangeContent').stop().delay(1500).animate({
			bottom:"-" + getHeightFromPercent(vo.rightBldgPercent) + "px"
		}, 1000);

		$('#d_roomsBase').stop().delay(300).animate({
			bottom:"-" + getHeightFromPercent(vo.percentRooms) + "px"
		}, 800);

		$('#e_packageBase').stop().delay(800).animate({
			bottom:"-" + getHeightFromPercent(vo.percentPackage) + "px"
		}, 600);

		$('#f_opaque').stop().delay(1200).animate({
			bottom:"-" + getHeightFromPercent(vo.percentOpaque) + "px"
		}, 500);

		$('#roomsNeededCont').stop().delay(1800).animate({
			opacity:'1'
		}, 800);

		var from = {properity:0};
		var to = {properity:vo.OTAProfitAmount};

		$(from).animate(to, {
			duration:1000,
			step: function() {
				$('#otaProfitAmount').html(formatAmericanNumberToLanguage(this.properity, vo.language));
			},
			complete:function() {
				$('#otaProfitAmount').html(formatAmericanNumberToLanguage(to.properity, vo.language));
			}
		});
	}
}

function getHeightFromPercent(percent) {
	var total = $("#buildingMasker").height();
	var pixels = ((percent / 100) * total);
	var result = total - pixels; //  //100% is 0 and 0% is the height of the element so we flip it

	//Trap if more than 100% was passed.  If so, someone messed up!
	if (result < 0) {
		log("Critical Application Error: Profit percentage passed to visualization exceeds 100%.  Capping value.");
		result = 0;
	}
	if (result > 230) { //this number is the threshold for what is too small to show, decrease from height of mask
		log("Notice: Profit height too small to show.  Will animate to min allowed for display.");
		return 230; // lower is visually higher
	} else {
		return(result);
	}
}

function remove() {
	$('#blueContent, #orangeContent, #d_roomsBase, #e_packageBase, #f_opaque').stop().animate({
		bottom:'-300px'
	}, 1500);

	$('#roomsNeededCont').stop().animate({
		opacity:0
	}, 1500);
}


//------------------------------------------------END OTA Visualization COde
//Sample object
var sample = {
	language: "German",
	copy: {
		V_L_ota_profit		: "OTA PROFIT",
		V_T_concerns		: "CONCERNS",
		V_T_p1a				: "Do these numbers look good to you?",
		V_T_p1b				: "Are you willing to live with this flow through rate?",
		V_T_p2a				: "What can you do differently?",
		V_T_p2b				: "Will you hit your targets given these profit numbers?",
		T_ota_total_cont	: "OTA TOTAL ROOM CONTRIBUTION",
		T_ota_inc_rm_cont	: "OTA INCREMENTAL ROOM CONTRIBUTION",
		L_your_profit		: "YOUR PROFIT",
		T_rms_needed		: "ROOMS NEEDED ON DIRECT CHANNELS TO REPLACE PROFITS",
		T_rooms_only		: "Rooms Only",
		T_package			: "Package",
		T_opaque			: "Opaque"
	},
	OTAProfitAmount: 48187,
	percentPackage: 60,
	percentRooms: 90,
	percentOpaque: 40,
	yourProfit: 34610,
	rightBldgPercent: 50,
	roomsNeeded: 388, //Included to keep all calculations in one place
	otaRoomContPercentage: 6.8,
	otaIncreRoomContPercent: 2.3
};

$(document).ready(function() {
	$('#animateIn').bind('click', function() {
		init(sample);
	});
	$('#animateOut').bind('click', function() {
		remove();
	});
});