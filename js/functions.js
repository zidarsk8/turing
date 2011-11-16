handle_slider = function(event, ui){
	switch($($(ui.handle).parent()).attr('id')){
		case('num_states'):
			var states = $('#state_in, #state_out, #final_states'); 
			states.find('option').remove().end();
			for(var i=0; i < ui.value; i++){
				states.append('<option value="'+i+'">q'+i+'</option>');
			}
			states.trigger("liszt:updated");
			break;
	};
};