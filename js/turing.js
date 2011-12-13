turing = {

	finalStates = [],
	initState = '',

	delta : [{
		fromState: '',
		fromSymbol: [ /*trak*/ [ /*sled*/ ]],
		toState: '',
		toSymbol: [ /*trak*/ [ /*sled*/ ]],
		move: []
	}],
	
	//possible names for the next var	
	//m-configuration
	//the state formula
	//the complete configuration
	//instantaneous description
	//state of the system
	SystemStates : [{
		state: "", 
		tape: [ /*dimenzija*/ [ /*trak*/ [ /*sled*/ [ /*znaki*/ ]]]],
		dimenzija :0,
		znak :0
	}],

	addDelta : function(d){
		//check if identical delta exists
		for (var i in this.deltas)
			if (_.isEqual(d,i))
				return false
		
		//add delta function
		this.delta.push(d)
	},

	getPossibleDeltas : function(){
		
	}
	
}
