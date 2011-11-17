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
			new_track.attr('id', '').attr('class', 'additional_tracks');
			new_track.find('#state_in,#state_out').parent().empty();
			new_track.find('#add_instruction').remove();
						
			for(var i=1; i < ui.value; i++){
				track.parent().append(new_track.clone());
			}
			$('.tape_move').empty().each(function(){
				var row = $(this).parent().parent().children().index($(this).parent());
				$(this).append('<select class="input" id="tape_move_'+row+'"><option>L</option><option>R</option><option>NONE</option></select>');

			});
			// We need to update the trails as well, we set ui.value to the number of trails:
			ui.value = $('#num_trails').slider( "value" );


		case('num_trails'):
			var trail_input = $('.input_trails');
			trail_input.empty().each(function(){
				var row = $(this).parent().parent().children().index($(this).parent());
				for(var i=0; i < ui.value; i++){					
					$(this).append('<select class="input" id="input_trail_'+row+'_'+i+'"><option>0</option><option>1</option></select>');
				}
			});
			var trail_output = $('.output_trails');
			trail_output.empty().each(function(){
				var row = $(this).parent().parent().children().index($(this).parent());
				for(var i=0; i < ui.value; i++){					
					$(this).append('<select class="input" id="output_trail_'+row+'_'+i+'"><option>0</option><option>1</option></select>');
				}
			});
			
			//chosen seems to be slow
			//$('.input').chosen();
			break;
			
	};
};

add_instruction = function(){
	var data = {};
	$('#add_instruction_table').find('select').each(function(){
		var id = $(this).attr('id');
		var split = id.split('_');
		if(split.length > 2){
			item = split[0]+ '_' +split[1];
			
			if(typeof(data[item]) == "undefined"){
				data[item] = [];
			}
			if(typeof(data[item][parseInt(split[2])]) == "undefined"){
				data[item][parseInt(split[2])] = [];
			}
			
			if(split.length == 3){
				data[item][parseInt(split[2])] = this.value;
			}
			else{
				data[item][parseInt(split[2])][parseInt(split[3])] = this.value;
			}
		}
		else{
			data[$(this).attr('id')] = this.value;
		}
	});
	turing_states.push(data);
};
