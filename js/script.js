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
	Universal:{
		format: "###.00000000",
		locale: "us"
	},
	English : {
		format: "#,###.00",
		locale: "us"
	},
	German : {
		format: "#,###.00",
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
		if (vo[value] === undefined) {
			foundErrors = true;
			log("Fatial trapped exception: " + value + " was not provided to init()");
		}
	}
	if (foundErrors) {
		return 0;
	} else {
		return 1;
	}
}

function formatAmericanNumberToLanguage(sourceAmericanNumber, language) {
	var isoNum = $.parseNumber(String(sourceAmericanNumber), formats.English);
	return $.formatNumber(isoNum, formats[language]);
}

function convertNumberFormat(sourceNumber, sourceLanguage, destinationLanguage) {
	var isoNum = $.parseNumber(String(sourceNumber), formats[sourceLanguage]);
	return $.formatNumber(isoNum, formats[destinationLanguage]);
}


function init(vo) {


	log(vo);

	$('#yourProfitCurSymbol').html($("#symbol").val());
	$('#roomsNeededResult').html(vo.roomsNeeded);
	$('#subText').html(vo.copy.V_T_p1a + "<br/>" + vo.copy.V_T_p1b);
	$('#otaIncreRoomContPercent').html(vo.otaIncreRoomContPercent + '<span class="percent">%</span>');
	$('#otaRoomContPercentage').html(vo.otaRoomContPercentage + '<span class="percent">%</span>');

	//Rid thy self of items if negative profit

	if (vo.yourProfit < 0 || isNaN(vo.roomsNeeded)) {
		$("#rightBuildingBase, #miniBuildings, #r_forground, #roomsNeededCont, #heart").fadeOut();
	} else {
		$("#rightBuildingBase, #miniBuildings, #r_forground").fadeIn();
	}

	if (validateData(vo)) {

//		$("#yourProfitAmount").html(convertNumberFormat(vo.yourProfit, vo.language, $('#language').val()));

		_.delay(function() {
			var from2 = {properity:0};
			var to2 = {properity:vo.yourProfit};

			$(from2).animate(to2, {
				duration:1000,
				step: function() {
					$("#yourProfitAmount").html(convertNumberFormat(this.properity, vo.language, $('#language').val()));
				},
				complete:function() {
					$("#yourProfitAmount").html(convertNumberFormat(to2.properity, vo.language, $('#language').val()));
				}
			});
		}, 1500);

		$('#blueContent').stop().animate({
			bottom:'0'
		}, 1000);

		if (vo.yourProfit >= 0 && !isNaN(vo.roomsNeeded)) {
			$('#heart').stop().delay(2000).fadeIn(600);
		}
		$('#T_ota_total_cont, #T_ota_inc_rm_cont, #otaRoomContPercentage, #otaIncreRoomContPercent').stop().delay(2000).fadeIn('slow');

		$('#subText').stop().delay(2000).fadeIn(1000);


		$('#orangeContent').stop().delay(1500).animate({
			bottom:"-" + getHeightFromPercent(vo.rightBldgPercent, "Orange section") + "px"
		}, 1000);

		$('#d_roomsBase').stop().delay(300).animate({
			bottom:"-" + (getHeightFromPercent(vo.percentRooms, "Rooms only percentage bar") + 37) + "px" //The 37 is the height offset to account for the building peak
		}, 800);

		$('#e_packageBase').stop().delay(800).animate({
			bottom:"-" + (getHeightFromPercent(vo.percentPackage, "Package only percentage bar")) + "px"
		}, 600, function() {
//			log("Animated package only to -"+(getHeightFromPercent(vo.percentPackage, "Package only percentage bar")) + "px");
		});

		$('#f_opaque').stop().delay(1200).animate({
			bottom:"-" + getHeightFromPercent(vo.percentOpaque, "Opaque only percentage bar") + "px"
		}, 500);
		if (vo.yourProfit >= 0 && !isNaN(vo.roomsNeeded)) {
			$('#roomsNeededCont').stop().delay(1800).fadeIn(800);
		}
		var from = {properity:0};
		var to = {properity:vo.OTAProfitAmount};

		$(from).animate(to, {
			duration:1000,
			step: function() {
				$('#otaProfitAmount').html('<span class="currency" id="otaProfitCurSymbol">' + $("#symbol").val() + '</span>' + formatAmericanNumberToLanguage(this.properity, vo.language));
			},
			complete:function() {
				$('#otaProfitAmount').html('<span class="currency" id="otaProfitCurSymbol">' + $("#symbol").val() + '</span>' + formatAmericanNumberToLanguage(to.properity, vo.language));
			}
		});


	}
}

function truncateUniversalNum(i, n) { //Truncates to n decimals

	switch (n) {
		case 2:
			return Math.round(i * 100) / 100;
			break;
		case 1:
			return Math.round(i * 10) / 10;
			break;
		case 0:
			return Math.round(i);
	}


}

