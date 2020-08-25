var handshapeForm, xmlDoc;
var parser = new DOMParser();
var serializer = new XMLSerializer();
var xmlString = "<sigml><hamgestural_sign><sign_manual></sign_manual></hamgestural_sign></sigml>";
xmlDoc = parser.parseFromString(xmlString, "text/xml");

function initsigml(){
    var sigmltxt = serializer.serializeToString(xmlDoc);
    document.getElementById('sigml').innerHTML = sigmltxt;
    console.log("SIGML init end");
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
    document.getElementById("loading").innerHTML = "JASigning Avatar"
    document.getElementById("animate").click();
}

function writesigml(sigml){
    document.getElementById('sigml').innerHTML = sigml;
    document.getElementById("animate").click();
}

function reload(){

    // Initialize xml
    xmlDoc = parser.parseFromString(xmlString, "text/xml");
    var $xml = $( xmlDoc );
    var $sign_manual = $xml.find( "sign_manual" );
        
    var twohanded = document.getElementById('twohanded').checked;
    var split = document.getElementById('split').checked;

    if (twohanded){

        // Split handconfig
        $sign_manual.append('<split_handconfig/>');
        var $split_handconfig = $xml.find( "split_handconfig" );

        // Handshape
        var handshape = document.getElementById('handshape');
        var selected = handshape.options[handshape.selectedIndex].getAttribute('data');
        $split_handconfig.append(selected);

        var lhandshape = document.getElementById('l_handshape');
        var selected = lhandshape.options[lhandshape.selectedIndex].getAttribute('data');
        $split_handconfig.append(selected);

        // External Finger Direction
        var handconfig = xmlDoc.getElementsByTagName('handconfig')[0];
        var extifidir = document.getElementById('extfidir'); 
        handconfig.setAttribute('extfidir', extifidir.value)
        
        var lhandconfig = xmlDoc.getElementsByTagName('handconfig')[1];
        var lextifidir = document.getElementById('lextfidir'); 
        lhandconfig.setAttribute('extfidir', lextifidir.value)

        // Palm Orientation
        var palmor = document.getElementById('palmor'); 
        handconfig.setAttribute('palmor', palmor.value)

        var lpalmor = document.getElementById('lpalmor'); 
        lhandconfig.setAttribute('palmor', lpalmor.value)

        if (split){
            $sign_manual.append('<split_location/>');
            var $split_location = $xml.find( "split_location" );

            // Split location - R
            $split_location.append("<location_bodyarm/>");
            var bodypart = document.getElementById('bodypart');
            var loc = xmlDoc.getElementsByTagName('location_bodyarm')[0];
            loc.setAttribute('location',bodypart.value);
            var side = document.getElementById('side');
            loc.setAttribute('side',side.value);
            var proximity = document.getElementById('proximity');
            loc.setAttribute('contact',proximity.value);

            // Split Location - L
            $split_location.append("<location_bodyarm/>");
            var lbodypart = document.getElementById('lbodypart');
            var lloc = xmlDoc.getElementsByTagName('location_bodyarm')[1];
            lloc.setAttribute('location',lbodypart.value);
            var lside = document.getElementById('lside');
            lloc.setAttribute('side',lside.value);
            var lproximity = document.getElementById('lproximity');
            lloc.setAttribute('contact',lproximity.value);
        }
        else {
            $sign_manual.append('<handconstellation/>');
            var $handconstellation = $xml.find( "handconstellation" );
            var lrproximity_rel = document.getElementById('lrproximity_rel');
            var hc = xmlDoc.getElementsByTagName('handconstellation')[0];
            hc.setAttribute("contact",lrproximity_rel.value)

            $handconstellation.append("<location_hand/>");
            $handconstellation.append("<location_hand/>");
            $handconstellation.append("<location_bodyarm/>");
            var r_hand = xmlDoc.getElementsByTagName('location_hand')[0];
            var l_hand = xmlDoc.getElementsByTagName('location_hand')[1];
            var lr_loc = xmlDoc.getElementsByTagName('location_bodyarm')[0];

            // Hand Constellation Sub Elements for RIGHT HAND
            // Finger Part
            var hptype1 = document.getElementById('hptype1').checked;
            if (hptype1){
                var digits = document.getElementById('digits');
                var fingerpart = document.getElementById('fingerpart');
                var fingerside = document.getElementById('fingerside');
                r_hand.setAttribute('digits',digits.value);
                r_hand.setAttribute('location',fingerpart.value);
                r_hand.setAttribute('side',fingerside.value);
            }
            // Hand Part
            else {
                var handpart = document.getElementById('handpart');
                var handside = document.getElementById('handside');
                r_hand.setAttribute("location",handpart.value);
                r_hand.setAttribute("side",handside.value);
            }

            // Hand Constellation Sub Elements for LEFT HAND
            // Finger Part
            var lhptype1 = document.getElementById('lhptype1').checked;
            if (lhptype1){
                var digits = document.getElementById('ldigits');
                var fingerpart = document.getElementById('lfingerpart');
                var fingerside = document.getElementById('lfingerside');
                l_hand.setAttribute('digits',digits.value);
                l_hand.setAttribute('location',fingerpart.value);
                l_hand.setAttribute('side',fingerside.value);
            }
            // Hand Part
            else {
                var handpart = document.getElementById('lhandpart');
                var handside = document.getElementById('lhandside');
                l_hand.setAttribute("location",handpart.value);
                l_hand.setAttribute("side",handside.value);
            }

            // Loc Body Arm
            var lrbodypart = document.getElementById('lrbodypart');
            lr_loc.setAttribute('location',lrbodypart.value);
            var lrside = document.getElementById('lrside');
            lr_loc.setAttribute('side',lrside.value);
            var lrproximity = document.getElementById('lrproximity');
            lr_loc.setAttribute('contact',lrproximity.value);

        }


    }
    else {
        
        // Update hand configuration
        var handshape = document.getElementById('handshape');
        var selected = handshape.options[handshape.selectedIndex].getAttribute('data');
        $sign_manual.append(selected);
        var handconfig = xmlDoc.getElementsByTagName('handconfig')[0];

        // Update external finger direction
        var handconfig = xmlDoc.getElementsByTagName('handconfig')[0];
        var extifidir = document.getElementById('extfidir'); 
        handconfig.setAttribute('extfidir', extifidir.value)

        // Update palm orientation
        var palmor = document.getElementById('palmor'); 
        handconfig.setAttribute('palmor', palmor.value)

        // Location
        $sign_manual.append("<location_bodyarm/>");
        var bodypart = document.getElementById('bodypart');
        var loc = xmlDoc.getElementsByTagName('location_bodyarm')[0];
        loc.setAttribute('location',bodypart.value);
        var side = document.getElementById('side');
        loc.setAttribute('side',side.value);
        var proximity = document.getElementById('proximity');
        loc.setAttribute('contact',proximity.value);
    }

    // Change sigml txt in textbox
    var sigmltxt = serializer.serializeToString(xmlDoc);
    document.getElementById('sigml').innerHTML = sigmltxt;

    // Animate
    document.getElementById("loading").innerHTML = "JASigning Avatar"
    document.getElementById("animate").click();
}


