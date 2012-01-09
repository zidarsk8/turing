$(document).ready(function(){
	$('[id$="_b"]').click(function(e){
		//console.log(e)	
		//console.log(this.id)
	})

	$("#reset_b").click(function(){
		turing.setInitialState($("#tmInputWord").val())
    clearInterval(interval)
	})
	$("#load_b").click(function(){
		if (turingCheck())
			turing.setInitialState($("#tmInputWord").val())
      clearInterval(interval)
	})

	$("#prev_b").click(function(){
		turing.undoMove()
    clearInterval(interval)
	})
	$("#next_b").click(function(){
		turing.makeNextMove()
    clearInterval(interval)
	})
  
  
  //TODO do less hackerish
  var interval;
	$("#play_b").click(function(){
    clearInterval(interval)
    interval = setInterval(function(){
      turing.makeNextMove()
      $("#findCurState_b").click()
    },1000)		
	})
	$("#pause_b").click(function(){
    clearInterval(interval)
	})

	$("#fontDec").click(function(){
		$("#turingCodeEditor").css("line-height",($("#turingCodeEditor").css("line-height").split("px")[0]*1-1)+"px");
		$("#turingCodeEditor").css("font-size",($("#turingCodeEditor").css("font-size").split("px")[0]*1-1)+"px");
		resizeTmEditor()
	})
	$("#fontInc").click(function(){
		$("#turingCodeEditor").css("line-height",($("#turingCodeEditor").css("line-height").split("px")[0]*1+1)+"px");
		$("#turingCodeEditor").css("font-size",($("#turingCodeEditor").css("font-size").split("px")[0]*1+1)+"px");
		resizeTmEditor()
	})
	
	$("#turingCodeEditor").keyup(function(){
		resizeTmEditor()
	})

	function resizeTmEditor(){
		var tm = $("#turingCodeEditor")
		var size = (tm.css("line-height").split("px")[0]*1)
		var lines = tm.html().split("<br>").length
		tm.css("height",Math.floor(size*lines))
	}
	
	function turingCheck(){
		var tm = $("#turingCodeEditor")

		var check = turing.parseDeltaString(tm.html(),$("#numTapes").val(),$("#numTracks").val(),$("#numDimensions").val())
		var text = ""
		text += wrapRed("init: "+check.initState,check.okArr[0])
		text += wrapRed("final: "+(check.finalStates+"").replace(/,/g," "),check.okArr[1])
		for (var i=0 ; i< check.dsa.length ; i++){
			text += wrapRed(check.dsa[i],check.okArr[i+2])
		}
		tm.html(text)
		if (!check.ok){
			graph.clear()
		}
		return check.ok
	}

	function wrapRed(s,ok){
		return (ok ? s : "<span class=\"error\">"+s+"</span>") + "<br>"
	}
	
	$("#turingCodeEditor").bind('paste', function(e){ 
		//console.log(e) 
	})
	
	$("#unlimitedTape").click(function(){
		turing.unlimitedTape = $(this).is(':checked')
		$("#turingCodeEditor").keyup()
	})
	$("#nondeterministic").click(function(){
		turing.nondeterministic = $(this).is(':checked')
		$("#turingCodeEditor").keyup()
	})

	$("#track_c").click(function(){
		graph.track = $(this).is(':checked')
		historyGraph.track = $(this).is(':checked')
	})

  
  updateGraph = function() {
		var t = graph.track
		graph.track = true
		graph.update()
		graph.track = t
  }
  updateHistoryGraph = function() {
		historyGraph.moveToCur()
		historyGraph.update()
  }
	$("#findCurState_b").click(function(){
    updateGraph()
    updateHistoryGraph()
	})
	
	$("#saveTm_b").click(function(){
		var t = {}
		$.extend(true,t,turing)
		delete(t.callbacks)
		console.log(JSON.stringify(t))
	})
	
	$("#tmExamples").change(function(){
		$("#tmExamples option:selected").each(function(){
			$.extend(true,turing,examples[$(this).val()])
			$("#numTapes").slider("value",turing.numTapes)
			$("#numTapesLabel").html(turing.numTapes+" Tape"+(turing.numTapes > 1 ? "s" : ""))
			$("#numTracks").slider("value",turing.numTracks)
			$("#numTracksLabel").html(turing.numTracks+" Track"+(turing.numTracks> 1 ? "s" : ""))
			$("#numDimensions").slider("value",turing.numDimensions)
			$("#numDimensionsLabel").html(turing.numDimensions+" Dimension"+(turing.numDimensions> 1 ? "s" : ""))
			$("#turingCodeEditor").html(turing.rawDeltaString).keyup()
			$('#nondeterministic').attr('checked', turing.nondeterministic);
			$('#showAll_c').attr('checked', turing.showLevel.state == "all" );
			$("#load_b").click()
			//TODO: view all states or just one 
		})
	})

})
