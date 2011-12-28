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

})
