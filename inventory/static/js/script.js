var parser = new DOMParser();
var serializer = new XMLSerializer();
var xmlString = "<sigml><hamgestural_sign><sign_manual></sign_manual></hamgestural_sign></sigml>";
var xmlDoc = parser.parseFromString(xmlString, "text/xml");

// HANDSHAPE MODEL

function initsigml(){
    var sigmltxt = serializer.serializeToString(xmlDoc);
    document.getElementById('sigml').innerHTML = sigmltxt;
    console.log("SIGML init end");
    document.getElementById("animate").click();
}

function updatesign(){
    xmlDoc = parser.parseFromString(xmlString, "text/xml");
    var handconfig = xmlDoc.createElement("handconfig");
    var elements = xmlDoc.getElementsByTagName("sign_manual");
    elements[0].appendChild(handconfig);

    // Handshape
    var selectedHandshape = document.getElementsByName('selectedHandshape');
    for (var i=0; i<4; i++) {
        if(selectedHandshape[i].checked){
            handconfig.setAttribute("handshape", selectedHandshape[i].value);
        }
    }

    // Default Fingers
    var defaultFingers = document.getElementsByName('defaultFingers');
    var specialfingers = ""
    for (var i=0; i<4; i++) {
        if(defaultFingers[i].checked){
            specialfingers = specialfingers+(i+2);
        }
    }
    document.getElementsByName('specialfingers')[0].value = specialfingers;
    handconfig.setAttribute("specialfingers",specialfingers)

    // Thumb Position
    var selectedThumbpos = handshapeForm.elements["thumbpos"];
    if (selectedThumbpos.value == "None"){
        handconfig.removeAttribute("thumbpos");
    } else {
        handconfig.setAttribute("thumbpos", selectedThumbpos.value);
    }

    // Main Bend
    var selectedMainbend = handshapeForm.elements["mainbend"];
    if (selectedMainbend.value == "None"){
        handconfig.removeAttribute("mainbend");
    } else {
        handconfig.setAttribute("mainbend", selectedMainbend.value);
    }

    // Specific Bending
    var bend1_attr =
        document.getElementsByName('bend1_1')[0].value + " " +
        document.getElementsByName('bend1_2')[0].value + " " +
        document.getElementsByName('bend1_3')[0].value + " " +
        document.getElementsByName('bend1_4')[0].value + " " +
        document.getElementsByName('bend1_5')[0].value;
    var bend2_attr =
        document.getElementsByName('bend2_1')[0].value + " " +
        document.getElementsByName('bend2_2')[0].value + " " +
        document.getElementsByName('bend2_3')[0].value + " " +
        document.getElementsByName('bend2_4')[0].value;
    var bend3_attr =
        document.getElementsByName('bend3_1')[0].value + " " +
        document.getElementsByName('bend3_2')[0].value + " " +
        document.getElementsByName('bend3_3')[0].value + " " +
        document.getElementsByName('bend3_4')[0].value;
    var bend4_attr = 
        document.getElementsByName('bend4_1')[0].value + " " +
        document.getElementsByName('bend4_2')[0].value + " " +
        document.getElementsByName('bend4_3')[0].value + " " +
        document.getElementsByName('bend4_4')[0].value;
    var bend5_attr = 
        document.getElementsByName('bend5_1')[0].value + " " +
        document.getElementsByName('bend5_2')[0].value + " " +
        document.getElementsByName('bend5_3')[0].value + " " +
        document.getElementsByName('bend5_4')[0].value;


    if (bend1_attr == "0 0 0 0 0" || bend1_attr == "0.0 0.0 0.0 0.0 0.0") {
        handconfig.removeAttribute("bend1");
    } else {
        handconfig.setAttribute("bend1", bend1_attr);
    }
    if (bend2_attr == "0 0 0 0" || bend2_attr == "0.0 0.0 0.0 0.0") {
        handconfig.removeAttribute("bend2");
    } else {
        handconfig.setAttribute("bend2", bend2_attr);
    }
    if (bend3_attr == "0 0 0 0" || bend3_attr == "0.0 0.0 0.0 0.0") {
        handconfig.removeAttribute("bend3");
    } else {
        handconfig.setAttribute("bend3", bend3_attr);
    }
    if (bend4_attr == "0 0 0 0" || bend4_attr == "0.0 0.0 0.0 0.0") {
        handconfig.removeAttribute("bend4");
    } else {
        handconfig.setAttribute("bend4", bend4_attr);
    }
    if (bend5_attr == "0 0 0 0" || bend5_attr == "0.0 0.0 0.0 0.0") {
        handconfig.removeAttribute("bend5");
    } else {
        handconfig.setAttribute("bend5", bend5_attr);
    }
    handconfig.setAttribute("extfidir", "u");
    handconfig.setAttribute("palmor", "d");
    // Render animation
    initsigml();
}

function writesigml(sigml){
    document.getElementById('sigml').innerHTML = sigml;
    document.getElementById("animate").click();
}



// SIGN MODEL

class SIGML{
    
    constructor(){
        this.xmlString = "<sigml><hamgestural_sign><sign_manual></sign_manual></hamgestural_sign></sigml>";
        this.xmlDoc = parser.parseFromString(this.xmlString, "text/xml");
        this.sign_manual = this.xmlDoc.getElementsByTagName("sign_manual")[0];
    }

    setLeftHanded(value){
        if (value){
            this.sign_manual.setAttribute("nondominant","true");
        }
        else {
            this.sign_manual.removeAttribute("nondominant");
        }
    }

    setSymmetry(outofphase,symmetry){
        this.sign_manual.setAttribute("outofphase", outofphase);
        this.sign_manual.setAttribute(symmetry,"true");
    }

    setPhasing(outofphase){
        if(outofphase) {
            this.sign_manual.setAttribute("outofphase","true");
        }
        else {
            this.sign_manual.removeAttribute("outofphase");
        }
    }

    singleHandConfig(initial, data, extfidir, palmor){
        var parsed = parser.parseFromString(data, "text/xml");
        var handconfig = parsed.firstElementChild;
        handconfig.setAttribute("extfidir", extfidir);
        handconfig.setAttribute("palmor", palmor);
        if (initial){
            this.sign_manual.appendChild(handconfig);
        }
        return handconfig;
    }

