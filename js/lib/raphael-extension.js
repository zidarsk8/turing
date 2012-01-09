Raphael.fn.curvedArrow = function(x1, y1, x2, y2, size, skew) {
	if (x1 == x2 && y1 == y2) y2++
	var len = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))
	var r = len*Math.max(skew,0.6)
	var sh = 0
	if (r < 25){
		sh = 1
		r = 25
	}

	var rotateArrow = 90 - Raphael.deg(Math.acos(len/2/r))
	var angle = Raphael.angle(x1, y1, x2, y2)
	var a45   = Raphael.rad(angle-45+rotateArrow)
	var a45m  = Raphael.rad(angle+45+rotateArrow)
	var x2a = x2 + Math.cos(a45) * size
	var y2a = y2 + Math.sin(a45) * size
	var x2b = x2 + Math.cos(a45m) * size
	var y2b = y2 + Math.sin(a45m) * size

	return this.path(
			"M"+x1+" "+y1+"A"+" "+r+" "+r+" 0 "+sh+" 1 " +x2+" "+y2+
			"M"+x2+" "+y2+"L"+x2a+" "+y2a+
			"M"+x2+" "+y2+"L"+x2b+" "+y2b
			)
}


Raphael.fn.arrow = function(x1, y1, x2, y2, size) {
	var angle = Raphael.angle(x1, y1, x2, y2)
	var a45 = Raphael.rad(angle-45)
	var a45m = Raphael.rad(angle+45)
	var x2a = x2 + Math.cos(a45) * size
	var y2a = y2 + Math.sin(a45) * size
	var x2b = x2 + Math.cos(a45m) * size
	var y2b = y2 + Math.sin(a45m) * size
	return this.path(
			"M"+x1+" "+y1+"L"+x2+" "+y2+
			"M"+x2+" "+y2+"L"+x2a+" "+y2a+
			"M"+x2+" "+y2+"L"+x2b+" "+y2b
			)
}
