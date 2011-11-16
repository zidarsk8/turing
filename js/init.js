$(document).ready(function() {

	$(".slider").slider({
		value:1,
		min: 1,
		max: 10,
		step: 1,
		slide: handle_slider
	});
	
	$("select").chosen();
	$( "#tabs" ).tabs();
});