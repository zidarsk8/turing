var tape = "", tape_position=0, turingTime;

turing_start = function() {
    //do stuff
    //sleep a little
    //repeat
    turingTime = window.setInterval(turing_step, 800);
}
turing_step = function() {
    tape_position = randomInt(tape.length);
    tape = tape.replaceAt(tape_position, randomInt(1).toString());
    update_tape();
}
turing_pause = function() {
    clearInterval(turingTime)
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
String.prototype.replaceAt=function(index, ch) {
      return this.substr(0, index) + ch + this.substr(index+ch.length);
}
function randomInt(min, max) {
    if(!max) return Math.floor(Math.random()*(min + 1))
    else return Math.floor(Math.random() * (max - min + 1)) + min;
}  