    splitHandConfig(initial, data, extfidir, palmor, ldata, lextfidir, lpalmor){
        var split_handconfig = this.xmlDoc.createElement("split_handconfig");
        // Get Right Hand Configuration
        var parsed = parser.parseFromString(data, "text/xml");
        var handconfig = parsed.firstElementChild;
        handconfig.setAttribute("extfidir", extfidir);
        handconfig.setAttribute("palmor", palmor);
        split_handconfig.appendChild(handconfig);
        // Get Left Hand Configuration
        var lparsed = parser.parseFromString(ldata, "text/xml");
        var lhandconfig = lparsed.firstElementChild;
        lhandconfig.setAttribute("extfidir", lextfidir);
        lhandconfig.setAttribute("palmor", lpalmor);
        split_handconfig.appendChild(lhandconfig);
        if (initial){
            this.sign_manual.appendChild(split_handconfig);
        }
        return split_handconfig;
    }

    bodyArmLocation(initial, location, side, contact){
        var location_bodyarm = this.xmlDoc.createElement("location_bodyarm")
        location_bodyarm.setAttribute("location", location);
        location_bodyarm.setAttribute("side", side);
        location_bodyarm.setAttribute("contact", contact);
        if (initial){
            this.sign_manual.appendChild(location_bodyarm);
            return location_bodyarm;
        }
        return location_bodyarm;
    }

    fingerPartLocation(digits, location, side){
        var location_hand = this.xmlDoc.createElement("location_hand");
        location_hand.setAttribute("digits", digits);
        location_hand.setAttribute("location", location);
        location_hand.setAttribute("side", side);
        return location_hand;
    }

    handPartLocation(location, side){
        var location_hand = this.xmlDoc.createElement("location_hand");
        location_hand.setAttribute("location", location);
        location_hand.setAttribute("side", side);
        return location_hand;
    }

    splitLocation(initial, location, side, proximity, llocation, lside, lproximity){
        var split_location = this.xmlDoc.createElement("split_location");
        var right_location_bodyarm = this.bodyArmLocation(true, location, side, proximity);
        var left_location_bodyarm = this.bodyArmLocation(true, llocation, lside, lproximity);
        split_location.appendChild(right_location_bodyarm);
        split_location.appendChild(left_location_bodyarm);
        if (initial){
            this.sign_manual.appendChild(split_location);
        }
        return split_location;
    }

    setHandConstellation(initial, contact, location_hand_1, location_hand_2, location_bodyarm){
        var handconstellation = this.xmlDoc.createElement("handconstellation");
        handconstellation.setAttribute("contact", contact);
        handconstellation.appendChild(location_hand_1);
        handconstellation.appendChild(location_hand_2);
        if (location_bodyarm != null){
            handconstellation.appendChild(location_bodyarm);    
        }
        if (initial){
            this.sign_manual.appendChild(handconstellation);
        }
        return handconstellation;
    }

    directedMotionSequence(direction, curve, curve_size, zigzag_style, ellipse_direction, zigzag_size){
        var directedmotion = this.xmlDoc.createElement("directedmotion");
        directedmotion.setAttribute("direction", direction);
        directedmotion.setAttribute("curve", curve);
        directedmotion.setAttribute("curve_size", curve_size);
        directedmotion.setAttribute("zigzag_style", zigzag_style);
        directedmotion.setAttribute("ellipse_direction", ellipse_direction);
        directedmotion.setAttribute("zigzag_size", zigzag_size);
        return directedmotion;
    }

    circularMotionSequence(axis, circular_size, start){
        var circularmotion = this.xmlDoc.createElement("circularmotion");
        circularmotion.setAttribute("axis", axis);
        circularmotion.setAttribute("circular_size", circular_size);
        circularmotion.setAttribute("start", start);
        return circularmotion;
    }

    wristMotionSequence(motion, size){
        var wristmotion = this.xmlDoc.createElement("wristmotion");
        wristmotion.setAttribute("motion", motion);
        wristmotion.setAttribute("size", size);
        return wristmotion;
    }

    initSplitMotionSequence(rightMotionSequence, leftMotionSequence){
        var split_motion = this.xmlDoc.createElement("split_motion");
        split_motion.appendChild(rightMotionSequence);
        split_motion.appendChild(leftMotionSequence);
        this.sign_manual.appendChild(split_motion);
        return;
    }

    initSingleMotionSequence(initial, motionSequence){
        var motionTree = parser.parseFromString(motionSequence, "text/xml");
        var motionNode = motionTree.firstElementChild;
        if (initial){
            this.sign_manual.appendChild(motionNode);
        }    
        return motionNode;
    }

    write(){
        var sigmltxt = serializer.serializeToString(this.xmlDoc);
        document.getElementById('sigml').innerHTML = sigmltxt;
        document.getElementsByName('sigml')[0].value = sigmltxt;
        // Animate
        document.getElementById("loading").innerHTML = "JASigning Avatar"
        document.getElementById("animate").click();
    }
}

