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
		//console.log(e) 
	})
	turing.addUpdateCallback(function(){
		graph.update()
	})
	
	$("#unlimitedTape").click(function(){
		turing.unlimitedTape = $(this).is(':checked')
		$("#turingCodeEditor").keyup()
	})
	$("#nondeterministic").click(function(){
		turing.nondeterministic = $(this).is(':checked')
		$("#turingCodeEditor").keyup()
	})

	$("#track_c").click(function(){
		graph.track = $(this).is(':checked')
	})

	$("#findCurState_b").click(function(){
		var t = graph.track
		graph.track = true
		graph.update()
		graph.track = t
	})
	
	$("#saveTm_b").click(function(){
		console.log(turing.rawDeltaString)
		console.log(JSON.stringify(turing))
	})
	
	$("#tmExamples").change(function(){
		$("#tmExamples option:selected").each(function(){
			$.extend(true,turing,examples[$(this).val()])
			$("#numTapes").slider("value",turing.numTapes)
			$("#numTracks").slider("value",turing.numTracks)
			$("#numDimensions").slider("value",turing.numDimensions)
			$("#turingCodeEditor").html(turing.rawDeltaString).keyup()
			//TODO: view all states or just one 
		})
	})

	$("#showAll_c").click(function(){
		turing.showLevel.state = $(this).is(':checked') ? "all" : -1
		$("#turingCodeEditor").keyup()
	})

	
});