function getHeightFromPercent(percent, logNote) {
	var total = $("#buildingMasker").height();
	var pixels = ((percent / 100) * total);
	var result = total - pixels; //  //100% is 0 and 0% is the height of the element so we flip it


	//Trap if more than 100% was passed.  If so, someone messed up!
	if (result < 0) {
		log("Critical Application Error: " + logNote + " percentage passed to visualization exceeds 100%.  Capping value for display but this is a programatic issue.");
		result = 432;
	}
	if (result > 319) { //this number is the threshold for what is too small to show, decrease from height of mask
		log("Notice: " + logNote + " height too small to show.  Will animate to min allowed for display. Pixel count is only " + pixels);
		return 319; // lower is visually higher
	} else {
		return(result);
	}
}

function remove() {

	//Remove visualization

	$('#blueContent, #orangeContent, #d_roomsBase, #e_packageBase, #f_opaque').stop().animate({
		bottom:'-432px'
	}, 1500);

	$('#roomsNeededCont, #heart, #T_ota_total_cont, #T_ota_inc_rm_cont, #otaRoomContPercentage, #otaIncreRoomContPercent').stop().fadeOut(1500);


	$('#A').val("");
	$('#B').val("");
	$('#C').val("");
	$('#D').val("");
	$('#E').val("");
	$('#F').val("");
	$('#G').val("");
	$('#H').val("");
	$('#J').val("");
	$('#K').val("");
	$('#L').val("");
	$('#M').val("");
	$('#N').val("");
	$('#P').val("");
	$('#Q').val("");
	$('#R').val("");

	$('#CE').html("");
	$('#HG').html("");
	$('#U').html("");
	$('#LK').html("");
	$('#V').html("");
	$('#PN').html("");
	$('#W').html("");
	$('#S').html("");
	$('#T').html("");
	$('#TS').html("");
	$('#Z').html("");
	$('#b_').html("");
	$('#X').html("");
	$('#Y').html("");


	//Add code to clear fields

}

function calculate() {

	//Note var namnes match /comps/formulas.png

	//First, convert everythign to universal for math operations
	var A = convertNumberFormat($('#A').val(), $("#language").val(), "Universal");
	var B = convertNumberFormat($('#B').val(), $("#language").val(), "Universal");
	var C = convertNumberFormat($('#C').val(), $("#language").val(), "Universal");
	var D = convertNumberFormat($('#D').val(), $("#language").val(), "Universal");
	var E = convertNumberFormat($('#E').val(), $("#language").val(), "Universal");
	var F = convertNumberFormat($('#F').val(), $("#language").val(), "Universal");
	var G = convertNumberFormat($('#G').val(), $("#language").val(), "Universal");
	var H = convertNumberFormat($('#H').val(), $("#language").val(), "Universal");
	var J = convertNumberFormat($('#J').val(), $("#language").val(), "Universal");
	var K = convertNumberFormat($('#K').val(), $("#language").val(), "Universal");
	var L = convertNumberFormat($('#L').val(), $("#language").val(), "Universal");
	var M = convertNumberFormat($('#M').val(), $("#language").val(), "Universal");
	var N = convertNumberFormat($('#N').val(), $("#language").val(), "Universal");
	var P = convertNumberFormat($('#P').val(), $("#language").val(), "Universal");
	var Q = convertNumberFormat($('#Q').val(), $("#language").val(), "Universal");
	var R = convertNumberFormat($('#R').val(), $("#language").val(), "Universal");

	//Next, generate the calculated values
	var CE = C / E;
	var HG = H / G;
	var LK = L / K;
	var PN = P / N;
	var S = Number(G) + Number(K) + Number(N);
	var W = (N / S) * Q;
	var V = (K / S) * M;
	var U = (Number(G) / Number(S)) * Number(J);
	var T = Number(H) + Number(L) + Number(P);
	var TS = T / S;
	var Z = Number(U) + Number(V) + Number(W);
	var b_ = (Number(G) + Number(K) + Number(N)) * (R * 0.01);
	var X = (R * 0.01) * T;
	var Y = F * S;


	//Calculate the value object the visualization needs here. Copy still needs to be pulled from global JSON (which is created from the Excel language matrix)
	//Also need to truncate these to two decimal points.

	var vo = {
		language: $("#language").val(),
		copy: {
			V_L_ota_profit		: "OTA PROFIT",
			V_T_concerns		: "CONCERNS",
			V_T_p1a				: "THINK ABOUT WHOSE BUSINESS YOU'RE BUILDING...",
			V_T_p1b				: "How can you rebalance your business reliance on OTAs and improve your profitability?",
			T_ota_total_cont	: "OTA TOTAL ROOM CONTRIBUTION",
			T_ota_inc_rm_cont	: "OTA INCREMENTAL ROOM CONTRIBUTION",
			L_your_profit		: "YOUR PROFIT",
			T_rms_needed		: "ROOMS NEEDED ON DIRECT CHANNELS TO REPLACE PROFITS",
			T_rooms_only		: "Rooms Only",
			T_package			: "Package",
			T_opaque			: "Opaque"
		},
		OTAProfitAmount: truncateUniversalNum((Z * 0.01) * T, 2),
		percentPackage: ((((M * 0.01) * L) / ((Z * 0.01) * T)) * 100) + ((((Q * 0.01) * P) / ((Z * 0.01) * T)) * 100),
//		percentRooms: ((H*(J*0.01)) / ((Z*0.01)*T))*100,
		percentRooms: 100,
		percentOpaque: (((Q * 0.01) * P) / ((Z * 0.01) * T)) * 100,
		yourProfit: truncateUniversalNum(X - Y, 2),
		rightBldgPercent: ((X - Y) * 100) / ((Z * 0.01) * T),
		roomsNeeded: truncateUniversalNum((X - Y) / (D - F), 0),
		otaRoomContPercentage: truncateUniversalNum(S / (E * 0.01), 2),
		otaIncreRoomContPercent: truncateUniversalNum(b_ / (E * 0.01), 2)
	}


	//Finally, populate the fields with the correct formatting and launch visualizationz

	$('#CE').html(convertNumberFormat(CE, "English", $("#language").val()));
	$('#HG').html(convertNumberFormat(HG, "English", $("#language").val()));
	$('#U').html(convertNumberFormat(U, "English", $("#language").val()));
	$('#LK').html(convertNumberFormat(LK, "English", $("#language").val()));
	$('#V').html(convertNumberFormat(V, "English", $("#language").val()));
	$('#PN').html(convertNumberFormat(PN, "English", $("#language").val()));
	$('#W').html(convertNumberFormat(W, "English", $("#language").val()));
	$('#S').html(convertNumberFormat(S, "English", $("#language").val()));
	$('#T').html(convertNumberFormat(T, "English", $("#language").val()));
	$('#TS').html(convertNumberFormat(TS, "English", $("#language").val()));
	$('#Z').html(convertNumberFormat(Z, "English", $("#language").val()));
	$('#b_').html(convertNumberFormat(b_, "English", $("#language").val()));
	$('#X').html(convertNumberFormat(X, "English", $("#language").val()));
	$('#Y').html(convertNumberFormat(Y, "English", $("#language").val()));

	//Send the visualization object to init

	init(vo);

}