// This function runs every time change is made in the form
function reload(){

    var sigml = new SIGML();

    // Check if left handed
    if (document.getElementById('nondom').checked){
        sigml.setLeftHanded(true);
    }

    // Check if twohanded...
    var twoHanded = document.getElementById('twohanded').checked;
    if (twoHanded){
        
        if (document.getElementById('symmetric').checked){
            sigml.setSymmetry(document.getElementById('outofphase').checked, document.getElementById('symmetry').value);
        }

        // SPLIT HANDCONFIG
        // Right
        var handshape = document.getElementById('handshape');
        var data = handshape.options[handshape.selectedIndex].getAttribute('data');
        var extfidir = document.getElementById('extfidir').value;
        var palmor = document.getElementById('palmor').value;
        // Left
        var lhandshape = document.getElementById('l_handshape');
        var ldata = lhandshape.options[lhandshape.selectedIndex].getAttribute('data');
        var lextfidir = document.getElementById('lextfidir').value;
        var lpalmor = document.getElementById('lpalmor').value;
        sigml.splitHandConfig(true, data, extfidir, palmor, ldata, lextfidir, lpalmor);

        // Location
        var splitInitLocation = document.getElementById('split').checked;
        if (splitInitLocation){
            var location = document.getElementById('bodypart').value;
            var side = document.getElementById('side').value;
            var proximity = document.getElementById('proximity').value;
            var llocation = document.getElementById('lbodypart').value;
            var lside = document.getElementById('lside').value;
            var lproximity = document.getElementById('lproximity').value;
            sigml.splitLocation(true, location, side, proximity, llocation, lside, lproximity);
        }
        else {
            var handcontact = document.getElementById('lrproximity_rel').value;
            var location_hand_1, location_hand_2;
            // Left Hand Site
            var hptype1 = document.getElementById('hptype1').checked;
            if (hptype1){
                var digits = document.getElementById('digits').value;
                var location = document.getElementById('fingerpart').value;
                var side = document.getElementById('fingerside').value;
                location_hand_1 = sigml.fingerPartLocation(digits, location, side);
            }
            else {
                var location = document.getElementById('handpart').value;
                var side = document.getElementById('handside').value;
                location_hand_1 = sigml.handPartLocation(location, side);
            }
            // Right Hand Site
            var lhptype1 = document.getElementById('lhptype1').checked;
            if (lhptype1){
                var digits = document.getElementById('ldigits').value;
                var location = document.getElementById('lfingerpart').value;
                var side = document.getElementById('lfingerside').value;
                location_hand_2 = sigml.fingerPartLocation(digits, location, side);
            }
            else {
                var location = document.getElementById('lhandpart').value;
                var side = document.getElementById('lhandside').value;
                location_hand_2 = sigml.handPartLocation(location, side);
            }
            var location = document.getElementById('lrbodypart').value;
            var side = document.getElementById('lrside').value;
            var contact = document.getElementById('lrproximity').value;
            var location_bodyarm = sigml.bodyArmLocation(false, location, side, contact);
            sigml.setHandConstellation(true, handcontact, location_hand_1, location_hand_2, location_bodyarm);
        }


        // Motion
        if (document.getElementById("splitmotion").checked){
            var rightMotionSet = document.getElementsByName("rightSeq");
            var rightMotionSequence = "<seq_motion>"
            for (var i = 0; i < rightMotionSet.length; i++) {
                rightMotionSequence += rightMotionSet[i].value;
            }
            rightMotionSequence += "</seq_motion>";
            var rightMotionNode = sigml.initSingleMotionSequence(false, rightMotionSequence);

            var leftMotionSet = document.getElementsByName("left_Seq");
            var leftMotionSequence = "<seq_motion>"
            for (var i = 0; i < leftMotionSet.length; i++) {
                leftMotionSequence += leftMotionSet[i].value;
            }
            leftMotionSequence += "</seq_motion>";
            var leftMotionNode = sigml.initSingleMotionSequence(false, leftMotionSequence);
            
            sigml.initSplitMotionSequence(rightMotionNode, leftMotionNode)
        }
        else {
            var rightMotionSet = document.getElementsByName("rightSeq");
            var rightMotionSequence = "<seq_motion>"
            for (var i = 0; i < rightMotionSet.length; i++) {
                rightMotionSequence += rightMotionSet[i].value;
            }
            rightMotionSequence += "</seq_motion>";
            var rightMotionNode = sigml.initSingleMotionSequence(true, rightMotionSequence);
        }
    }

    else {
        // Hand Configuration
        var handshape = document.getElementById('handshape');
        var handshapeData = handshape.options[handshape.selectedIndex].getAttribute('data');
        var extfidir = document.getElementById('extfidir').value;
        var palmor = document.getElementById('palmor').value;
        sigml.singleHandConfig(true, handshapeData, extfidir, palmor);
        // Location
        var bodypart = document.getElementById('bodypart').value;
        var side = document.getElementById('side').value;
        var proximity = document.getElementById('proximity').value;
        sigml.bodyArmLocation(true, bodypart, side, proximity);
        // Motion
        var motionSet = document.getElementsByName("rightSeq");
        var motionSequence = "<seq_motion>"
        for (var i = 0; i < motionSet.length; i++) {
            motionSequence += motionSet[i].value;
        }
        motionSequence += "</seq_motion>"
        sigml.initSingleMotionSequence(true, motionSequence);
    }
    sigml.write();
}

function showTwoHandedOptions(){
    var twohanded = document.getElementById('twohanded');
    var leftOptions = document.getElementsByName('left');
    var nondom = document.getElementById('nondom_option');
    if (twohanded.checked) {
        for (var i = 0; i < leftOptions.length; i++) {
            leftOptions[i].removeAttribute('hidden');
        }
        nondom.setAttribute("hidden", true);
        showHandSiteOptions();
        showHandSiteOptionsLeft();
        showLocationOptions();
        showSymmetryOptions();
    }
    else {
        for (var i = 0; i < leftOptions.length; i++) {
            leftOptions[i].setAttribute('hidden',true);
        }
        document.getElementById("relative_options").setAttribute("hidden",true);
        document.getElementById("split_options").removeAttribute("hidden");
        nondom.removeAttribute("hidden");
        // deactivate seq constellation
        document.getElementById("seqconstellation").setAttribute("disabled","true");
        document.getElementById("seqconstellationattributes").setAttribute("hidden","true");
    }
    reload();
}

function showSymmetryOptions(){
    var symmetric = document.getElementById("symmetric");
    var symmetric_options = document.getElementById("symmetry_options");
    var left_motion_sequence = document.getElementById("left_motion_sequence");
    var handconstellation_input = document.getElementById("seqconstellation");
    var handconstellation_options = document.getElementById("seqconstellationattributes");
    var seqconstellationattributes = document.getElementById("seqconstellationattributes");
    var right_handshape_label_modal = document.getElementById("right_handshape_label_modal");
    var seqconfigattributes_left = document.getElementById("seqconfigattributes_left");
    if (symmetric.checked){
        symmetric_options.removeAttribute("hidden");
        left_motion_sequence.setAttribute("hidden", "true");
        handconstellation_input.removeAttribute("disabled");
        seqconstellationattributes.removeAttribute("hidden");
        right_handshape_label_modal.innerHTML = "Right Handshape";
        seqconfigattributes_left.removeAttribute("hidden");
    }
    else {
        symmetric_options.setAttribute("hidden","true");
        left_motion_sequence.removeAttribute("hidden");
        handconstellation_input.setAttribute("disabled","true");
        handconstellation_options.classList.remove("show");
        seqconstellationattributes.setAttribute("hidden","true");
        right_handshape_label_modal.innerHTML = "Handshape";
        seqconfigattributes_left.setAttribute("hidden", "true");
    }
    reload();
}

