turing = {

	finalStates = [],
	initState = '',

	delta : [{
		fromState: '',
		fromSymbol: [ /*tape*/ [ /*track*/ ]],
		toState: '',
		toSymbol: [ /*tape*/ [ /*track*/ ]],
		move: []
	}],
	
	//possible names for the next var	
	//m-configuration, the state formula, the complete configuration
	//instantaneous description, state of the system
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
	parseDeltaString : function(deltaString, numTapes, numTracks){
		for (var s in deltaString){
			d = {}
			a = s.trim().split(' ')
			d.fromState = a[0]
			d.toState = s.split(">")[1].trim().split(' ')[0]
			d.move = a.splice(a.length - numTapes)
			fs = a.slice(1,numTapes*numTracks+1)
			ts = a.slice(a.lenth - numTapes*numTracks)
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