function activateleft(){
    var twohanded = document.getElementById('twohanded');
    var leftOptions = document.getElementsByName('left');
    if (twohanded.checked) {
        for (var i = 0; i < leftOptions.length; i++) {
            leftOptions[i].removeAttribute('hidden');
        }
    }
    else {
        for (var i = 0; i < leftOptions.length; i++) {
            leftOptions[i].setAttribute('hidden',true);
        }
    }
    reload();
}

function updateloctype(){
    var loctypes = document.getElementsByName('loctype');
    if (loctypes[0].checked) {
        document.getElementById('split_options').removeAttribute("hidden")
        document.getElementById('relative_options').setAttribute("hidden","true")
        document.getElementById('relative_options_2').setAttribute("hidden","true")
    }
    else {
        document.getElementById('relative_options').removeAttribute("hidden")
        document.getElementById('relative_options_2').removeAttribute("hidden")
        document.getElementById('split_options').setAttribute("hidden","true")
    }
    reload();
}

function updatehptype(){
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

function updatelhptype(){
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

function resetBend(finger){
    var box;
    switch(finger){
        case '1':
            for(i = 1; i < 6; i++) {
                box = 'bend1_'+ i;
                document.getElementsByName(box)[0].value = 0.0;
            }
            break;
        case '2':
            for(i = 1; i < 5; i++) {
                box = 'bend2_'+ i;
                document.getElementsByName(box)[0].value = 0.0;
            }
            break;
        case '3':
            for(i = 1; i < 5; i++) {
                box = 'bend3_'+ i;
                document.getElementsByName(box)[0].value = 0.0;
            }
            break;
        case '4':
            for(i = 1; i < 5; i++) {
                box = 'bend4_'+ i;
                document.getElementsByName(box)[0].value = 0.0;
            }
        case '5':
            for(i = 1; i < 5; i++) {
                box = 'bend5_'+ i;
                document.getElementsByName(box)[0].value = 0.0;
            }
            break;
    }
    updatesign();
}


function includeSign(e){
    var sentence = document.getElementById("sentence");
    var word_button = document.createElement("a");
    var sigml = e.getAttribute('data');
    word_button.setAttribute("name", "sign-word");
    word_button.setAttribute("class", "btn btn-sm btn-info text-white");
    word_button.setAttribute("style", "font-size:0.7rem;margin-right: 10px;");
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
    word_button.setAttribute("style", "font-size:0.7rem;margin-right: 10px;");
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
        activateleft();
        updateloctype();
        updatehptype();
        updatelhptype();
    }
}, 3000 ); // end delay