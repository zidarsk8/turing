handle_slider = function(event, ui){
	turing[this.id] = ui.value;
	$("#"+this.id+"Label").html(ui.value+" "+this.id.substr(3,this.id.length-4+(ui.value>1)))
	turing[this.id] = ui.value;
	$("#turingCodeEditor").keyup()
};

