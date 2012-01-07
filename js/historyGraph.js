var historyGraph = {
	textStyle : {"font":"14px serif", "text-anchor":"middle","fill":"#001111"},
	panX : 150,
	panY : 20,
	sizeX : 750,
	sizeY : 600,
	r : 16,
	track : false,
	graph : new Raphael(document.getElementById('historyGraph-canvas'), "750px", "600px"),

	update : function() {
		var ss = turing.systemStates
		if (_.keys(ss).length == 0) return
		this.graph.clear()
		this.graph.rect(0,0,this.sizeX,this.sizeY,10).
				attr({"fill":"#ddddff"}).
				drag(this.dragPan,this.startPan,this.endPan,this,this,this)
		
		for (var i=1; i< ss.length; i++){
			for (var j=0 ; j< ss[i].length; j++){
				this.drawLine(ss[i][j].from,i-1,ss[i-1].length,j,i,ss[i].length)	
			}
		}
		for (var i=0; i< ss.length; i++){
			for (var j=0 ; j< ss[i].length; j++){
				this.drawState(ss[i][j],j,i,ss[i].length)
			}
		}
	},

	drawLine : function(x,y,l1,v,w,l2){
		x1 = x*40 - l1*20 + this.panX
		y1 = y*50 + this.panY
		x2 = v*40 - l2*20 + this.panX
		y2 = w*50 + this.panY
		this.graph.path("M"+x1+" "+y1+"L"+x2+" "+y2).
					attr({"stroke-width":"2px","fill":"#000000"})
	},

	moveToState : function(state){
		this.panX = this.trackStatePosX - state.x
		this.panY = this.trackStatePosY - state.y
	},
	
	drawState : function(state,x,y,num,color){
		x = x*40 - num*20
		y *= 50
		if (typeof color == "undefined") color = "#fff"
		if (x+this.panX>0 && x+this.panX<this.sizeX && y+this.panY>0 && y+this.panY < this.sizeY){
			this.graph.circle(x+this.panX, y+this.panY, this.r).
				attr({"stroke-width":"2px","fill":color})
			this.graph.text(x+this.panX, y+this.panY , state.state).
				attr(this.textStyle)
		}
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
	
	startPan : function(x,y){
		this.origPosX = this.panX
		this.origPosY = this.panY
	},
	dragPan : function(dx,dy,x,y){
		this.panX = this.origPosX + dx
		this.panY = this.origPosY + dy
	},
	endPan : function(e){
		this.update()
	}
}