function resetModal(e){
    var hand = e.name;
    document.getElementById("motionModalLabel").innerHTML = "New Motion Sequence";
    // set default values
    var sigml="<rpt_motion><par_motion><tgt_motion><changeposture/></tgt_motion></par_motion></rpt_motion>";
    // reset motion tags
    document.getElementById("motions").value = "";
    // reset sigml box
    var textbox = document.getElementById("modalSigml");
    textbox.innerHTML = sigml;
    // Reset manner
    var motions = document.getElementById("motions");
    motions.innerHTML = ""
    var motionTypes = ["directed", "circular", "wrist", "config", "location", "constellation", "fingerplay"]
    var i;
    for (i = 0; i < motionTypes.length-1; i++){
        document.getElementById("seq"+motionTypes[i]).checked = false;
        document.getElementById("seq"+motionTypes[i]+"attributes").classList.remove("show");
    }
    document.getElementById("seq"+motionTypes[i]).checked = false;
    var selections = ["manner", "repetition", "direction", "curve", "curve_size", "zigzag_style", "ellipse_direction", "zigzag_size", "axis", "circular_size", "start", "motion", "size", "finalhandshape", "finalextfidir", "finalpalmor", "lfinalhandshape", "lfinalextfidir", "lfinalpalmor", "finalbodypart", "finalside", "finalproximity", "lrproximity_rel_modal", "ldigits_modal", "lfingerpart_modal", "lfingerside_modal", "lhandpart_modal", "lhandside_modal", "digits_modal", "fingerpart_modal", "fingerside_modal", "handpart_modal", "handside_modal"];
    for (i = 0; i < selections.length; i++){
        document.getElementById(selections[i]).selectedIndex = 0;
    }

    // New SeqId : REPLACE rightSeq with PARAM prefix + "Seq" [OK]
    // Get seq id so it knows where to save
    var sequence = document.getElementsByName(hand+"Seq");
    var seqid = 0;
    if (sequence.length != 0){
        var lastSeq = sequence[sequence.length-1];
        var prefix = lastSeq.id.slice(0,-5);
        var seqid = Number(prefix.slice(8,-1));
    }
    document.getElementById("saveModalButton").value = 1 + Number(seqid);
    document.getElementById("saveModalButton").setAttribute("name",hand);

}

function loadAttributes(elementNode, attributesList){
    for (var i = 0; i < attributesList.length; i++){
        var name = attributesList[i];
        var selectedOption = elementNode.getAttribute(name);
        var optionsList = document.getElementById(name).options;
        for (var j=0; j < optionsList.length; j++){
            if (optionsList[j].value == selectedOption){
                optionsList[j].selected = true;
                break;
            }
        }
    }
}

