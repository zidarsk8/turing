update_graph = function() {
    graph.clear()
    var statecount = parseInt($("#num-states").val())
    var states = []
    for(var i=0; i<statecount; i++) {
        var state = new Object()
        state.index = i
        state.x = randomInt(100,1000)
        state.y = randomInt(50,450)
        states.push(state)        
    }
    for(var i=0; i<turing_states.length; i++) {
        var sin  = parseInt(turing_states[i].state_in),
            sout = parseInt(turing_states[i].state_out)
            
        var xy = shorten_line(states[sin].x,states[sin].y,states[sout].x,states[sout].y)
        var x=Math.floor(xy[0]), y=Math.floor(xy[1])
        
        x=states[sout].x
        y=states[sout].y
        graph.path("M"+states[sin].x+" "+states[sin].y+
                   "L"+x+" "+y);//.attr({"arrow-end":"classic"})
    }
    for(var i=0; i<statecount; i++) {
        graph.circle(states[i].x, states[i].y, 20).attr({"fill":"#fff"});
        graph.text(states[i].x,states[i].y,"q"+i).attr({"font":"13px serif", "text-anchor":"middle","fill":"#001111"});
    }

}

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
