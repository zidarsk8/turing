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
	
	$("#turingCodeEditor").keyup(function(){
		//console.log($(this).html().split("<br>"))
		turing.parseDeltaString($(this).html(),$("#numTapes").val(),$("#numTracks").val(),$("#numDimensions").val())
	})
	
	$("#turingCodeEditor").bind('paste', function(e){ 
		console.log(e) 
	})
	
	turing.addUpdateCallback(function(){
		graph.update()
	})
   
});
