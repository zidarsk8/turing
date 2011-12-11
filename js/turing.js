var tape = "", tape_position=0, turingTime=0;

turing_start = function() {
    turingTime = window.setInterval(turing_step, 800);
}
turing_pause = function() {
    clearInterval(turingTime)
}

var turingTristep=0;
turing_tristep = function() {//for manual stepping
    //don't even try to imagine the possible time-related bugs herein :)
    clearInterval(turingTime)
    window.setTimeout(turing_step, 800);   
    window.setTimeout(turing_step, 800*2);   
    window.setTimeout(turing_step, 800*3);   
}
turing_step = function() {
    switch(turingTristep){
        case 0: turing_read(); break;
        case 1: turing_write(); break;
        case 2: turing_move(); break;
    }
    turingTristep = (turingTristep+1)%3
}

turing_read = function() {
    $("#sim-head-input").text(tape[tape_position])
    boldblink($("#sim-head-input"))    
    update_tape();
}
turing_write = function() {
    tape = tape.replaceAt(tape_position, randomInt(1).toString());
    update_tape();
}
turing_move = function() {
    var old_pos = tape_position
    
    //why do I put so much effort into randomness
    tape_position += randomInt(1);
    if(tape_position>3) tape_position -= randomInt(1);//don't hit wall :P
    if(tape_position<0) tape_position = 0
    
    //keeeeel meeeee
    var move = tape_position-old_pos;
    if(move==0) 
        $("#sim-head-move").text("-"); 
    else if(move>0) 
        $("#sim-head-move").text(">"); 
    else if(move<0) 
        $("#sim-head-move").text("<");

    boldblink($("#sim-head-move"))
    
    update_tape();
}



update_tape = function(val) {
    //set new tape value if any
    if(val) tape = val;
    
    //redraw
    $("#sim-tape").empty()
    for(var i = 0; i < tape.length; i++) {
        $("#sim-tape").append("<span class='sim-tape-loc"+ ((i==tape_position)?" sim-current":"") +"'>"+tape[i]+"</span>");
    }
}


// generic crap
boldblink = function(elt){
    elt.addClass("bold");
    window.setTimeout(function() { elt.removeClass('bold') }, 800);
}
String.prototype.replaceAt=function(index, ch) {
      return this.substr(0, index) + ch + this.substr(index+ch.length);
}
function randomInt(min, max) {
    if(!max) return Math.floor(Math.random()*(min + 1))
    else return Math.floor(Math.random() * (max - min + 1)) + min;
}  