function loadModal(e){

    resetModal(e);

    // serializer.serializeToString(this.xmlDoc);
    var motionTags = [];
    // check sequence ID
    var prefix = e.id.slice(0,-5);
    var seqid = prefix.slice(8,-1);
    document.getElementById("motionModalLabel").innerHTML = "Motion Sequence #"+seqid;
    document.getElementById("saveModalButton").value = seqid;
    document.getElementById("saveModalButton").setAttribute("name", prefix.slice(0,5));
    // search for corresponding sigml in document
    var sigml = document.getElementById(prefix+"sigml");
    var motionDoc = parser.parseFromString(sigml.value, "text/xml");

    // rpt_motion
    var rpt_motion = motionDoc.getElementsByTagName("rpt_motion")[0]; // Always the root node
    var rpt_motion_attributes = ["manner", "repetition"]; // Attribute name is same as selection name
    loadAttributes(rpt_motion, rpt_motion_attributes);

    // directedmotion
    var directedmotion = motionDoc.getElementsByTagName("directedmotion");
    if (directedmotion.length != 0){
        motionTags.push("directed motion");
        // check and show attrbutes
        document.getElementById("seqdirected").checked = true;
        document.getElementById("seqdirectedattributes").classList.add("show");
        var directedmotion_attributes = ["direction", "curve", "curve_size", "zigzag_style", "ellipse_direction", "zigzag_size"];
        loadAttributes(directedmotion[0], directedmotion_attributes);
    }
    // circularmotion
    var circularmotion = motionDoc.getElementsByTagName("circularmotion");
    if (circularmotion.length != 0){
        motionTags.push("circular motion");
        // check and show attrbutes
        document.getElementById("seqcircular").checked = true;
        document.getElementById("seqcircularattributes").classList.add("show");
        var circularmotion_attributes = ["axis", "circular_size", "start"];
        loadAttributes(circularmotion[0], circularmotion_attributes);
    }
    // wristmotion
    var wristmotion = motionDoc.getElementsByTagName("wristmotion");
    if (wristmotion.length != 0){
        motionTags.push("wrist motion");
        // check and show attrbutes
        document.getElementById("seqwrist").checked = true;
        document.getElementById("seqwristattributes").classList.add("show");
        var wristmotion_attributes = ["motion", "size"];
        loadAttributes(wristmotion[0], wristmotion_attributes);
    }
    // fingerplay
    var fingerplay = motionDoc.getElementsByTagName("fingerplay");
    if (fingerplay.length != 0){
        motionTags.push("fingerplay");
        document.getElementById("seqfingerplay").checked = true;
    }

    // Hand Configuration
    var handconfig = motionDoc.getElementsByTagName("handconfig");
    if (handconfig.length != 0){
        handconfig = handconfig[0];
        motionTags.push("change posture");
        
        // check and show attrbutes
        document.getElementById("seqconfig").checked = true;
        document.getElementById("seqconfigattributes").classList.add("show");
        
        // GET CONFIG FROM SIGML
        var extfidir = handconfig.getAttribute("extfidir");
        var palmor = handconfig.getAttribute("palmor");
        handconfig.removeAttribute("extfidir");
        handconfig.removeAttribute("palmor")

        // Select final handshape
        handconfig = serializer.serializeToString(handconfig);
        var finalhandshapeOptions = document.getElementById("finalhandshape").options
        for (var i = 0; i < finalhandshapeOptions.length; i++){
            var finalhandconfigDoc = parser.parseFromString(finalhandshapeOptions[i].getAttribute('data'), "text/xml");
            var finalhandconfigNode = finalhandconfigDoc.getElementsByTagName("handconfig")[0];
            finalhandconfigNode.removeAttribute("extfidir");
            finalhandconfigNode.removeAttribute("palmor");
            var finalhandconfigString = serializer.serializeToString(finalhandconfigNode);
            if (handconfig == finalhandconfigString){
                finalhandshapeOptions[i].selected=true;
                break;
            }
        }
        // Select extfidir
        var finalextfidirOptions = document.getElementById("finalextfidir").options;
        for (var i = 0; i < finalextfidirOptions.length; i++){
            if (finalextfidirOptions[i].value == extfidir){
                finalextfidirOptions[i].selected = true;
                break;
            }
        }
        // Select palmor
        var finalpalmorOptions = document.getElementById("finalpalmor").options;
        for (var i = 0; i < finalpalmorOptions.length; i++){
            if (finalpalmorOptions[i].value == palmor){
                finalpalmorOptions[i].selected = true;
                break;
            }
        }

        var split_handconfig = motionDoc.getElementsByTagName("split_handconfig");
        if (split_handconfig.length != 0){
            var lhandconfig = motionDoc.getElementsByTagName("handconfig")[1];

            // GET CONFIG FROM SIGML
            var lextfidir = lhandconfig.getAttribute("extfidir");
            var lpalmor = lhandconfig.getAttribute("palmor");
            lhandconfig.removeAttribute("extfidir");
            lhandconfig.removeAttribute("palmor");

            // Select final handshape
            lhandconfig = serializer.serializeToString(lhandconfig);
            var lfinalhandshapeOptions = document.getElementById("lfinalhandshape").options
            for (var i = 0; i < lfinalhandshapeOptions.length; i++){
                var lfinalhandconfigDoc = parser.parseFromString(lfinalhandshapeOptions[i].getAttribute('data'), "text/xml");
                var lfinalhandconfigNode = lfinalhandconfigDoc.getElementsByTagName("handconfig")[0];
                lfinalhandconfigNode.removeAttribute("extfidir");
                lfinalhandconfigNode.removeAttribute("palmor");
                var lfinalhandconfigString = serializer.serializeToString(lfinalhandconfigNode);
                if (lhandconfig == lfinalhandconfigString){
                    lfinalhandshapeOptions[i].selected=true;
                    break;
                }
            }

            // Select extfidir
            var lfinalextfidirOptions = document.getElementById("lfinalextfidir").options;
            for (var i = 0; i < lfinalextfidirOptions.length; i++){
                if (lfinalextfidirOptions[i].value == lextfidir){
                    lfinalextfidirOptions[i].selected = true;
                    break;
                }
            }
            // Select palmor
            var lfinalpalmorOptions = document.getElementById("lfinalpalmor").options;
            for (var i = 0; i < lfinalpalmorOptions.length; i++){
                if (lfinalpalmorOptions[i].value == lpalmor){
                    lfinalpalmorOptions[i].selected = true;
                    break;
                }
            }
        }
    }
    
    // Location
    var location_bodyarm = motionDoc.getElementsByTagName("location_bodyarm");
    if (location_bodyarm.length != 0){
        motionTags.push("change location");

        location_bodyarm = location_bodyarm[0];
        
        // check and show attrbutes
        document.getElementById("seqlocation").checked = true;
        document.getElementById("seqlocationattributes").classList.add("show");
        
        // GET LOCATION FROM SIGML
        var finalbodypart = location_bodyarm.getAttribute("location");
        var finalbodypartOptions = document.getElementById("finalbodypart").options
        for (var i = 0; i < finalbodypartOptions.length; i++){
            if (finalbodypart == finalbodypartOptions[i].value){
                finalbodypartOptions[i].selected = true;
                break;
            }
        }
        var finalside = location_bodyarm.getAttribute("side");
        var finalsideOptions = document.getElementById("finalside").options
        for (var i = 0; i < finalsideOptions.length; i++){
            if (finalside == finalsideOptions[i].value){
                finalsideOptions[i].selected = true;
                break;
            }
        }
        var finalproximity = location_bodyarm.getAttribute("contact");
        var finalproximityOptions = document.getElementById("finalproximity").options
        for (var i = 0; i < finalproximityOptions.length; i++){
            if (finalproximity == finalproximityOptions[i].value){
                finalproximityOptions[i].selected = true;
                break;
            }
        }
    }

    // Hand constellation
    var handconstellation = motionDoc.getElementsByTagName("handconstellation");
    if (handconstellation.length != 0){

        motionTags.push("change handconstellation");
        
        handconstellation = handconstellation[0];

        // check and show attrbutes
        document.getElementById("seqconstellation").checked = true;
        document.getElementById("seqconstellationattributes").classList.add("show");
        
        // GET CONSTELLATION FROM SIGML
        var constellationcontact = handconstellation.getAttribute("contact");
        var constellationcontactOptions = document.getElementById("lrproximity_rel_modal").options
        for (var i = 0; i < constellationcontactOptions.length; i++){
            if (constellationcontact == constellationcontactOptions[i].value){
                constellationcontactOptions[i].selected = true;
                break;
            }
        }
        
        var right_hand_site = handconstellation.children[1];

        if (right_hand_site.getAttribute("digits") == null){

            // activate handpart option
            document.getElementById("lhptype2_modal").checked = true;
            showHandSiteOptionsLeftModal();

            // handpart
            var lhandpart = right_hand_site.getAttribute("location");
            var lhandpartOptions = document.getElementById("lhandpart_modal").options
            for (var i = 0; i < lhandpartOptions.length; i++){
                if (lhandpart == lhandpartOptions[i].value){
                    lhandpartOptions[i].selected = true;
                    break;
                }
            }

            // handside
            var lhandside = right_hand_site.getAttribute("side");
            var lhandsideOptions = document.getElementById("lhandside_modal").options
            for (var i = 0; i < lhandsideOptions.length; i++){
                if (lhandside == lhandsideOptions[i].value){
                    lhandsideOptions[i].selected = true;
                    break;
                }
            }
        }
        else {

            // activate fingerpart option
            document.getElementById("lhptype1_modal").checked = true;
            showHandSiteOptionsLeftModal();

            // digits
            var ldigits = right_hand_site.getAttribute("digits");
            var ldigitsOptions = document.getElementById("ldigits_modal").options
            for (var i = 0; i < ldigitsOptions.length; i++){
                if (ldigits == ldigitsOptions[i].value){
                    ldigitsOptions[i].selected = true;
                    break;
                }
            }

            // fingerpart
            var lfingerpart = right_hand_site.getAttribute("location");
            var lfingerpartOptions = document.getElementById("lfingerpart_modal").options
            for (var i = 0; i < lfingerpartOptions.length; i++){
                if (lfingerpart == lfingerpartOptions[i].value){
                    lfingerpartOptions[i].selected = true;
                    break;
                }
            }

            // fingerside
            var lfingerside = right_hand_site.getAttribute("location");
            var lfingersideOptions = document.getElementById("lfingerside_modal").options
            for (var i = 0; i < lfingersideOptions.length; i++){
                if (lfingerside == lfingersideOptions[i].value){
                    lfingersideOptions[i].selected = true;
                    break;
                }
            }
        }

        var left_hand_site = handconstellation.children[0];
        if (left_hand_site.getAttribute("digits") == null){

            // activate handpart option
            document.getElementById("hptype2_modal").checked = true;
            showHandSiteOptionsModal();
            
            // handpart
            var handpart = left_hand_site.getAttribute("location");
            var handpartOptions = document.getElementById("handpart_modal").options
            for (var i = 0; i < handpartOptions.length; i++){
                if (handpart == handpartOptions[i].value){
                    handpartOptions[i].selected = true;
                    break;
                }
            }

            // handside
            var handside = left_hand_site.getAttribute("side");
            var handsideOptions = document.getElementById("handside_modal").options
            for (var i = 0; i < handsideOptions.length; i++){
                if (handside == handsideOptions[i].value){
                    handsideOptions[i].selected = true;
                    break;
                }
            }
        }
        else {

            // activate fingerpart option
            document.getElementById("hptype1_modal").checked = true;
            showHandSiteOptionsModal();

            // digits
            var digits = left_hand_site.getAttribute("digits");
            var digitsOptions = document.getElementById("digits_modal").options
            for (var i = 0; i < digitsOptions.length; i++){
                if (digits == digitsOptions[i].value){
                    digitsOptions[i].selected = true;
                    break;
                }
            }

            // fingerpart
            var fingerpart = left_hand_site.getAttribute("location");
            var fingerpartOptions = document.getElementById("fingerpart_modal").options
            for (var i = 0; i < fingerpartOptions.length; i++){
                if (fingerpart == fingerpartOptions[i].value){
                    fingerpartOptions[i].selected = true;
                    break;
                }
            }

            // fingerside
            var fingerside = left_hand_site.getAttribute("location");
            var fingersideOptions = document.getElementById("fingerside_modal").options
            for (var i = 0; i < fingersideOptions.length; i++){
                if (fingerside == fingersideOptions[i].value){
                    fingersideOptions[i].selected = true;
                    break;
                }
            }
        }


    }

    // Update Motion Type/s box
    var motionTagString = ""
    if (motionTags.length == 1){
        motionTagString += motionTags[0]
    }
    else {
        for (var i=0; i < motionTags.length-1; i++){
            motionTagString += motionTags[i]+" / ";
        }
        motionTagString += motionTags[i]
    }
    document.getElementById("motions").value = motionTagString;
    document.getElementById("modalSigml").textContent = sigml.value;
}

