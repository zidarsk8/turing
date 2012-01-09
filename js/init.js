$(document).ready(function() {
	$("#accordionEx").accordionEx({ header: "h3" });
					
	//TODO: to ne dela
	//$('#tmExamples').selectmenu();
	
	handle_slider = function(e, ui){
		turing[this.id] = ui.value;
		$("#"+this.id+"Label").html(ui.value+" "+this.id.substr(3,this.id.length-4+(ui.value>1)))
		turing[this.id] = ui.value;
		$("#turingCodeEditor").keyup()
	};

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

	//TODO: to ne dela
	//$("#unlimitedTape").checkBox();

	turing.addUpdateCallback(function(){
		graph.update()
	})
	
	turing.addUpdateCallback(function(){
		historyGraph.update()
	})
	
	turing.addUpdateCallback(function(){
		showTracks.update()
	})
	
});
