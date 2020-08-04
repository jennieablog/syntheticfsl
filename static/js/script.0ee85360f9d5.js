var xmlString = "<sigml><hamgestural_sign><sign_manual></sign_manual></hamgestural_sign></sigml>";
var parser = new DOMParser();
var xmlDoc = parser.parseFromString(xmlString, "text/xml");
var handconfig = xmlDoc.createElement("handconfig");
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
    document.getElementsByName('specialfingers')[0].value = specialfingers;
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
    document.getElementById("animate").click();
}

function writesigml(sigml){
    console.log(sigml);
    // document.getElementsByName('hello')[0].value = sigml;
    document.getElementById('sigml').innerHTML = sigml;
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
    updatesign();
}, 3000 ); // end delay