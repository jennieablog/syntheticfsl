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

function activateleft(e){
    var leftOptions = document.getElementsByName('left');
    if (e.checked) {
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
    }
    else {
        document.getElementById('relative_options').removeAttribute("hidden")
        document.getElementById('split_options').setAttribute("hidden","true")
    }
    reload();
}

function reload(){

    // Initialize xml
    xmlDoc = parser.parseFromString(xmlString, "text/xml");
    var $xml = $( xmlDoc );
    var $sign_manual = $xml.find( "sign_manual" );
        
    var twohanded = document.getElementById('twohanded').checked;

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
        var extfidirSet = document.getElementsByName('extfidir'); 
        for(i = 0; i < extfidirSet.length; i++) {
            if(extfidirSet[i].checked){
                handconfig.setAttribute('extfidir',extfidirSet[i].value)
            }
        }
        var lhandconfig = xmlDoc.getElementsByTagName('handconfig')[1];
        var lextfidirSet = document.getElementsByName('lextfidir'); 
        for(i = 0; i < lextfidirSet.length; i++) {
            if(lextfidirSet[i].checked){
                lhandconfig.setAttribute('extfidir',lextfidirSet[i].value)
            }
        }

        // Palm Orientation
        var palmorSet = document.getElementsByName('palmor'); 
        for(i = 0; i < palmorSet.length; i++) {
            if(palmorSet[i].checked){
                handconfig.setAttribute('palmor',palmorSet[i].value)
            }
        }
        var lpalmorSet = document.getElementsByName('lpalmor'); 
        for(i = 0; i < lpalmorSet.length; i++) {
            if(lpalmorSet[i].checked){
                lhandconfig.setAttribute('palmor',lpalmorSet[i].value)
            }
        }

        // Split location
        $sign_manual.append('<split_location/>');
        var $split_location = $xml.find( "split_location" );

        $split_location.append("<location_bodyarm/>");
        var bodypart = document.getElementById('bodypart');
        var loc = xmlDoc.getElementsByTagName('location_bodyarm')[0];
        loc.setAttribute('location',bodypart.value);
        var side = document.getElementById('side');
        loc.setAttribute('side',side.value);
        var proximity = document.getElementById('proximity');
        loc.setAttribute('contact',proximity.value);

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
        
        // Update hand configuration
        var handshape = document.getElementById('handshape');
        var selected = handshape.options[handshape.selectedIndex].getAttribute('data');
        $sign_manual.append(selected);
        var handconfig = xmlDoc.getElementsByTagName('handconfig')[0];

        // Update external finger direction
        var extfidirSet = document.getElementsByName('extfidir'); 
        for(i = 0; i < extfidirSet.length; i++) {
            if(extfidirSet[i].checked){
                handconfig.setAttribute('extfidir',extfidirSet[i].value)
            }
        }

        // Update palm orientation
        var palmorSet = document.getElementsByName('palmor'); 
        for(i = 0; i < palmorSet.length; i++) {
            if(palmorSet[i].checked){
                handconfig.setAttribute('palmor',palmorSet[i].value)
            }
        }

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
        activateleft(document.getElementById('twohanded'));
    }
}, 3000 ); // end delay