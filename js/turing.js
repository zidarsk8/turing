turing = {
	paddingSize: 2,
	numTapes : 1,
	numTracks : 1,
	numDimensions : 1,
	finalStates : [],
	initState : '',
	delta : [{
		fromState: '',
		fromSymbol: [ /*tape*/ [ /*track*/ ]],
		toState: '',
		toSymbol: [ /*tape*/ [ /*track*/ ]],
		move: []
	}],
	systemStates : [],

	addDelta : function(d){
		for (var i in this.delta) //check if identical delta exists
			if (_.isEqual(d,i))
				return false
		this.delta.push(d) //add delta function
	},
	
	
	 // deltaString = ['qx a b c d -> qy d e B c R S ',...] , numTapes = 2 numTracks = 2
	parseDeltaString : function(ds){
		var check = this.checkDeltaSyntax(ds)
		if (check.ok){
			this.delta = []
			this.initState = check.initState
			this.finalStates = check.finalStates
			for (var i in check.dsa){
				var d = {}
				var a = check.dsa[i].trim().split(' ')
				d.fromState = a[0]
				d.toState = check.dsa[i].split("-&gt;")[1].trim().split(' ')[0]
				d.move = a.splice(a.length - this.numTapes)
				var fs = a.slice(1,this.numTapes*this.numTracks+1)
				var ts = a.slice(a.length - this.numTapes*this.numTracks)
				d.fromSymbol = []
				d.toSymbol = []
				for (var i=0; i < this.numTapes; i++){
					d.fromSymbol.push(fs.splice(0,this.numTracks))
					d.toSymbol.push(ts.splice(0,this.numTracks))
				}
				this.addDelta(d)
			}
		}
		return check
	},
	
	setInitialState : function(trackWord){
		var tp = []
		for (var i=0; i<this.numTapes; i++) { tp.push(0)}
		var s = {
			state: this.initState, 
			tapes: [[[trackWord.split("")]]], 
			dimPos: _.clone(tp),
			tapePos: _.clone(tp),
			possibleDeltas: []
		}
		this.addRemoveBlanks(s);
		s.possibleDeltas = this.getDeltasFromState(s)
		this.systemStates = [[s]]
	},
	


	getDeltasFromState: function(s){
		//TODO: return all possible next delta functions
		var possible = []
		for (var d in this.delta){
			if (s.state == this.delta[d].fromState){
				var ok = true;
				for (var i=0; i<this.numTracks; i++){
					for (var j=0; j<this.numTracks; j++){
						if (s.tapes[s.dimPos[i]][i][j][s.tapePos[i]] != this.delta[d].fromSymbol[i][j]){
							ok = false
						}
					}
				}
				if (ok){
					possible.push(d*1)
				}
			}
		}
		return possible
	},
	
	getPossibleDeltas : function(){
		//TODO: return all possible next delta functions
	},
	
	makeNextMove : function(){
		var ss = this.systemStates
		var ssl = ss.length
		ss.push([])
		for (var i in ss[ssl-1]){
			for (var d in ss[ssl-1][i].possibleDeltas){
				var cc = _.clone(ss[ssl-1][i])
				for (var ti=0; ti < this.numTapes; ti++){
					for (var tj=0; tj < this.numTracks; tj++){
						cc[cc.dimPos[i]][ti][tj][cc.trackPos[ti]] = this.delta[d].toSymbol[ti][tj]
					}
					cc.trackPos[ti] = this.getNewPosition(cc.trackPos[ti],this.delta[d].move[tj])
				}

				ss[ssl].push(cc)
			}
		}
	},
	
	checkDeltaSyntax : function(ds){
		var check = {ok:true, dsa:[] , okArr:[]}
		var moves = this.numDimensions == 2 ? "LRSUP" : "LRS"
		var cok = false
		var arr = ds.replace(/\n/g,"").split("<br>")
		if (arr.length <3 || arr[0].indexOf("init: ")==-1 || 
				arr[1].indexOf("final: ")==-1 || 
				arr[1].trim().split(" ").length < 2 || 
				arr[0].trim().split(" ").length < 2){
			check.ok = false
			return check
		}else{
			check.initState = arr[0].trim().split(" ")[1]
			check.finalStates = arr[1].trim().split(" ").slice(1)
		}

		arr = arr.slice(2)
		for (var i in arr){
			if (arr[i].trim().length > 10 ){		
				var s = _.map(arr[i].replace(/<.*?>/g,"").split("-&gt;"),function(s){return s.trim().split(" ")})
				cok = s.length == 2 && s[0].length == 1+this.numTapes*this.numTracks && 
				s[1].length == 1+this.numTapes*this.numTracks + this.numTapes &&
				_.reduce(_.map(s[0].slice(1), function(n){return n.length ==1}),function(a,b){return a && b}) && 
				_.reduce(_.map(s[1].slice(1), function(n){return n.length ==1}),function(a,b){return a && b}) && 
				_.reduce(_.map(s[1].slice(s[1].length-this.numTapes), function(n){return moves.indexOf(n) != -1 }),function(a,b){return a && b}) 
				check.ok &= cok
				check.okArr.push(cok)
				check.dsa.push(arr[i].replace(/<.*?>/g,""))
				//console.log(check)
			}
		}
		check.ok &= cok
		return check
	},

	addRemoveBlanks : function(s){
		for (var d in s.tapes){
			for (var i=0 ; i< this.numTapes ; i++){
				if (typeof s.tapes[d][i] == "undefined" ){
					s.tapes[d].push([])
				}
				
				//appendamo Blanke na koncu 
				for (var j=0 ; j<this.numTracks ; j++){
					if (typeof s.tapes[d][i][j] == "undefined" ){
						s.tapes[d][i].push([])
					}
					while (s.tapes[d][i][j].length < s.tapePos[i]+this.paddingSize || 
							s.tapes[d][i][j][s.tapes[d][i][j].length-this.paddingSize] != "B"){
						s.tapes[d][i][j].push("B")
					}
				}
				
				//dodamo padding traku uspredaj
				while (s.tapePos[i] < this.paddingSize){
					for (var j=0 ; j<this.numTracks ; j++){
						s.tapes[d][i][j].unshift("B")
					}
					s.tapePos[i]++
				}
				//TODO: na s.tapes[d][i][j] je treba odstranit odvecne blank znake
				// tisto kar je vec kot padding da imamo pol B B B b e s e d a B B B 
			}
		}
	}
}
