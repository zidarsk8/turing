turing = {
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
	SystemStates : [/* k-ti nivo stanj, stanja po k korakih*/  [{
		state: "", 
		allTapes: [ /*dimension*/ [ /*tape*/ [ /*track*/ [ /*znaki*/ ]]]], 
		dimension: 0,
		symbol: 0,
		parentState: {index: 0, delta: 0} /* stanje iz katerega smo prisli in delta prehod */
	}]],

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
			var dsa = check.dsa
			this.delta = []
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
	
	setInitialState : function(state, trackWord){
		
	},
	
	getPossibleDeltas : function(){
		//TODO: return all possible next delta functions
	},
	
	makeNextMove : function(){
		
	},
	
	checkDeltaSyntax : function(ds){
		var check = {ok:true, dsa:[] , okArr:[]}
		var moves = this.numDimensions == 2 ? "LRSUP" : "LRS"
		var cok = false
		var arr = ds.replace(/\n/g,"").split("<br>").slice(2)
		for (i in arr){
			if (arr[i].trim().length > 10 ){		
				var s = _.map(arr[i].replace(/<.*?>/g,"").split("-&gt;"),function(s){return s.trim().split(" ")})
				cok = s.length == 2 && s[0].length == 1+this.numTapes*this.numTracks && s[1].length == 1+this.numTapes*this.numTracks + this.numTapes
				cok &= _.reduce(_.map(s[0].slice(1), function(n){return n.length ==1}),function(a,b){return a && b})
				cok &= _.reduce(_.map(s[1].slice(1), function(n){return n.length ==1}),function(a,b){return a && b})
				cok &= _.reduce(_.map(s[1].slice(s[1].length-this.numTapes), function(n){return moves.indexOf(n) != -1 }),function(a,b){return a && b}) 
				check.ok &= cok
				check.okArr.push(cok)
				check.dsa.push(arr[i].replace(/<.*?>/g,""))
			}
		}
		check.ok &= cok
		return check
	}

}
