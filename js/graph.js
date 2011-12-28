var graph = {
	panX : 100,
	panY : 100,
	sizeX : 750,
	sizeY : 600,
	trackStatePosX : 300,
	trackStatePosY : 100,
	track : true,
	graph : new Raphael(document.getElementById('graph-canvas'), "100%", "650px"),
	update : function() {
		if (_.keys(turing.graphStates).length == 0) return
		this.graph.clear()
		this.graph.rect(0,0,this.sizeX,this.sizeY,10).
				attr({"fill":"#ddddff"}).
				drag(this.dragPan,this.startPan,this.endPan,this,this,this)
		this.moveToCurState(this.track)
		this.drawDeltas(turing.delta)
		this.drawStates(turing.graphStates)
		
		var level = turing.showLevel.level
		var state = turing.showLevel.state
		if (state != -1){
			var curDeltas = []
			var curStates = {}
			
			if (state == "all"){
				for (var ss in turing.systemStates[level]){
					curStates[turing.systemStates[level][ss].state] = turing.graphStates[turing.systemStates[level][ss].state]
					for (var d in turing.systemStates[level][ss].possibleDeltas){
						curDeltas.push(turing.delta[turing.systemStates[level][ss].possibleDeltas[d]])
					}
				}
			}else {
				curStates[turing.systemStates[level][state].state] = turing.graphStates[turing.systemStates[level][state].state]
				for (var d in turing.systemStates[level][state].possibleDeltas){
					curDeltas.push(turing.delta[turing.systemStates[level][state].possibleDeltas[d]])
				}
			}
			//console.log(curStates,curDeltas)
			this.drawDeltas(curDeltas,"#aa0000")
			this.drawStates(curStates,"#ffcccc")
		}
	},

	moveToCurState : function(track){
		//TODO: check if cur state and ending state in delta are both visible and correct so that in qx -> qy .. both are seen
		//could use a nice animation 2
		if (track && typeof turing.systemStates[turing.showLevel.level] != "undefined"){
			this.moveToState(turing.graphStates[turing.systemStates[turing.showLevel.level][turing.showLevel.state].state])
		}
	},

	moveToState : function(state){
		this.panX = this.trackStatePosX - state.x
		this.panY = this.trackStatePosY - state.y
	},
	
	drawStates : function(states,color){
		if (typeof color == "undefined") color = "#fff"
		for (var i in states){
			if (states[i].x+this.panX>0 && states[i].x+this.panX<this.sizeX && states[i].y+this.panY>0 && states[i].y+this.panY < this.sizeY){
				var context = {x:0,y:0,q:i,graph:this}
				this.graph.circle(states[i].x+this.panX, states[i].y+this.panY, 20).
					attr({"stroke-width":"2px","fill":color}).
					drag(this.stateMove,this.startMove,this.endMove,context,context,context)
				this.graph.text(states[i].x+this.panX, states[i].y+this.panY ,i).
					attr({"font":"16px serif", "text-anchor":"middle","fill":"#001111"}).
					drag(this.stateMove,this.startMove,this.endMove,context,context,context)
			}
		}
	},
	
	drawDeltas : function(deltas,color){
		if (typeof color == "undefined") color = "#000"
		for (var d in deltas){
			var x1 = turing.graphStates[deltas[d].fromState].x
			var y1 = turing.graphStates[deltas[d].fromState].y
			var x2 = turing.graphStates[deltas[d].toState].x
			var y2 = turing.graphStates[deltas[d].toState].y
			if (	(x1+this.panX>0 && x1+this.panX<this.sizeX && y1+this.panY>0 && y1+this.panY < this.sizeY)|| 
					(x2+this.panX>0 && x2+this.panX<this.sizeX && y2+this.panY>0 && y2+this.panY < this.sizeY)
				){
				var xyShort = this.shorten_line(x1,y1,x2,y2, 22)
				var len = this.getLength(x1,y1,x2,y2)
				var t = this.rotatePoints( x2 - len/2,y2 ,x2,y2, Raphael.rad(Raphael.angle(x2,y2,x1,y1)+25))
				if (x1 == x2 && y1==y2) t.x+=55
				
				var anchor = "start"
				if ( (x1<x2 && y1<y2) || (x1>x2 && y1<y2) ) anchor = "start"
				if ( (x1>x2 && y1>y2) || (x1<x2 && y1>y2) ) anchor = "end"
				
				var fromS =  _.reduce(_.flatten(deltas[d].fromSymbol),function(a,b){return a+" "+b} )
				var toS =  _.reduce(_.flatten(deltas[d].toSymbol),function(a,b){return a+" "+b} )
				var move =  _.reduce(_.flatten(deltas[d].move),function(a,b){return a+" "+b} )
				
				this.graph.arrow(x1+this.panX, y1+this.panY, xyShort[0]+this.panX, xyShort[1]+this.panY, 10, 0.9).
						attr({"stroke-width":"2px", "stroke":color})
				this.graph.text(t.x+this.panX ,t.y+this.panY ,fromS+" -> "+toS+","+move).
						attr({"font":"16px serif", "text-anchor":anchor,"fill":"#001111"});
				//TODO: make pretty colors!attr({"font":"16px serif", "text-anchor":anchor,"stroke":color,"stroke-width":"1px","fill":"#001111"});
			}
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
	},
	
	startMove : function(x,y){
		this.x = turing.graphStates[this.q].x
		this.y = turing.graphStates[this.q].y
	},
	stateMove : function(dx,dy,x,y){ 
		turing.graphStates[this.q].x = this.x + dx
		turing.graphStates[this.q].y = this.y + dy
		this.graph.update()
	},
	endMove : function(e){},

	startPan : function(x,y){
		this.origPosX = this.panX
		this.origPosY = this.panY
	},
	dragPan : function(dx,dy,x,y){
		this.panX = this.origPosX + dx
		this.panY = this.origPosY + dy
		this.update()
	},
	endPan : function(e){}
}


Raphael.fn.arrow = function(x1, y1, x2, y2, size, skew) {
	if (x1 == x2 && y1 == y2) y2++
	var len = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
	var r = len*Math.max(skew,0.6);
	var sh = 0
	if (r < 25){
		sh = 1
		r = 25
	}

	var rotateArrow = 90 - Raphael.deg(Math.acos(len/2/r));
	var angle = Raphael.angle(x1, y1, x2, y2);
	var a45   = Raphael.rad(angle-45+rotateArrow);
	var a45m  = Raphael.rad(angle+45+rotateArrow);
	var x2a = x2 + Math.cos(a45) * size;
	var y2a = y2 + Math.sin(a45) * size;
	var x2b = x2 + Math.cos(a45m) * size;
	var y2b = y2 + Math.sin(a45m) * size;

	return this.path(
			"M"+x1+" "+y1+"A"+" "+r+" "+r+" 0 "+sh+" 1 " +x2+" "+y2+
			"M"+x2+" "+y2+"L"+x2a+" "+y2a+
			"M"+x2+" "+y2+"L"+x2b+" "+y2b
			);
};

