var  graph; // probably doing it wrong...

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
	
	
	
	
	
	
	
	/*$("#num-states").keyup(add_state);
    
	$('#add_instruction').click(add_instruction);
	
	//$("select").chosen();
    $("#alphabet").blur(update_alphabet);
	$("#final_states").chosen().change(update_states_table);
	$("#tabs").tabs();
	
	turing_states = [];
	update_states_table();
    update_alphabet();
    $("#num-states").keyup();//update_state
    
    // simulation init
    $("#sim-button-step").click(turing_tristep);
    update_tape($("#sim-input").val())

    $("#sim-button-start").click(function(e) {
        if(e.target.value == "Start") {
            e.target.value = "Pause";
            update_tape($("#sim-input").val())
            turing_start()
        } else {
            //pause
            e.target.value = "Start"
            turing_pause()
        }
    });
    
    
    
    // graph init
    graph = new Raphael(document.getElementById('graph-canvas'), "100%", "500px");
    $("#graph-update").click(update_graph)
    $("#graph-update").click()
    /*$('#graphcanvas').click(function(e) {
        graph.circle(e.pageX - this.offsetLeft,
                          e.pageY - this.offsetTop,
                          20).attr({"fill":"#fff"});
    })/**/
    
});