//This is used for development to prepopulate the form with English FPO data
function populateFPO() {
	$("#language").val("English");
	$("#symbol").val("$");
	$(".currency").html("$");
	$('#A').val(187);
	$('#B').val(64.2);
	$('#C').val("4,213,786");
	$('#D').val(105.32);
	$('#E').val("43,820");
	$('#F').val(16.23);
	$('#G').val("2,000");
	$('#H').val("170,000");
	$('#J').val(15);
	$('#K').val(300);
	$('#L').val("22,500");
	$('#M').val(25);
	$('#N').val(700);
	$('#P').val("45,500");
	$('#Q').val(35);
	$('#R').val(35);
}

//Sample object
/*var sample = {
 language: "English",
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
 };*/


//
//  Adapted from code found at http://jquery.malsup.com/fadetest.html.
//
//  This is only needed for IE 7 and earlier, so this is best added to your page using IE's conditional comments
//  (http://msdn.microsoft.com/en-us/library/ms537512%28VS.85%29.aspx) as follows:
//      <!--[if lt IE 8]><script type="text/javascript" src="jquery-ie-fade-fix.js"></script><![endif]-->
//
(function($) {
	$.fn.fadeIn = function(speed, callback) {
		return this.animate({opacity: 'show'}, speed, function() {
			if ($.browser.msie) {
				this.style.removeAttribute('filter');
			}
			if ($.isFunction(callback)) {
				callback.call(this);
			}
		});
	};

	$.fn.fadeOut = function(speed, callback) {
		return this.animate({opacity: 'hide'}, speed, function() {
			if ($.browser.msie) {
				this.style.removeAttribute('filter');
			}
			if ($.isFunction(callback)) {
				callback.call(this);
			}
		});
	};

	$.fn.fadeTo = function(speed, to, callback) {
		return this.animate({opacity: to}, speed, function() {
			if (to == 1 && $.browser.msie) {
				this.style.removeAttribute('filter');
			}
			if ($.isFunction(callback)) {
				callback.call(this);
			}
		});
	};
})(jQuery);


var allowedInputCharacterKeyCodes = Array(48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 100, 186, 222, 188, 190);

$(document).ready(function() {

	//Limits the types of characters to be accepted.

	$("input[id != hotelName]").keydown(function(event) {
		// Allow only backspace and delete
		if (event.keyCode == 46 || event.keyCode == 8) {
			// let it happen, don't do anything
		}
		else {
			// Ensure that it is a number and stop the keypress
			if ($.inArray(event.keyCode, allowedInputCharacterKeyCodes) == -1) {
				event.preventDefault();
			}
		}
	});


	populateFPO();
	//remove();

	$('#calculateBTN').bind('click', function(e) {
		calculate();
	});

	$('#symbol').bind('change', function(e) {
		$(".currency").html(
				$(e.currentTarget).val()
				);
	})

	$('#animateIn').bind('click', function() {
		populateFPO();
	});
	$('#clearBTN').bind('click', function() {
		remove();
	});
});