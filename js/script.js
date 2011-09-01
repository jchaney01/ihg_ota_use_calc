// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
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


// place any jQuery/helper plugins in here, instead of separate, slower script files.


//To use: call init and pass value object matching 'defaults'.

$(document).ready(function() {

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
		//Check to see if all data is supplied and visualization has everything it needs.  Else, chuck an alert back at the sucker.
		return 1;
	}

	var defaults = {
		otaProfitLabelText: "OTA Profit",
		OTAProfitAmount: 48187,
		language: "German"
	};

	function formatAmericanNumberToLanguage(sourceAmericanNumber, language) {
		var isoNum = $.parseNumber(String(sourceAmericanNumber),formats.English);
		return $.formatNumber(isoNum, formats[language]);
	}

	$('#animateIn').bind('click', function() {
		init(defaults);
	});

	$('#animateOut').bind('click', function() {
		remove();
	});

	function init(vo) {
		log("Animating in");

		//$('#sum').val(vo.OTAProfitAmount);
		//$('#sum').priceFormat(lookupFormat(vo.language));

		$('#blueContent').stop().animate({
			bottom:'0'
		}, 1000);
		$('#d_roomsBase').stop().delay(300).animate({
			bottom:'0'
		}, 800);

		$('#e_packageBase').stop().delay(800).animate({
			bottom:'-100px'
		}, 600);

		$('#f_opaque').stop().delay(1200).animate({
			bottom:'-130px'
		}, 500);

		var from = {properity:0};
		var to = {properity:vo.OTAProfitAmount};

		$(from).animate(to, {
			duration:1000,
			step: function() {
				$('#otaProfitAmount').html(formatAmericanNumberToLanguage(this.properity, vo.language));
			},
			complete:function(){
				$('#otaProfitAmount').html(formatAmericanNumberToLanguage(to.properity, vo.language));
			}
		});
	}

	function remove() {
		log("Animating out");
		$('#blueContent').stop().animate({
			bottom:'-300px'

		}, 1500);
		$('#d_roomsBase').stop().animate({
			bottom:'-300px'
		}, 1500);
		$('#e_packageBase').stop().animate({
			bottom:'-300px'
		}, 1000);
		$('#f_opaque').stop().animate({
			bottom:'-300px'
		}, 500);
	}
});