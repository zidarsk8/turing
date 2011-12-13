turing = {
	finalStates : [],
	initState : '',
	delta : [{
		fromState: '',
		fromSymbol: [ /*tape*/ [ /*track*/ ]],
		toState: '',
		toSymbol: [ /*tape*/ [ /*track*/ ]],
		move: [
	]},
	SystemStates : [/* k-ti nivo stanj, stanja po k korakih*/  [{
		state: "", 
		allTapes: [ /*dimension*/ [ /*tape*/ [ /*track*/ [ /*znaki*/ ]]]], 
		dimension: 0,
		symbol: 0,
		parentState: {index: 0, delta: 0} /* stanje iz katerega smo prisli in delta prehod */
	}]],

	addDelta : function(d){
		for (var i in this.deltas) //check if identical delta exists
			if (_.isEqual(d,i))
				return false
		this.delta.push(d) //add delta function
	},
	
	/**
	 * example:
	 * deltaString = ['qx a b c d -> qy d e B c R S ',...] , numTapes = 2 numTracks = 2
	 **/
	parseDeltaString : function(ds, numTapes, numTracks){
		this.delta = []
		for (var i in ds){
			var d = {}
			var a = ds[i].trim().split(' ')
			d.fromState = a[0]
			d.toState = ds[i].split('>')[1].trim().split(' ')[0]
			d.move = a.splice(a.length - numTapes)
			var fs = a.slice(1,numTapes*numTracks+1)
			var ts = a.slice(a.length - numTapes*numTracks)
			d.fromSymbol = []
			d.toSymbol = []
			for (var i=0; i < numTapes; i++){
				d.fromSymbol.push(fs.splice(0,numTracks))
				d.toSymbol.push(ts.splice(0,numTracks))
			}
			this.addDelta(d)
		}
	},
	
	getPossibleDeltas : function(){
		//TODO: return all possible next delta functions
	},
	
	makeNextMove : function(){
		
	}
	
}