// on change of values rewrite sigml within modal
function reloadModal(){
    var sigml = new SIGML();
    var motionTags = [];
    var initString = "<rpt_motion><par_motion><tgt_motion><changeposture/></tgt_motion></par_motion></rpt_motion>"
    var motionDoc = parser.parseFromString(initString, "text/xml");
    var rpt_motion = motionDoc.getElementsByTagName("rpt_motion")[0];
    var par_motion = motionDoc.getElementsByTagName("par_motion")[0];
    var tgt_motion = motionDoc.getElementsByTagName("tgt_motion")[0];

    // Repeat motion
    rpt_motion.setAttribute("repetition",document.getElementById("repetition").value);
    rpt_motion.setAttribute("manner",document.getElementById("manner").value);

    // Handconfig
    if (document.getElementById("seqconfig").checked){
        motionTags.push("change posture");
        var finalhandshape = document.getElementById('finalhandshape');
        var data = finalhandshape.options[finalhandshape.selectedIndex].getAttribute('data');
        var handconfig = sigml.singleHandConfig(false, data, document.getElementById("finalextfidir").value, document.getElementById("finalpalmor").value);

        // if symmetric split hand config
        if (document.getElementById("symmetric").checked && document.getElementById("twohanded").checked){
            var lfinalhandshape = document.getElementById('lfinalhandshape');
            var ldata = lfinalhandshape.options[lfinalhandshape.selectedIndex].getAttribute('data');
            var split_handconfig = sigml.splitHandConfig(false, data, document.getElementById("finalextfidir").value, document.getElementById("finalpalmor").value, ldata, document.getElementById("lfinalextfidir").value, document.getElementById("lfinalpalmor").value);
            tgt_motion.appendChild(split_handconfig);
        }
        else {
            tgt_motion.appendChild(handconfig);
        }
    }

    // Location
    var location_bodyarm;
    var location_hand_1, location_hand_2;
    if (document.getElementById("seqlocation").checked){

        location_bodyarm = sigml.bodyArmLocation(false, document.getElementById("finalbodypart").value, document.getElementById("finalside").value, document.getElementById("finalproximity").value);

        if (document.getElementById("seqconstellation").checked){
            motionTags.push("change constellation");
        }
        else {
            motionTags.push("change location");    
        }
    }
    else {
        location_bodyarm = null;
    }

    if (document.getElementById("seqconstellation").checked){
        if (document.getElementById("hptype1_modal").checked){
            var digits = document.getElementById("digits_modal").value;
            var location = document.getElementById("fingerpart_modal").value;
            var side = document.getElementById("fingerside_modal").value;
            location_hand_1 = sigml.fingerPartLocation(digits, location, side);
        }
        else {
            var location = document.getElementById("handpart_modal").value;
            var side = document.getElementById("handside_modal").value;
            location_hand_1 = sigml.handPartLocation(location, side);
        }
        if (document.getElementById("lhptype1_modal").checked){
            var digits = document.getElementById("ldigits_modal").value;
            var location = document.getElementById("lfingerpart_modal").value;
            var side = document.getElementById("lfingerside_modal").value;
            location_hand_2 = sigml.fingerPartLocation(digits, location, side);
        }
        else {
            var location = document.getElementById("lhandpart_modal").value;
            var side = document.getElementById("lhandside_modal").value;
            location_hand_2 = sigml.handPartLocation(location, side);
        }
        var contact = document.getElementById("lrproximity_rel_modal").value;
        var handconstellation = sigml.setHandConstellation(false, contact, location_hand_1, location_hand_2, location_bodyarm);
        tgt_motion.appendChild(handconstellation);
    }

    // directedmotion
    if (document.getElementById("seqdirected").checked){
        motionTags.push("directed motion");
        var directedmotion = sigml.directedMotionSequence(document.getElementById("direction").value, document.getElementById("curve").value, document.getElementById("curve_size").value, document.getElementById("zigzag_style").value, document.getElementById("ellipse_direction").value, document.getElementById("zigzag_size").value);
        par_motion.appendChild(directedmotion);
    }

    // circularmotion
    if (document.getElementById("seqcircular").checked){
        motionTags.push("circular motion");
        var circularmotion = sigml.circularMotionSequence(document.getElementById("axis").value, document.getElementById("circular_size").value, document.getElementById("start").value);
        par_motion.appendChild(circularmotion);
    }

    // wristmotion
    if (document.getElementById("seqwrist").checked){
        motionTags.push("wrist motion");
        var wristmotion = sigml.wristMotionSequence(document.getElementById("motion").value, document.getElementById("size").value)
        par_motion.appendChild(wristmotion);
    }
    // fingerplay
    if (document.getElementById("seqfingerplay").checked){
        motionTags.push("fingerplay")
        var fingerplay = motionDoc.createElement("fingerplay");
        par_motion.appendChild(fingerplay);
    }

    // Update Motion Type/s box
    var motionTagString = ""
    if (motionTags.length == 0){
        motionTagString = "No motion."
    }
    else if (motionTags.length == 1){
        motionTagString += motionTags[0]
    }
    else {
        for (var i=0; i < motionTags.length-1; i++){
            motionTagString += motionTags[i]+" / ";
        }
        motionTagString += motionTags[i]
    }
    document.getElementById("motions").value = motionTagString;

    // write to sigml
    document.getElementById("modalSigml").innerHTML = serializer.serializeToString(motionDoc);

}

