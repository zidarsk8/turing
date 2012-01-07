$(document).ready(function() {
	
	$(".slider").slider({
		value:1,
		min: 1,
		max: 5,
		step: 1,
		slide: handle_slider,
	})
	
	$(".sliderDim").slider({
		value:1,
		min: 1,
		max: 2,
		step: 1,
		slide: handle_slider,
	})
	
	turing.addUpdateCallback(function(){
		graph.update()
	})
	
});
