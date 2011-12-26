$(document).ready(function(){
	$('[id$="_b"]').click(function(e){
		//console.log(e)	
		//console.log(this.id)
	})

	$("#load_b").click(function(){
		turing.setInitialState($("#tmInputWord").val())
	})

})
