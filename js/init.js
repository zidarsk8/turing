var  graph; // probably doing it wrong...

$(document).ready(function() {

    // random TODO
    //// save machine and view to cookies

    // navigation
    $('nav > a').click(function(a) {
        $('.visiblepane').removeClass('visiblepane');
        $('#'+this.id.substring(3)).addClass('visiblepane');
        $('.selectednav').removeClass('selectednav');
        $(this).addClass('selectednav');
    })
    $("#simulation").addClass("visiblepane")

    // machine settings init
	$(".slider").slider({
		value:1,
		min: 1,
		max: 10,
		step: 1,
		slide: handle_slider
	});
	$("#num-states").keyup(add_state);
    
	$('#add_instruction').click(add_instruction);
	
	//$("select").chosen();
	$("#final_states").chosen().change(update_states_table);
	$("#tabs").tabs();
	
	turing_states = [];
	update_states_table();
    
    // simulation init
    $("#sim-button").click(function(e) {
        if(e.target.value == "Start") {
            e.target.value = "Pause"

            var input = $("#sim-input").val()
            turing(turing_states, input)
        } else {
            //pause
            e.target.value = "Start"
        }
    });
    
    
    // graphics init
    graph = new Raphael(document.getElementById('graphcanvas'), "100%", "500px");
    $('#graphcanvas').click(function(e) {
        graph.circle(e.pageX - this.offsetLeft,
                          e.pageY - this.offsetTop,
                          20).attr({"fill":"#fff"});
    })
    
});