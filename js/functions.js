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
			
		case('num_tapes'):
			var track = $('#track');
			track.siblings().remove();
			new_track = track.clone();
			new_track.find('#state_in,#state_out').parent().html('');
			new_track.find('#add_instruction').remove();
			console.log(new_track);
			
			for(var i=1; i < ui.value; i++){
				track.parent().append(new_track.clone());
			}
		
		break;
		case('num_trails'):
			var trail_input = $('#input_trails');
			trail_input.empty();

			for(var i=0; i < ui.value; i++){					
				trail_input.append('<select class="input" id="'+trail_input.attr('id')+'_'+i+'"><option>0</option><option>1</option></select>');
			}
			var trail_output = $('#output_trails');
			trail_output.empty();

			for(var i=0; i < ui.value; i++){					
				trail_output.append('<select class="input" id="'+trail_output.attr('id')+'_'+i+'"><option>0</option><option>1</option></select>');
			}

			$('.input').chosen();
			break;
			
	};
};