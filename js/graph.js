update_graph = function() {
    graph.clear()
    var statecount = parseInt($("#num-states").val())
    var states = []
    for(var i=0; i<statecount; i++) {
        var state = new Object()
        state.index = i
        //spread states out (min max distance)
        state.x = (50+1050)/2
        state.y = (50+450)/2
        var bmin = 0;
        for(j=0; j<15; j++) {
            var sx = randomInt(50,1050)
            var sy = randomInt(50,450)
            
            var min=10000;
            for(s in states) {
                var d = Math.abs( sx-states[s].x )+Math.abs( sy-states[s].y );
                if(d < min) min = d;
            }
            if(min >= bmin) {
                bmin = min;
                state.x = sx;
                state.y = sy;
            }
        }

        states.push(state)
    }
    graph.arrow(states[0].x-45, states[0].y, states[0].x-20, states[0].y, 10).attr({"stroke-width":"2px"})
    
    for(var i=0; i<turing_states.length; i++) {
        var sin  = parseInt(turing_states[i].state_in),
            sout = parseInt(turing_states[i].state_out)
            
        var xy = shorten_line(states[sin].x,states[sin].y,states[sout].x,states[sout].y, 22)
        var x=xy[0], y=Math.floor(xy[1])

        graph.arrow(states[sin].x, states[sin].y, x, y, 10).attr({"stroke-width":"2px"})
        
        x = (x+states[sin].x)/2
        y = (y+states[sin].y)/2
        
        graph.text(x,y-15,"("+turing_states[i].input_trail+"->"+turing_states[i].input_trail+","+turing_states[i].tape_move+")").attr({"font":"16px serif", "text-anchor":"middle","fill":"#001111"});
        
    }
    for(var i=0; i<statecount; i++) {
        graph.circle(states[i].x, states[i].y, 20).attr({"stroke-width":"2px","fill":"#fff"});
        graph.text(states[i].x,states[i].y,"q"+i).attr({"font":"16px serif", "text-anchor":"middle","fill":"#001111"});
    }

}





Raphael.fn.arrow = function(x1, y1, x2, y2, size) {
  var angle = Raphael.angle(x1, y1, x2, y2);
  var a45   = Raphael.rad(angle-45);
  var a45m  = Raphael.rad(angle+45);
  var a135  = Raphael.rad(angle-135);
  var a135m = Raphael.rad(angle+135);
  var x1a = x1 + Math.cos(a135) * size;
  var y1a = y1 + Math.sin(a135) * size;
  var x1b = x1 + Math.cos(a135m) * size;
  var y1b = y1 + Math.sin(a135m) * size;
  var x2a = x2 + Math.cos(a45) * size;
  var y2a = y2 + Math.sin(a45) * size;
  var x2b = x2 + Math.cos(a45m) * size;
  var y2b = y2 + Math.sin(a45m) * size;
  return this.path(
   /* "M"+x1+" "+y1+"L"+x1a+" "+y1a+
    "M"+x1+" "+y1+"L"+x1b+" "+y1b+*/
    "M"+x1+" "+y1+"L"+x2+" "+y2+
    "M"+x2+" "+y2+"L"+x2a+" "+y2a+
    "M"+x2+" "+y2+"L"+x2b+" "+y2b
  );
};
shorten_line = function(x1,y1,x2,y2,r) {
    var dx = x2-x1;
    var dy = y2-y1;
    var length = Math.sqrt(dx*dx + dy*dy);
    if(length > 0) {
        dx /= length;
        dy /= length;
    }
    dx *= length - r;
    dy *= length - r;
    return [(x1 + dx), (y1 + dy)];
}
