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
last_move=0;
turing_move = function() {
    //why do I put so much effort into randomness
    var move=0;
    switch (randomInt(3)) {
        case 0: move-=1; break;
        case 1: if(last_move==0) move = randomInt(1)-randomInt(1);
        case 2: move+=1; break;
    }
    if(tape_position==0) move = 1
    
    tape_position+=move;
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
