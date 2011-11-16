$(document).ready(function() {

	$( ".slider" ).slider({
		value:1,
		min: 1,
		max: 10,
		step: 1,
		slide: function( event, ui ) {
			console.log(ui.value + " " + ui.id);
		}
	});
	
	$("select").chosen();
	$( "#tabs" ).tabs();
});