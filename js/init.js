var  graph; // probably doing it wrong...

$(document).ready(function() {

    // navigation
    $('nav > a').click(function(a) {
        $('.visiblepane').removeClass('visiblepane');
        $('#'+this.id.substring(3)).addClass('visiblepane');
        $('.selectednav').removeClass('selectednav');
        $(this).addClass('selectednav');
    })

    // settings init
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
	$("#final_states").chosen();
	$( "#tabs" ).tabs();
	
	turing_states = [];
	update_states_table();
    
    //graphics init
    graph = new Raphael(document.getElementById('graphcanvas'), "100%", "500px");
    $('#graphcanvas').click(function(e) {
        graph.circle(e.pageX - this.offsetLeft,
                          e.pageY - this.offsetTop,
                          20).attr({"fill":"#fff"});
    })
    
});