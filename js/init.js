$(document).ready(function() {

	$(".slider").slider({
		value:1,
		min: 1,
		max: 10,
		step: 1,
		slide: handle_slider
	});
	
	$('#add_instruction').click(add_instruction);
	
	//$("select").chosen();
	$("#final_states").chosen();
	$( "#tabs" ).tabs();
	
	turing_states = [];
	update_states_table();
});