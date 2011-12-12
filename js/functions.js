handle_slider = function(event, ui){
	switch($($(ui.handle).parent()).attr('id')){
			
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
			
            //I don't think you have to generate options above anymore:
            update_alphabet()            
            
			//chosen seems to be slow
			//$('.input').chosen();
			break;
			
	};
};

update_alphabet = function() {
    var alpha = $("#alphabet").val().split(",");
    if($.inArray("B", alpha)==-1) alpha.push("B")

    var states = $('.input_trails, .output_trails'); 
    states.find('option').remove().end();
    var selects = states.children()
    for(var i=0; i < alpha.length; i++) {
        selects.append('<option value="'+alpha[i]+'">'+alpha[i]+'</option>');
    }
    states.trigger("liszt:updated");
}

add_state = function(){
	var value = parseInt(this.value);
	var states = $('#state_in, #state_out, #final_states'); 
	states.find('option').remove().end();
	for(var i=0; i < value; i++){
		states.append('<option value="'+i+'">q'+i+'</option>');
	}
	states.trigger("liszt:updated");
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
	
	update_states_table();
	update_encoded_output();
};

update_encoded_output = function(){
	var out = "111\n";

	for(var state in turing_states){

		for(var i=0; i <= parseInt(turing_states[state].state_in); i++){
			out += '0';
		}
		out += '1';
		for(var trail in turing_states[state].input_trail){
			for(var i=0; i<= parseInt(turing_states[state].input_trail[parseInt(trail)]); i++){
				out += '0';
			}
		}
		out += '1';
		for(var i=0; i<= parseInt(turing_states[state].state_out); i++){
			out += '0';
		}
		out += '1';
		for(var trail in turing_states[state].output_trail){
			for(var i=0; i<= parseInt(turing_states[state].output_trail[parseInt(trail)]); i++){
				out += '0';
			}
		}
		out += '1';
		for(var move in turing_states[state].tape_move){
			switch(turing_states[state].tape_move[move]){
				case("NONE"): out += '0';			
				case("L"): out += '0';
				case("D"): out += '0';
			}
		}
		out += "11\n";
	}
	out += "111";
	$('#encoded_output').val(out);
};

update_states_table = function(){
	hide_list_instruction_table();
	table = $('#list_instruction_body');
	table.children().remove();
	var rows = {};
	for(var state in turing_states){
		if(typeof(rows[state]) == "undefined"){
			table.append('<tr><td></td><td></td><td></td><td></td><td></td><td class="remove_instruction"><button>Remove</button></td></tr>');
			rows = table.find('tr');

			$(rows.find('.remove_instruction').last().children().first()).click(remove_state_row);
		}
		var i = 0;
		var tds = $(rows[state]).find('td');
		for(var element in turing_states[state]){

			if(typeof(turing_states[state][element]) == "string")
				$(tds[i++]).html(turing_states[state][element]);
			else{
				$(tds[i++]).html(turing_states[state][element].join("<br />"));
			}
		}


	}

};

hide_list_instruction_table = function(){
	var table = $('#list_instruction_table');
	if(turing_states.length == 0){
		table.hide();
		return;
	}	
	else{
		table.show();
	}
};

remove_state_row = function(){

		var row = $(this).parent().parent().parent().children().index($(this).parent().parent());
		turing_states.splice(row, 1);
		$($(this).parent().parent()).remove();
		hide_list_instruction_table();
		update_encoded_output();

};
