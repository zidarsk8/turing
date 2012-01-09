var graph = {
	textStyle : {"font":"14px serif", "text-anchor":"middle","fill":"#001111"},
	panX : 100,
	panY : 100,
	sizeX : 700,
	sizeY : 600,
	trackStatePosX : 350,
	trackStatePosY : 300,
	track : false,
	graph : new Raphael(document.getElementById('graph-canvas'), "700px", "600px"),

	update : function() {
		if (_.keys(turing.graphStates).length == 0) return
		this.clear()
		this.moveToCurState(this.track)
		this.drawDeltas(turing.delta)
		this.drawStates(turing.graphStates)
		
		var level = turing.showLevel.level
		var state = turing.showLevel.state
		if (state != -1){
			var curDeltas = []
			var curStates = {}
			
			for (var ss in turing.systemStates[level]){
				curStates[turing.systemStates[level][ss].state] = turing.graphStates[turing.systemStates[level][ss].state]
				for (var d in turing.systemStates[level][ss].possibleDeltas){
					curDeltas.push(turing.delta[turing.systemStates[level][ss].possibleDeltas[d]])
				}
			}
			this.drawDeltas(curDeltas,"#aa0000")
			this.drawStates(curStates,"#ffcccc")

			for (var d in turing.systemStates[level][state].possibleDeltas){
				this.drawDeltas([turing.delta[turing.systemStates[level][state].possibleDeltas[d]]],"#ff0000")
			}
			curStates = {}
			curStates[turing.systemStates[level][state].state] = turing.graphStates[turing.systemStates[level][state].state]
			this.drawStates(curStates,"#ff7777")
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
				var a = {"stroke-width":"2px","fill":color,"stroke":"#000000"}
				if (states[i].fin)
					a = {"stroke-width":"4px","fill":color,"stroke":"#00aa00"}
				var context = {x:0,y:0,q:i,graph:this}
				this.graph.circle(states[i].x+this.panX, states[i].y+this.panY, 20).
					attr(a).
					drag(this.stateMove,this.startMove,this.endMove,context,context,context)
				this.graph.text(states[i].x+this.panX, states[i].y+this.panY ,i).
					attr(this.textStyle).
					drag(this.stateMove,this.startMove,this.endMove,context,context,context)
			}
		}
	},
	
	drawDeltas : function(deltas,color){
    selfConns = {};
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

				this.textStyle["text-anchor"] = "start"
				if ( (x1<x2 && y1<y2) || (x1>x2 && y1<y2) ) this.textStyle["text-anchor"] = "start"
				if ( (x1>x2 && y1>y2) || (x1<x2 && y1>y2) ) this.textStyle["text-anchor"] = "end"
				
				var fromS =  _.reduce(_.flatten(deltas[d].fromSymbol),function(a,b){return a+" "+b} )
				var toS =  _.reduce(_.flatten(deltas[d].toSymbol),function(a,b){return a+" "+b} )
				var move =  _.reduce(_.flatten(deltas[d].move),function(a,b){return a+" "+b} )
				
        var hash = deltas[d].fromState+deltas[d].toState;
        if(selfConns[hash]==undefined) {
          selfConns[hash] = 0;
        } else {
          selfConns[hash] +=1;
        }
        
        t.y += selfConns[hash]*20;
        
				this.graph.curvedArrow(x1+this.panX, y1+this.panY, xyShort[0]+this.panX, xyShort[1]+this.panY, 10, 0.9).
						attr({"stroke-width":"2px", "stroke":color})
				this.graph.text(t.x+this.panX ,t.y+this.panY ,fromS+" -> "+toS+","+move).
						attr(this.textStyle)
				//TODO: make pretty colors!attr({"font":"16px serif", "text-anchor":anchor,"stroke":color,"stroke-width":"1px","fill":"#001111"})
			}
		}
		this.textStyle["text-anchor"] = "middle"
	},

	rotatePoints : function(px,py,ox,oy,theta){
		return {x: Math.cos(theta) * (px-ox) - Math.sin(theta) * (py-oy) + ox,
				y: Math.sin(theta) * (px-ox) + Math.cos(theta) * (py-oy) + oy}
	},

	getLength : function(x1,y1,x2,y2){
		var dx = x2-x1
		var dy = y2-y1
		return Math.sqrt(dx*dx + dy*dy)
	},

	shorten_line : function(x1,y1,x2,y2,d) {
		var r = this.rotatePoints(x1,y1,x2,y2,Raphael.rad(30))
		x1 = r.x
		y1 = r.y
		var dx = x2-x1
		var dy = y2-y1
		var length = this.getLength(x1,y1,x2,y2)
		if(length > 0) {
			dx /= length
			dy /= length
		}
		dx *= length - d
		dy *= length - d
		return [(x1 + dx), (y1 + dy)]
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
	endPan : function(e){},
	
	clear : function(){
		this.graph.clear()
		this.graph.rect(0,0,this.sizeX,this.sizeY,10).
				attr({"fill":"#ddddff","stroke":"#dddff"}).
				drag(this.dragPan,this.startPan,this.endPan,this,this,this)
	}
}

