
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});


// place any jQuery/helper plugins in here, instead of separate, slower script files.


//To use: call init and pass value object matching 'defaults'.

$(document).ready(function() {

	function validateData(vo){
		//Check to see if all data is supplied and visualization has everything it needs.  Else, chuck an alert back at the sucker.
		return 1;
	}

	var defaults = {
		otaProfitLabelText: "OTA Profit",
		currencySymbol: "$",
		OTAProfitAmount: 48187,
		language: "English"
	};

	function formatNumber(language){
		//Takes a number and returns it formatted based on the language
		return language;
	}

	$('#animateIn').bind('click', function(){
		init(defaults);
	});

	$('#animateOut').bind('click', function(){
		remove();
	});

	function init(vo){
		log("Animating in");
		$('#blueContent').stop().animate({
			bottom:'0'
		}, 1000);
	}

	function remove(){
		log("Animating out");
		$('#blueContent').stop().animate({
			bottom:'-300px'
		}, 1000);
	}
});