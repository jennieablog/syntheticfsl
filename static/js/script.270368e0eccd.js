var xmlString = "<sigml><hamgestural_sign><sign_manual></sign_manual></hamgestural_sign></sigml>";
var parser = new DOMParser();
var xmlDoc = parser.parseFromString(xmlString, "text/xml"); //important to use "text/xml"
var handconfig = xmlDoc.createElement("handconfig");
handconfig.setAttribute("handshape","fist");
handconfig.setAttribute("extfidir", "u");
handconfig.setAttribute("palmor", "d");
// Location

var elements = xmlDoc.getElementsByTagName("sign_manual");
elements[0].appendChild(handconfig);
var serializer = new XMLSerializer();
var theForm;


function initsigml(){
    var sigmltxt = serializer.serializeToString(xmlDoc);
    document.getElementById('sigml').innerHTML = sigmltxt;
    console.log("SIGML init end");
}

function updatesign(){

    theForm = document.forms["handconfig"];

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
    handconfig.setAttribute("specialfingers",specialfingers)

    // Thumb Position
    var selectedThumbpos = theForm.elements["thumbpos"];
    if (selectedThumbpos.value == "None"){
        handconfig.removeAttribute("thumbpos");
    } else {
        handconfig.setAttribute("thumbpos", selectedThumbpos.value);
    }

    // Main Bend
    var selectedMainbend = theForm.elements["mainbend"];
    if (selectedMainbend.value == "None"){
        handconfig.removeAttribute("mainbend");
    } else {
        handconfig.setAttribute("mainbend", selectedMainbend.value);
    }

    // Specific Bending
    var bend1 = document.getElementsByName('bend1');
    var bend2 = document.getElementsByName('bend2');
    var bend3 = document.getElementsByName('bend3');
    var bend4 = document.getElementsByName('bend4');
    var bend5 = document.getElementsByName('bend5');
    var bend1_attr = bend1[0].value+" "+bend1[1].value+" "+bend1[2].value+" "+bend1[3].value+" "+bend1[4].value;
    var bend2_attr = bend2[0].value+" "+bend2[1].value+" "+bend2[2].value+" "+bend2[3].value;
    var bend3_attr = bend3[0].value+" "+bend3[1].value+" "+bend3[2].value+" "+bend3[3].value;
    var bend4_attr = bend4[0].value+" "+bend4[1].value+" "+bend4[2].value+" "+bend4[3].value;
    var bend5_attr = bend5[0].value+" "+bend5[1].value+" "+bend5[2].value+" "+bend5[3].value;
    if (bend1_attr == "0 0 0 0 0") {
    	handconfig.removeAttribute("bend1");
    } else {
    	handconfig.setAttribute("bend1", bend1_attr);
    }
    if (bend2_attr == "0 0 0 0") {
    	handconfig.removeAttribute("bend2");
    } else {
    	handconfig.setAttribute("bend2", bend2_attr);
    }
    if (bend3_attr == "0 0 0 0") {
    	handconfig.removeAttribute("bend3");
    } else {
    	handconfig.setAttribute("bend3", bend3_attr);
    }
    if (bend4_attr == "0 0 0 0") {
    	handconfig.removeAttribute("bend4");
    } else {
    	handconfig.setAttribute("bend4", bend4_attr);
    }
    if (bend5_attr == "0 0 0 0") {
    	handconfig.removeAttribute("bend5");
    } else {
    	handconfig.setAttribute("bend5", bend5_attr);
    }

    // Render animation
    initsigml();
    document.getElementById("animate").click();
}

var delay = ( function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

delay(function(){
    document.getElementById("animate").removeAttribute("disabled");
    document.getElementById("animate").click();
}, 3000 ); // end delay