function saveModal(e){
    // is it new or edit?
    var seqid = e.value;
    var hand = e.name;
    if (document.getElementById("motionModalLabel").innerHTML == "New Motion Sequence"){
        
        console.log("TABLE BODY "+hand+"SeqTableBody");
        var seqTableBody = document.getElementById(hand + "SeqTableBody");

        
        var col1 = document.createElement("td");
        col1.setAttribute("id",hand+"Seq"+seqid+"_motion");
        col1.setAttribute("style","word-wrap:break-word;width:350px;");
        
        var col2 = document.createElement("td");
        col2.setAttribute("id",hand+"Seq"+seqid+"_config")
        col2.setAttribute("style","word-wrap:break-word;width:150px;");
        
        var col3 = document.createElement("td");
        col3.setAttribute("id",hand+"Seq"+seqid+"_loc");
        col3.setAttribute("style","word-wrap:break-word;width:150px;");

        var col4 = document.createElement("td");
        var editButton = document.createElement("a");
        editButton.setAttribute("href","#");
        editButton.setAttribute("class", "text-primary");
        editButton.setAttribute("data-toggle", "modal");
        editButton.setAttribute("data-target", "#motionModal");
        editButton.setAttribute("id", hand+"Seq"+seqid+"_modal");
        editButton.setAttribute("onclick", "loadModal(this);")
        editButton.innerHTML = "Edit"
        col4.appendChild(editButton);
        var deleteButton = document.createElement("a");
        deleteButton.setAttribute("href","#");
        deleteButton.setAttribute("class", "text-danger");
        deleteButton.setAttribute("id", hand+"Seq"+seqid+"_delete");
        deleteButton.setAttribute("onclick", "deleteMotionSequence(this);")
        deleteButton.innerHTML = " Delete"
        col4.appendChild(deleteButton);

        var col5 = document.createElement("td");
        col5.setAttribute("hidden","true");
        // sigml
        var motionBox = document.createElement("input");
        motionBox.setAttribute("name", hand+"Seq")
        motionBox.setAttribute("id", hand+"Seq"+seqid+"_sigml");
        motionBox.setAttribute("value", document.getElementById("modalSigml").textContent);
        col5.appendChild(motionBox);
        // motion_input : <input id="rightSeq1_motion_input" name="rightSeqMotionTag" value="change posture / wrist motion / fingerplay">
        var tagBox = document.createElement("input");
        tagBox.setAttribute("name", hand+"SeqMotionTag")
        tagBox.setAttribute("id", hand+"Seq"+seqid+"_motion_input");
        col5.appendChild(tagBox);
        // config_input : <input id="rightSeq1_config_input" name="rightSeqTargetConfig" value="B">
        var configBox = document.createElement("input");
        configBox.setAttribute("name", hand+"SeqTargetConfig")
        configBox.setAttribute("id", hand+"Seq"+seqid+"_config_input");
        col5.appendChild(configBox);
        // loc_input : <input id="rightSeq1_loc_input" name="rightSeqTargetLoc" value="None">
        var locBox = document.createElement("input");
        locBox.setAttribute("name", hand+"SeqTargetLoc")
        locBox.setAttribute("id", hand+"Seq"+seqid+"_loc_input");
        col5.appendChild(locBox);

        var newtr = document.createElement("tr");
        var newth = document.createElement("th");
        newth.setAttribute("scope","row");
        newth.innerHTML = seqid;

        newtr.appendChild(newth);
        newtr.appendChild(col1);
        newtr.appendChild(col2);
        newtr.appendChild(col3);
        newtr.appendChild(col4);
        newtr.appendChild(col5);

        seqTableBody.appendChild(newtr)

    }
    console.log("saved for seq "+seqid);
    console.log(hand+"Seq"+seqid+"_motion")
    document.getElementById(hand+"Seq"+seqid+"_motion").innerHTML = document.getElementById("motions").value;
    document.getElementById(hand+"Seq"+seqid+"_motion_input").setAttribute("value", document.getElementById("motions").value);
    if (document.getElementById("seqconfig").checked){
        document.getElementById(hand+"Seq"+seqid+"_config").innerHTML = document.getElementById("finalhandshape").options[document.getElementById("finalhandshape").selectedIndex].innerHTML;
        document.getElementById(hand+"Seq"+seqid+"_config_input").setAttribute("value", document.getElementById("finalhandshape").options[document.getElementById("finalhandshape").selectedIndex].innerHTML);
    }
    else {
        document.getElementById(hand+"Seq"+seqid+"_config").innerHTML = "None."
        document.getElementById(hand+"Seq"+seqid+"_config_input").setAttribute("value", "None");
    }
    if (document.getElementById("seqlocation").checked){
        document.getElementById(hand+"Seq"+seqid+"_loc").innerHTML = document.getElementById("finalbodypart").options[document.getElementById("finalbodypart").selectedIndex].innerHTML;
        document.getElementById(hand+"Seq"+seqid+"_loc_input").setAttribute("value", document.getElementById("finalbodypart").options[document.getElementById("finalbodypart").selectedIndex].innerHTML);
    }
    else {
        document.getElementById(hand+"Seq"+seqid+"_loc").innerHTML = "None."
        document.getElementById(hand+"Seq"+seqid+"_loc_input").setAttribute("value", "None");
    }
    document.getElementById(hand+"Seq"+seqid+"_sigml").value = document.getElementById("modalSigml").textContent;
    resetModal(document.getElementById(hand+"Reset"));
    reload();
}

function updateTableNumbering(hand){
    var rows = document.getElementById(hand+"SeqTableBody").children;
    for (var i = 1; i < rows.length+1; i++){
        var row = rows[i-1];
        row.children[0].innerHTML = i;
        row.children[1].id = hand+"Seq"+i+"_motion";
        row.children[2].id = hand+"Seq"+i+"_config";
        row.children[3].id = hand+"Seq"+i+"_loc";
        row.children[4].children[0].id = hand+"Seq"+i+"_modal";
        row.children[4].children[1].id = hand+"Seq"+i+"_delete";
        row.children[5].children[0].id = hand+"Seq"+i+"_sigml";
    }

}

function deleteMotionSequence(e){
    // Find SeqId
    // var sequence = document.getElementsByName("rightSeq1_delete");
    // var lastSeq = sequence[sequence.length-1];
    var prefix = e.id.slice(0,-6);
    var hand = prefix.slice(0,5);
    var seqid = prefix.slice(8,-1);
    seqid = Number(seqid) - 1;
    document.getElementById(hand+"SeqTableBody").children[seqid].remove()
    updateTableNumbering(hand);
    reload();
}

