var graph = {
	graph : new Raphael(document.getElementById('graph-canvas'), "100%", "500px"),
	update : function() {
		this.graph.clear()
		var states = turing.graphStates
		var deltas = turing.delta
		if (_.keys(states).length == 0) return
		
		console.log("should be drawing graph")
		
		for (var d in deltas){
			var sin = deltas[d].fromState
			var sout = deltas[d].toState
			var x1 = states[sin].x
			var y1 = states[sin].y
			var x2 = states[sout].x
			var y2 = states[sout].y
			var xy = this.shorten_line(x1,y1,x2,y2, 22)
			var x2s=xy[0], y2s=xy[1]

			//var minDistance = 30;
			//if (Math.abs(x1-x2) < minDistance  && Math.abs(y1-y2) < minDistance){
			//	console.log("naredi krogec")
			//}

			this.graph.arrow(states[sin].x, states[sin].y, x2s, y2s, 10).attr({"stroke-width":"2px"})
			
			
			var len = this.getLength(x1,y1,x2,y2)
			
			var tx = x2 - len/2
			var ty = y2 

			var r = this.rotatePoints(tx,ty,x2,y2, Raphael.rad(Raphael.angle(x2,y2,x1,y1)+30))
			tx = r.x
			ty = r.y
			
			var fromS =  _.reduce(_.flatten(deltas[d].fromSymbol),function(a,b){return a+" "+b} )
			var toS =  _.reduce(_.flatten(deltas[d].toSymbol),function(a,b){return a+" "+b} )
			var move =  _.reduce(_.flatten(deltas[d].move),function(a,b){return a+" "+b} )
			this.graph.text(tx,ty,fromS+" -> "+toS+","+move).
					attr({"font":"16px serif", "text-anchor":"middle","fill":"#001111"});
		}
		for (var i in states){
			this.graph.circle(states[i].x, states[i].y, 20).attr({"stroke-width":"2px","fill":"#fff"})
			this.graph.text(states[i].x,states[i].y,i).attr({"font":"16px serif", "text-anchor":"middle","fill":"#001111"});
		}
		
	},
	
	rotatePoints : function(px,py,ox,oy,theta){
		return {x: Math.cos(theta) * (px-ox) - Math.sin(theta) * (py-oy) + ox,
				y: Math.sin(theta) * (px-ox) + Math.cos(theta) * (py-oy) + oy}
	},

	getLength : function(x1,y1,x2,y2){
		var dx = x2-x1;
		var dy = y2-y1;
		return Math.sqrt(dx*dx + dy*dy);
	},

	shorten_line : function(x1,y1,x2,y2,d) {
		var r = this.rotatePoints(x1,y1,x2,y2,Raphael.rad(30))
		x1 = r.x
		y1 = r.y
		var dx = x2-x1;
		var dy = y2-y1;
		var length = this.getLength(x1,y1,x2,y2)
		if(length > 0) {
			dx /= length;
			dy /= length;
		}
		dx *= length - d;
		dy *= length - d;
		return [(x1 + dx), (y1 + dy)];
	}

}


Raphael.fn.arrow = function(x1, y1, x2, y2, size) {
	var rotateArrow = 37;
	var angle = Raphael.angle(x1, y1, x2, y2);
	var a45   = Raphael.rad(angle-45+rotateArrow);
	var a45m  = Raphael.rad(angle+45+rotateArrow);
	var x2a = x2 + Math.cos(a45) * size;
	var y2a = y2 + Math.sin(a45) * size;
	var x2b = x2 + Math.cos(a45m) * size;
	var y2b = y2 + Math.sin(a45m) * size;
	var r = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))*0.8;
	return this.path(
			"M"+x1+" "+y1+"A"+" "+r+" "+r+" -80 0 1 " +x2+" "+y2+
			"M"+x2+" "+y2+"L"+x2a+" "+y2a+
			"M"+x2+" "+y2+"L"+x2b+" "+y2b
			);
};

