class SIGML{
	
	constructor(){
		var parser = new DOMParser();
		var serializer new XMLSerializer();
		var xmlString = "<sigml><hamgestural_sign><sign_manual></sign_manual></hamgestural_sign></sigml>";
		var xmlDoc = this.parser.parseFromString(xmlString, "text/xml");
		var sign_manual = this.xmlDoc.getElementsByTagName("sign_manual")[0];
	}

	setSymmetry(symmetry){
		// Define symmetry.
		switch(symmetry){
			case "lr":
				this.sign_manual.setAttribute("lr_symmetry","true");
				break;
			case "ud":
				this.sign_manual.setAttribute("ud_symmetry","true");
				break;
			case "oi":
				this.sign_manual.setAttribute("oi_symmetry","true");
				break;
		}
	}

	setPhasing(outofphase){
		if(outofphase) {
			this.sign_manual.setAttribute("outofphase","true");
		}
		else {
			this.sign_manual.removeAttribute("outofphase");
		}
	}

	singleHandConfig(data, extfidir, palmor){
		var parsed = parser.parseFromString(data);
		var handconfig = parsed.firstElementChild;
        handconfig.setAttribute("extfidir", extfidir);
        handconfig.setAttribute("palmor", palmor);
        this.sign_manual.appendChild(handconfig);
	}

	splitHandConfig(){
		return;
	}

	singleInitLocation(location, side, proximity){
		var location_bodyarm = this.xmlDoc.createElement("location_bodyarm")
		location_bodyarm.setAttribute("location", location);
		location_bodyarm.setAttribute("side", side);
		location_bodyarm.setAttribute("proximity", proximity);
		sign_manual.appendChild(location_bodyarm);
	}

	splitInitLocation(){
		return;
	}

	setHandConstellation(){
		return;
	}

	initSplitMotionSequence(rightMotionSequence, leftMotionSequence){
		// Look at seq counter box for right hand
		// Loop and call: addMotionSequenceRight
		// Look at seq counter box for left hand
		// Loop and call: addMotionSequenceLeft

		return;
	}

	initSingleMotionSequence(motionSequence){
		var motionTree = this.parser.parseFromString(motionSequence, "text/xml");
		var motionNode = motionTree.firstElementChild;
		sign_manual.appendChild(motionNode);
		return;
	}

}

function updateMotionSigml(hand, id){

}

// This function runs every time change is made in the form
function reload(){

	var sigml = new SIGML();

	// Check if twohanded...
	if (twoHanded){
		
		// Hand Config
		sigml.splitHandConfig();

		// Location
		if (splitInitLocation){
			sigml.splitInitLocation();
		}
		else {
			sigml.setHandConstellation();
		}

		// Motion
		if (symmetric){
			// var symmetry =
			sigml.setSymmetry(symmetry);
			// var phasing =
			sigml.setPhasing(outofphase);
		}
		else {
			var i, rightMotionSet = document.getElementsByName("rightseq");
			var rightMotionSequence = ""
			for (i = 0; i < rightMotionSet.length; i++) {
				rightMotionSequence += rightMotionSet[i];
			}
			var j, leftMotionSet = document.getElementsByName("leftseq");
			var leftMotionSequence = ""
			for (i = 0; i < leftMotionSet.length; i++) {
				leftMotionSequence += leftMotionSet[i];
			}
			sigml.initSplitMotionSequence(rightMotionSequence, leftMotionSequence);
		}

	}

	else {
		// Hand Configuration
		var handshape = document.getElementById('handshape');
        var handshapeData = handshape.options[handshape.selectedIndex].getAttribute('data');
        var extifidir = document.getElementById('extfidir').value;
        var palmor = document.getElementById('palmor').value;
		sigml.singleHandConfig(handshapeData, extfidir, palmor);
		// Location
		var bodypart = document.getElementById('bodypart').value;
        var side = document.getElementById('side').value;
        var proximity = document.getElementById('proximity').value;
		sigml.singleInitLocation(bodypart, side, proximity);
		// Motion
		var i, motionSet = document.getElementsByName("rightseq");
		var motionSequence = ""
		for (i = 0; i < motionSet.length; i++) {
			motionSequence += motionSet[i];
		}
		sigml.initSingleMotionSequence(motionSequence);
	}

	// WRITE SIGML TO TXT BOX

	// PRESS PLAY
}