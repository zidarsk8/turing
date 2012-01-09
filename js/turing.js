var turing = {
	finished : false,
	accepted : false,
	rawDeltaString : "",
	showLevel : {level: -1, state: -1},
	callbacks : [],
	paddingSize: 2,
	numTapes : 1,
	numTracks : 1,
	numDimensions : 1,
	finalStates : [],
	initState : '',
	delta : [{
		fromState : '',
		fromSymbol : [ /*tape*/ [ /*track*/ ]],
		toState : '',
		toSymbol : [ /*tape*/ [ /*track*/ ]],
		move : []
	}],
	systemStates : [],
	graphStates : {},
	nondeterministic : false,
	unlimitedTape : false,
	
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
			this.finished = false
			this.accepted = false
			this.rawDeltaString = ds
			this.showLevel = {level: -1, state:  -1 }
			this.systemStates = [],
			//this.graphStates = {},
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
			this.onUpdate()
		}
		return check
	},
	
	setInitialState : function(trackWord){
		var tp = []
		for (var i=0; i<this.numTapes; i++) { tp.push([0,0])}
		var s = {
			state: this.initState, 
			tapes: [[[trackWord.split("")]]], 
			pos: tp,
			from: 0,
			possibleDeltas: []
		}
		this.addRemoveBlanks(s)
		s.possibleDeltas = this.getDeltasFromState(s)
		this.systemStates = [[s]]
		this.showLevel = {level:0, state: 0 }
		this.onUpdate()
	},
	


	getDeltasFromState: function(s){
		var possible = []
		for (var d in this.delta){
			if (s.state == this.delta[d].fromState){
				//console.log("preverjanje state:",s.state, this.delta[d].fromState)
				var ok = true;
				for (var i=0; i<this.numTapes; i++){
					for (var j=0; j<this.numTracks; j++){
						//console.log("preverjanje sym:",s.tapes[s.pos[i][0]][i][j][s.pos[i][1]] , this.delta[d].fromSymbol[i][j])
						if (s.tapes[s.pos[i][0]][i][j][s.pos[i][1]] != this.delta[d].fromSymbol[i][j]){
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
	
	undoMove : function(){
		this.showLevel.level--
		this.onUpdate()
	},

	makeNextMove : function(){		
		var ss = this.systemStates
		var ssl = ss.length
		
		if (!this.finished && this.showLevel.level + 2 > ssl){
			ss.push([])
			for (var i in ss[ssl-1]){
				for (var d in ss[ssl-1][i].possibleDeltas){
					var dd = ss[ssl-1][i].possibleDeltas[d]
					var cc = {} 
					//console.log("using delta",dd,this.delta[dd])
					$.extend(true,cc,ss[ssl-1][i])
					for (var ti=0; ti < this.numTapes; ti++){
						for (var tj=0; tj < this.numTracks; tj++){
							cc.tapes[cc.pos[ti][0]][ti][tj][cc.pos[ti][1]] = this.delta[dd].toSymbol[ti][tj]
						}
					}
					cc.pos = this.getNewPosition(cc.pos,this.delta[dd].move)
					this.addRemoveBlanks(cc)
					cc.state = _.clone(this.delta[dd].toState)
					cc.possibleDeltas = this.getDeltasFromState(cc)
					cc.from = i*1
					ss[ssl].push(cc)
					if (_.contains(this.finalStates,cc.state)){
						this.finished = true
						this.accepted = false
					}
				}
			}
			if (_.last(ss).length == 0){
				this.finished = true
				this.accepted = false
				ss = _.initial(ss)
			}
		}
		this.showLevel.level += this.showLevel.level+1 < ss.length ? 1 : 0
		this.onUpdate()
	},

	getNewPosition : function(pos,move){
		//console.log("newpos",pos,move)
		for (var m in move){
			switch (move[m]){
				case "U": pos[m][0]++ ; break
				case "D": pos[m][0]-- ; break
				case "R": pos[m][1]++ ; break
				case "L": pos[m][1]-- ; break
			}
		}
		return pos
	},
	
	checkDeltaSyntax : function(ds){
		var check = {ok:true, dsa:[] , initState:"", finalStates:[], okArr:[]}
		var moves = this.numDimensions == 2 ? "LRSUP" : "LRS"
		var cok = false
		var arr = ds.replace(/\n/g,"").split("<br>")
		if (arr.length <3 ){
			return {
				ok : false,
				initState : "q0",
				finalStates : ["qf"],
				okArr : [true,true,false],
				dsa : [" "]
			}
		}
		arr[0] = arr[0].replace(/<.*?>/g,"").trim()
		if (arr[0].indexOf("init: ")==-1 || arr[0].split(" ")[1].length < 2){
			check.ok &= false
			check.okArr.push(false)
		}else{
			check.initState = arr[0].split(" ")[1]
			check.okArr.push(true)
		}
		arr[1] = arr[1].replace(/<.*?>/g,"").trim()
		if (arr[1].indexOf("final: ")==-1 || arr[1].split(" ")[1].length < 2){
			check.ok &= false
			check.okArr.push(false)
		}else{
			check.finalStates = arr[1].split(" ").slice(1)
			check.okArr.push(true)
		}

		arr = arr.slice(2)
		var fromDeltas = []
		for (var i in arr){
			if (arr[i].trim().length > 10 ){		
				var s = _.map(arr[i].replace(/<.*?>/g,"").split("-&gt;"),function(s){return s.trim().split(" ")})
				
				cok = s.length == 2 && s[0].length == 1+this.numTapes*this.numTracks && 
				s[1].length == 1+this.numTapes*this.numTracks + this.numTapes &&
				_.reduce(_.map(s[0].slice(1), function(n){return n.length ==1}),function(a,b){return a && b}) && 
				_.reduce(_.map(s[1].slice(1), function(n){return n.length ==1}),function(a,b){return a && b}) && 
				_.reduce(_.map(s[1].slice(s[1].length-this.numTapes), function(n){return moves.indexOf(n) != -1 }),function(a,b){return a && b}) 

				cok &= (this.nondeterministic || fromDeltas.indexOf(s[0]+"") == -1 )
				fromDeltas.push(s[0]+"")

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
					while (s.tapes[d][i][j].length < s.pos[i][1]+this.paddingSize || 
							s.tapes[d][i][j][s.tapes[d][i][j].length-this.paddingSize] != "B"){
						s.tapes[d][i][j].push("B")
					}
				}
				
				//dodamo padding traku uspredaj
				while (s.pos[i][1] < this.paddingSize){
					for (var j=0 ; j<this.numTracks ; j++){
						s.tapes[d][i][j].unshift("B")
					}
					s.pos[i][1]++
				}
				//TODO: na s.tapes[d][i][j] je treba odstranit odvecne blank znake
				// tisto kar je vec kot padding da imamo pol B B B b e s e d a B B B 
			}
		}
	},

	graphStatesFromDelta : function(){
		var spread = 170
		var inRow = 3
		var used = []
		var notUsed = _.keys(this.graphStates)
		//console.log("all",notUsed)
		for (d in this.delta){
			used.push(this.delta[d].fromState)
			used.push(this.delta[d].toState)
			notUsed = _.without(notUsed, this.delta[d].fromState)
			notUsed = _.without(notUsed, this.delta[d].toState)
		}
		//console.log("used",used)
		//console.log("remove",notUsed)
		for (var i in notUsed){
			delete(this.graphStates[notUsed[i]])
		}
		for (var d in used){
			if (typeof this.graphStates[used[d]]=="undefined"){
				var n = _.keys(this.graphStates).length
				this.graphStates[used[d]] = {
					x : 50 + (n%inRow) * spread,
					y : 50 + (n/inRow) * spread, //I could floor this :P
					init : used[d] == this.initState,
					fin : this.finalStates.indexOf(used[d]) != -1,
					color: "#aa0011",
					breakPoint: false
				}
			}
		}
	},
	
	addUpdateCallback : function(f){
		if (typeof f == "function"){
			this.callbacks.push(f)
		}
	},
	
	onUpdate : function(){
		this.graphStatesFromDelta()
		for (var i in this.callbacks){
			this.callbacks[i]()
		}
	}
}
