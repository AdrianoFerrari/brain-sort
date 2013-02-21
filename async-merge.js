var AsyncComparator = function(list) {
	this.listsAtCurrentLevel = [];
	this.listsAtNextLevel = [];
	this.listMerged = [];
	for(var i=0; i<list.length; i++) {
		this.listsAtCurrentLevel[i] = [list[i]];
	}
};
 
AsyncComparator.prototype.getA = function() {
	return this.listsAtCurrentLevel[0][0];
};
 
AsyncComparator.prototype.getB = function() {
	return this.listsAtCurrentLevel[1][0];
};
 
AsyncComparator.prototype.compared = function(compareValue) {
	// Add current images to this.listMerged
	if(compareValue > 0) {
		this.listMerged.push(this.listsAtCurrentLevel[1].shift());
	} else {
		this.listMerged.push(this.listsAtCurrentLevel[0].shift());
	}
	
	if(!this.listsAtCurrentLevel[0].length || !this.listsAtCurrentLevel[1].length) {
		// We have merged the current A and B
		
		// Put merged list onto list of merged lists at next level
		this.listsAtNextLevel.push(this.listMerged.concat(this.listsAtCurrentLevel[0])
			.concat(this.listsAtCurrentLevel[1]));
		this.listsAtCurrentLevel.splice(0, 2);
		this.listMerged = [];
		
		// Check if we have should move to next level
		if(this.listsAtCurrentLevel.length < 2) {
			// If there is one list at the current merge level, move it to the next
			if(this.listsAtCurrentLevel.length) {
				this.listsAtNextLevel.push(this.listsAtCurrentLevel[0]);
			}
			
			// Move lists at next merge level to current level
			this.listsAtCurrentLevel = this.listsAtNextLevel;
			this.listsAtNextLevel = [];
		}
		
		// Check if we're done
		if(this.listsAtCurrentLevel.length == 1) return false;
	
		// Sort lists by list length
		// See http://www.cosc.canterbury.ac.nz/research/reports/TechReps/1997/tr_9701.pdf
		// Ideally we could do this more efficiently, but we don't really care about the
		// computational complexity here except with respect to the comparison call
		this.listsAtCurrentLevel.sort(function(a, b) { return a.length - b.length; });
	}
	
	return true;
};
 
AsyncComparator.prototype.getSorted = function() {
	if(this.listsAtCurrentLevel.length !== 1 || this.listsAtNextLevel.length !== 0) {
		throw "Not yet sorted";
	}
	return this.listsAtCurrentLevel[0];
};

/*====My Stuff====*/
var comparator;
var input;
var question1;
var output1;

 
function startSort() {
  input = document.getElementById("first");
  output1 = document.getElementById("output1");
  question1 = document.getElementById("question1").value;
  var arr = input.value.split("\n");
  
	comparator = new AsyncComparator(arr);
  setComparisonText(comparator.getA(),comparator.getB(),"Which is "+ question1 + "?");

  document.onkeydown = function(e) {
    if(e.keyCode == 37) {
      nextSort(0);
    } else if (e.keyCode == 39) {
      nextSort(1);
    }
  }
}

function nextSort(leftOrRight) {
  if(comparator.compared(leftOrRight)){
    setComparisonText(comparator.getA(),comparator.getB(),"Which is "+ question1 + "?");
  } else { finishSort(); }
}

function finishSort() {
	var sorted = comparator.getSorted();
  input.value = sorted.join("\n");
  setComparisonText("","","Sorted!");
  document.onkeydown = null;
}

function setComparisonText(l,r,c) {
  document.getElementById('left').innerHTML = l;
  document.getElementById('right').innerHTML = r;
  document.getElementById('question').innerHTML = c;
}