function showLocationOptions(){
    var loctypes = document.getElementsByName('loctype');
    if (loctypes[0].checked) {
        document.getElementById('split_options').removeAttribute("hidden")
        document.getElementById('relative_options').setAttribute("hidden","true")
    }
    else {
        document.getElementById('relative_options').removeAttribute("hidden")
        document.getElementById('split_options').setAttribute("hidden","true")
    }
    reload();
}

function showHandSiteOptions(){
    var hptypes = document.getElementsByName('hptype');
    if (hptypes[0].checked) {
        document.getElementById('fingerpart_options').removeAttribute("hidden")
        document.getElementById('handpart_options').setAttribute("hidden","true")
    }
    else {
        document.getElementById('handpart_options').removeAttribute("hidden")
        document.getElementById('fingerpart_options').setAttribute("hidden","true")
    }
}

function showHandSiteOptionsLeft(){
    var hptypes = document.getElementsByName('lhptype');
    if (hptypes[0].checked) {
        document.getElementById('lfingerpart_options').removeAttribute("hidden")
        document.getElementById('lhandpart_options').setAttribute("hidden","true")
    }
    else {
        document.getElementById('lhandpart_options').removeAttribute("hidden")
        document.getElementById('lfingerpart_options').setAttribute("hidden","true")
    }
}

function showHandSiteOptionsModal(){
    var hptypes = document.getElementsByName('hptype_modal');
    if (hptypes[0].checked) {
        document.getElementById('fingerpart_options_modal').removeAttribute("hidden")
        document.getElementById('handpart_options_modal').setAttribute("hidden","true")
    }
    else {
        document.getElementById('handpart_options_modal').removeAttribute("hidden")
        document.getElementById('fingerpart_options_modal').setAttribute("hidden","true")
    }
}

function showHandSiteOptionsLeftModal(){
    var hptypes = document.getElementsByName('lhptype_modal');
    if (hptypes[0].checked) {
        document.getElementById('lfingerpart_options_modal').removeAttribute("hidden")
        document.getElementById('lhandpart_options_modal').setAttribute("hidden","true")
    }
    else {
        document.getElementById('lhandpart_options_modal').removeAttribute("hidden")
        document.getElementById('lfingerpart_options_modal').setAttribute("hidden","true")
    }
}

// TRANSLATOR FUNCTIONS

function includeSign(e){
    var sentence = document.getElementById("sentence");
    var word_button = document.createElement("a");
    var sigml = e.getAttribute('data');
    word_button.setAttribute("name", "sign-word");
    word_button.setAttribute("class", "btn btn-sm btn-info text-white");
    word_button.setAttribute("style", "font-size:0.7rem;margin-right: 10px; margin-bottom: 10px;");
    word_button.setAttribute("data", sigml.slice(7,-8));
    word_button.setAttribute("onclick", "playWord(this);");
    word_button.innerHTML = "<strong>"+e.value+"</strong>"
    sentence.appendChild(word_button);
    generateSentence();
}

function spellOut(e){
    var sentence = document.getElementById("sentence");
    var word_button = document.createElement("a");
    word_button.setAttribute("name", "sign-word");
    word_button.setAttribute("class", "btn btn-sm btn-warning text-white");
    word_button.setAttribute("style", "font-size:0.7rem;margin-right: 10px; margin-bottom: 10px;");
    word_button.setAttribute("data", e.getAttribute('data'));
    word_button.setAttribute("onclick", "playWord(this);");
    word_button.innerHTML = "<strong>"+e.value+"</strong>"
    sentence.appendChild(word_button);
    generateSentence();
}

function playWord(e){
    var sigml = "<sigml>" + e.getAttribute("data") + "</sigml>";
    writesigml(sigml);
}

function generateSentence(){
    var words = document.getElementsByName("sign-word");
    var sigml = "<sigml>"
    for (var i = 0; i < words.length; i++) {
        sigml = sigml + words[i].getAttribute('data');
    }
    sigml = sigml + "</sigml>"
    document.getElementById('sigml').innerHTML = sigml;
    document.getElementById("animate").click();
}

function clearSentence(){
    document.getElementById('sentence').innerHTML = "";
    document.getElementById('sigml').innerHTML = "";
}

function backspace(){
    var words = document.getElementsByName("sign-word");
    words[words.length-1].remove();
    words = document.getElementsByName("sign-word");
    var sigml = "<sigml>"
    for (var i = 0; i < words.length; i++) {
        sigml = sigml + words[i].getAttribute('data');
    }
    sigml = sigml + "</sigml>"
    document.getElementById('sigml').innerHTML = sigml;
}

// function saveTextAsFile(){
//     var textToWrite = formatXml(document.getElementById('sigml').textContent);
//     var fileNameToSaveAs = "sigml.xml"
//     var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'}); 
//     var downloadLink = document.createElement("a");
//     downloadLink.download = fileNameToSaveAs;
//     downloadLink.innerHTML = "Download Text";
//     if (window.webkitURL != null){
//         // Chrome allows the link to be clicked
//         // without actually adding it to the DOM.
//         downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
//     }
//     else{
//         // Firefox requires the link to be added to the DOM
//         // before it can be clicked.
//         downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
//         downloadLink.onclick = destroyClickedElement;
//         downloadLink.style.display = "none";
//         document.body.appendChild(downloadLink);
//     }

//     downloadLink.click();
// }

var delay = ( function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

delay(function(){
    // document.getElementById("animate").removeAttribute("disabled");
    handshapeForm = document.forms["handconfig"];
    signForm = document.forms["signeditor"]
    if (handshapeForm){
        updatesign();
    } else if (signForm){
        reload();
        showTwoHandedOptions();
        signForm.removeAttribute("hidden");
    }
    document.getElementById("loading").innerHTML = "JASigning Avatar"
    document.getElementById("animate").click();
}, 3000 ); // end delay


// var canvas = document.querySelector("canvas");
// var video = document.querySelector("video");

// var videoStream = canvas.captureStream(30);
// var mediaRecorder = new MediaRecorder(videoStream);

// var chunks = [];
// mediaRecorder.ondataavailable = function(e) {
//   chunks.push(e.data);
// };

// mediaRecorder.onstop = function(e) {
//   var blob = new Blob(chunks, { 'type' : 'video/mp4' });
//   chunks = [];
//   var videoURL = URL.createObjectURL(blob);
//   video.src = videoURL;
// };
// mediaRecorder.ondataavailable = function(e) {
//   chunks.push(e.data);
// };