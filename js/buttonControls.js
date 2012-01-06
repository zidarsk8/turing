$(document).ready(function(){
	$('[id$="_b"]').click(function(e){
		//console.log(e)	
		//console.log(this.id)
	})

	$("#reset_b").click(function(){
		turing.setInitialState($("#tmInputWord").val())
	})
	$("#load_b").click(function(){
		turing.setInitialState($("#tmInputWord").val())
	})

	$("#prev_b").click(function(){
		turing.undoMove()
	})
	$("#next_b").click(function(){
		turing.makeNextMove()
	})

	$("#fontDec").click(function(){
		$("#turingCodeEditor").css("font-size",($("#turingCodeEditor").css("font-size").split("px")[0]*1-1)+"px");
	})
	$("#fontInc").click(function(){
		$("#turingCodeEditor").css("font-size",($("#turingCodeEditor").css("font-size").split("px")[0]*1+1)+"px");
	})

})
