var showTracks = {

	extraX : 5,
	extraY : 3,


	theme : "trackTable",
	
	update : function() {
		if (!turing.systemStates[turing.showLevel.level]) return
		var ss=turing.systemStates[turing.showLevel.level][turing.showLevel.state]
		
		this.extraY = (turing.numDimensions == 1) ? 0 : 3 

		var str = ""
		for (var i = 0; i< ss.pos.length ; i++){
			var x = ss.pos[i][1]
			var y = ss.pos[i][0]
			var a = []
			for (var yy = -this.extraY ; yy < this.extraY+1 ; yy++){
				var b = []
				for (var xx = -this.extraX ; xx < this.extraX+1 ; xx++){
					var tracks = ""
					for (var t = 0; t< turing.numTracks; t++){
						tracks += ss.tapes[yy+y][i][t][xx+x]
					}
					b.push(tracks)
				}
				a.push(b)
			}
			str+=this.makeTable(a,this.extraY,this.extraX)+"<br>"
		}
		$("#showTracks").html(str)

	},


	makeTable : function(arr,y,x){
		var str = '<table class="'+this.theme+'">';
		for(var i = 0; i < arr.length ; i++){
			str+='<tr>';
			for (var j = 0; j < arr[i].length ; j++){
				var c = "ui-widget ui-widget-content ui-corner-all "
				if (x == j && y == i) c += ' selectedWindow '
				str+='<td class="'+c+'">'+arr[i][j]+'</td>';
			}
			str+='</tr>';
		}
		str+='</table>';
		return str;
	}
}

