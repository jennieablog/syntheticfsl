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
    
    // ? TWO HANDED ?
    var twohanded = document.getElementById('twohanded').checked;
    
    if (twohanded){

        $sign_manual.append('<split_handconfig/>');
        var $split_handconfig = $xml.find( "split_handconfig" );

        // RIGHT HAND CONFIG
        var handshape = document.getElementById('handshape');
        var selected = handshape.options[handshape.selectedIndex].getAttribute('data');
        $split_handconfig.append(selected);
        var handconfig = xmlDoc.getElementsByTagName('handconfig')[0];
        var extifidir = document.getElementById('extfidir'); 
        handconfig.setAttribute('extfidir', extifidir.value)
        var palmor = document.getElementById('palmor'); 
        handconfig.setAttribute('palmor', palmor.value)

        // LEFT HAND CONFIG
        var lhandshape = document.getElementById('l_handshape');
        var selected = lhandshape.options[lhandshape.selectedIndex].getAttribute('data');
        $split_handconfig.append(selected);
        var lhandconfig = xmlDoc.getElementsByTagName('handconfig')[1];
        var lextifidir = document.getElementById('lextfidir'); 
        lhandconfig.setAttribute('extfidir', lextifidir.value)
        var lpalmor = document.getElementById('lpalmor'); 
        lhandconfig.setAttribute('palmor', lpalmor.value)

        
        // ? SPLIT INITIAL LOCATION ?
        var splitLocation = document.getElementById('split').checked;

        if (splitLocation){

            $sign_manual.append('<split_location/>');
            var $split_location = $xml.find("split_location");

            // RIGHT HAND LOCATION
            $split_location.append("<location_bodyarm/>");
            var bodypart = document.getElementById('bodypart');
            var loc = xmlDoc.getElementsByTagName('location_bodyarm')[0];
            loc.setAttribute('location',bodypart.value);
            var side = document.getElementById('side');
            loc.setAttribute('side',side.value);
            var proximity = document.getElementById('proximity');
            loc.setAttribute('contact',proximity.value);

            // LEFT HAND LOCATION
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

            // HAND CONSTELLATION
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

            // Left Hand Site
            var hptype1 = document.getElementById('hptype1').checked;
            if (hptype1){
                var digits = document.getElementById('digits');
                var fingerpart = document.getElementById('fingerpart');
                var fingerside = document.getElementById('fingerside');
                r_hand.setAttribute('digits',digits.value);
                r_hand.setAttribute('location',fingerpart.value);
                r_hand.setAttribute('side',fingerside.value);
            }
            else {
                var handpart = document.getElementById('handpart');
                var handside = document.getElementById('handside');
                r_hand.setAttribute("location",handpart.value);
                r_hand.setAttribute("side",handside.value);
            }

            // Right Hand Site
            var lhptype1 = document.getElementById('lhptype1').checked;
            if (lhptype1){
                var digits = document.getElementById('ldigits');
                var fingerpart = document.getElementById('lfingerpart');
                var fingerside = document.getElementById('lfingerside');
                l_hand.setAttribute('digits',digits.value);
                l_hand.setAttribute('location',fingerpart.value);
                l_hand.setAttribute('side',fingerside.value);
            }
            else {
                var handpart = document.getElementById('lhandpart');
                var handside = document.getElementById('lhandside');
                l_hand.setAttribute("location",handpart.value);
                l_hand.setAttribute("side",handside.value);
            }

            // Location of Both Hands
            var lrbodypart = document.getElementById('lrbodypart');
            lr_loc.setAttribute('location',lrbodypart.value);
            var lrside = document.getElementById('lrside');
            lr_loc.setAttribute('side',lrside.value);
            var lrproximity = document.getElementById('lrproximity');
            lr_loc.setAttribute('contact',lrproximity.value);
        }

        // 3 -- MOTION
        var motiontypes = document.getElementsByName('motiondefinition');

        // RIGHT HAND MOTION
        var rpt_motion = xmlDoc.createElement("rpt_motion");
        var repeat = document.getElementById('repeat');
        rpt_motion.setAttribute('repetition', repeat.value);
        var tgt_motion = xmlDoc.createElement("tgt_motion");
        rpt_motion.appendChild(tgt_motion);
        var motiontype = document.getElementById('motiontype').value;
        if (motiontype == "directedmotion"){
            var directedmotion = xmlDoc.createElement("directedmotion");
            var manner = document.getElementById('manner');
            directedmotion.setAttribute('manner', manner.value)
            var direction = document.getElementById('direction');
            directedmotion.setAttribute('direction',direction.value);
            var directed_size = document.getElementById('directed_size');
            directedmotion.setAttribute('size',directed_size.value);
            var curve = document.getElementById('curve');
            directedmotion.setAttribute('curve',curve.value);
            var curve_size = document.getElementById('curve_size');
            directedmotion.setAttribute('curve_size',curve_size.value);
            var ellipse_direction = document.getElementById('ellipse_direction');
            directedmotion.setAttribute('ellipse_direction',ellipse_direction.value);
            var zigzag_size = document.getElementById('zigzag_size');
            directedmotion.setAttribute('zigzag_size',zigzag_size.value);
            var zigzag_style = document.getElementById('zigzag_style');
            directedmotion.setAttribute('zigzag_style',zigzag_style.value);
            tgt_motion.appendChild(directedmotion);
        }
        // Circular Motion
        else if (motiontype == "circularmotion"){
            var circularmotion = xmlDoc.createElement("circularmotion");
            var manner = document.getElementById('manner');
            circularmotion.setAttribute('manner', manner.value)
            var axis = document.getElementById('axis');
            circularmotion.setAttribute('axis',axis.value);
            var circular_size = document.getElementById('circular_size');
            circularmotion.setAttribute('size',circular_size.value);
            var start = document.getElementById('start');
            circularmotion.setAttribute('start',start.value);
            tgt_motion.appendChild(circularmotion);
        }
        // Wrist Motion
        else if (motiontype == "wristmotion") {
            var wristmotion = xmlDoc.createElement("wristmotion");
            var manner = document.getElementById('manner');
            wristmotion.setAttribute('manner', manner.value);
            var motion = document.getElementById('motion');
            wristmotion.setAttribute('motion', motion.value);
            var wristmotion_size = document.getElementById('wristmotion_size');
            wristmotion.setAttribute('size', wristmotion_size.value);
            tgt_motion.appendChild(wristmotion);
        }
        // Finger Play
        else if (motiontype == "fingerplay") {
            var fingerplay = xmlDoc.createElement("fingerplay");
            var manner = document.getElementById('manner');
            fingerplay.setAttribute('manner', manner.value);
            tgt_motion.appendChild(fingerplay);
        }


        // RIGHT FINAL HAND CONFIG
        var toChangeConfig = document.getElementById('changeconfig').checked;
        if (toChangeConfig) {
            var finalhandshape = document.getElementById('finalhandshape');
            var finalselected = finalhandshape.options[finalhandshape.selectedIndex].getAttribute('data');
            finalhandconfig = parser.parseFromString(finalselected, "text/xml");
            finalhandconfig = finalhandconfig.firstElementChild;
            var finalextifidir = document.getElementById('finalextfidir');
            finalhandconfig.setAttribute('extfidir', finalextfidir.value);
            var finalpalmor = document.getElementById('finalpalmor'); 
            finalhandconfig.setAttribute('palmor', finalpalmor.value)
            tgt_motion.appendChild(finalhandconfig);
        }


        // ? SPLIT MOTION DEFINITION ?
        if (motiontypes[0].checked) {

            // LEFT HAND MOTION
            var lrpt_motion = xmlDoc.createElement("rpt_motion");
            var lrepeat = document.getElementById('lrepeat');
            lrpt_motion.setAttribute('repetition', lrepeat.value);
            var ltgt_motion = xmlDoc.createElement("tgt_motion");
            lrpt_motion.appendChild(ltgt_motion);
            var lmotiontype = document.getElementById('lmotiontype').value;
            if (lmotiontype == "directedmotion"){
                var ldirectedmotion = xmlDoc.createElement("directedmotion");
                var lmanner = document.getElementById('lmanner');
                ldirectedmotion.setAttribute('manner', lmanner.value)
                var ldirection = document.getElementById('ldirection');
                ldirectedmotion.setAttribute('direction',ldirection.value);
                var ldirected_size = document.getElementById('ldirected_size');
                ldirectedmotion.setAttribute('size',ldirected_size.value);
                var lcurve = document.getElementById('lcurve');
                ldirectedmotion.setAttribute('curve',lcurve.value);
                var lcurve_size = document.getElementById('lcurve_size');
                ldirectedmotion.setAttribute('curve_size',lcurve_size.value);
                var lellipse_direction = document.getElementById('lellipse_direction');
                ldirectedmotion.setAttribute('ellipse_direction',lellipse_direction.value);
                var lzigzag_size = document.getElementById('lzigzag_size');
                ldirectedmotion.setAttribute('zigzag_size',lzigzag_size.value);
                var lzigzag_style = document.getElementById('lzigzag_style');
                ldirectedmotion.setAttribute('zigzag_style',lzigzag_style.value);
                ltgt_motion.appendChild(ldirectedmotion);
            }
            // Circular Motion
            else if (lmotiontype == "circularmotion"){
                var lcircularmotion = xmlDoc.createElement("circularmotion");
                var lmanner = document.getElementById('lmanner');
                lcircularmotion.setAttribute('manner', lmanner.value)
                var laxis = document.getElementById('laxis');
                lcircularmotion.setAttribute('axis',laxis.value);
                var lcircular_size = document.getElementById('lcircular_size');
                lcircularmotion.setAttribute('size',lcircular_size.value);
                var lstart = document.getElementById('lstart');
                lcircularmotion.setAttribute('start',lstart.value);
                ltgt_motion.appendChild(lcircularmotion);
            }
            // Wrist Motion
            else if (lmotiontype == "wristmotion") {
                var lwristmotion = xmlDoc.createElement("wristmotion");
                var lmanner = document.getElementById('lmanner');
                lwristmotion.setAttribute('manner', lmanner.value);
                var lmotion = document.getElementById('lmotion');
                lwristmotion.setAttribute('motion', lmotion.value);
                var lwristmotion_size = document.getElementById('lwristmotion_size');
                lwristmotion.setAttribute('size', lwristmotion_size.value);
                ltgt_motion.appendChild(lwristmotion);
            }
            // Finger Play
            else if (lmotiontype == "fingerplay") {
                var lfingerplay = xmlDoc.createElement("fingerplay");
                var lmanner = document.getElementById('lmanner');
                lfingerplay.setAttribute('manner', lmanner.value);
                ltgt_motion.appendChild(lfingerplay);
            }

            // LEFT HAND CONFIG
            var ltoChange = document.getElementById('lchangeconfig').checked;
            if (ltoChange) {
                var lfinalhandshape = document.getElementById('lfinalhandshape');
                var lfinalselected = lfinalhandshape.options[lfinalhandshape.selectedIndex].getAttribute('data');
                lfinalhandconfig = parser.parseFromString(lfinalselected, "text/xml");
                lfinalhandconfig = lfinalhandconfig.firstElementChild;
                var lfinalextifidir = document.getElementById('lfinalextfidir');
                lfinalhandconfig.setAttribute('extfidir', lfinalextfidir.value);
                var lfinalpalmor = document.getElementById('lfinalpalmor'); 
                lfinalhandconfig.setAttribute('palmor', lfinalpalmor.value)
                ltgt_motion.appendChild(lfinalhandconfig);
            }

            $sign_manual.append('<split_motion/>');
            var split_motion = $xml.find( "split_motion" );
            split_motion.append($(rpt_motion));
            split_motion.append($(lrpt_motion));

            // ? SPLIT FINAL LOCATION ?
            var toChangeLoc = document.getElementById('changeloc').checked;
            var finalSplitLocation = document.getElementById('finalsplit').checked;
            
            if (toChangeLoc) {
                // ? SPLIT LOCATION ?
                if (finalSplitLocation){
                    // Split Location For Right Hand
                    var final_location_bodyarm = xmlDoc.createElement("location_bodyarm");
                    var finalbodypart = document.getElementById('finalbodypart');
                    var finalside = document.getElementById('finalside');
                    var finalproximity = document.getElementById('finalproximity');
                    final_location_bodyarm.setAttribute('location',finalbodypart.value);
                    final_location_bodyarm.setAttribute('side',finalside.value);
                    final_location_bodyarm.setAttribute('contact',finalproximity.value);
                    $xml.find("tgt_motion")[0].appendChild(final_location_bodyarm);
                    // Final Location
                    var lfinal_location_bodyarm = xmlDoc.createElement("location_bodyarm");
                    var lfinalbodypart = document.getElementById('lfinalbodypart');
                    var lfinalside = document.getElementById('lfinalside');
                    var lfinalproximity = document.getElementById('lfinalproximity');
                    lfinal_location_bodyarm.setAttribute('location',lfinalbodypart.value);
                    lfinal_location_bodyarm.setAttribute('side',lfinalside.value);
                    lfinal_location_bodyarm.setAttribute('contact',lfinalproximity.value);
                    $xml.find("tgt_motion")[1].appendChild(lfinal_location_bodyarm);
                }
                // ? HAND CONSTELLATION ?
                else {
                    // LEFT HAND SITE
                    var final_relative_location = xmlDoc.createElement("handconstellation");
                    var finallrproximity_rel = document.getElementById('finallrproximity_rel');
                    final_relative_location.setAttribute("contact",finallrproximity_rel.value);
                    var finalr_hand = xmlDoc.createElement("location_hand");
                    var finalhptype1 = document.getElementById('finalhptype1').checked;
                    // Finger Part
                    if (finalhptype1){
                        var finaldigits = document.getElementById('finaldigits');
                        var finalfingerpart = document.getElementById('finalfingerpart');
                        var finalfingerside = document.getElementById('finalfingerside');
                        finalr_hand.setAttribute('digits',finaldigits.value);
                        finalr_hand.setAttribute('location',finalfingerpart.value);
                        finalr_hand.setAttribute('side',finalfingerside.value);
                    }
                    // Hand Part
                    else {
                        var finalhandpart = document.getElementById('finalhandpart');
                        var finalhandside = document.getElementById('finalhandside');
                        finalr_hand.setAttribute("location",finalhandpart.value);
                        finalr_hand.setAttribute("side", finalhandside.value);
                    }
                    // RIGHT HAND SITE
                    final_relative_location.appendChild(finalr_hand);
                    var finall_hand = xmlDoc.createElement("location_hand");
                    var lfinalhptype1 = document.getElementById('lfinalhptype1').checked;
                    // Finger Part
                    if (lfinalhptype1){
                        var lfinaldigits = document.getElementById('lfinaldigits');
                        var lfinalfingerpart = document.getElementById('lfinalfingerpart');
                        var lfinalfingerside = document.getElementById('lfinalfingerside');
                        finall_hand.setAttribute('digits',lfinaldigits.value);
                        finall_hand.setAttribute('location',lfinalfingerpart.value);
                        finall_hand.setAttribute('side',lfinalfingerside.value);
                    }
                    // Hand Part
                    else {
                        var lfinalhandpart = document.getElementById('lfinalhandpart');
                        var lfinalhandside = document.getElementById('lfinalhandside');
                        finall_hand.setAttribute("location",lfinalhandpart.value);
                        finall_hand.setAttribute("side",lfinalhandside.value);
                    }
                    final_relative_location.appendChild(finall_hand);
                    // LOCATION OF BOTH HANDS
                    var finallr_loc = xmlDoc.createElement("location_bodyarm");
                    var finallrbodypart = document.getElementById('finallrbodypart');
                    finallr_loc.setAttribute('location',finallrbodypart.value);
                    var finallrside = document.getElementById('finallrside');
                    finallr_loc.setAttribute('side',finallrside.value);
                    var finallrproximity = document.getElementById('finallrproximity');
                    finallr_loc.setAttribute('contact',finallrproximity.value);
                    final_relative_location.appendChild(finallr_loc);
                    $xml.find("tgt_motion").append(final_relative_location);
                }
            }

        }

        // SYMMETRIC MOTION
        else {
            $sign_manual.append($(rpt_motion));
            var sm = xmlDoc.getElementsByTagName('sign_manual')[0];
            sm.setAttribute('lr_symm','true');
            // In Phase
            if (motiontypes[1].checked) {
                sm.removeAttribute('outofphase');
            }
            // Out of Phase
            else {
                sm.setAttribute('outofphase','true');
            }

            // ? SPLIT FINAL LOCATION ?
            var toChangeLoc = document.getElementById('changeloc').checked;
            var finalSplitLocation = document.getElementById('finalsplit').checked;
            
            if (toChangeLoc) {
                // ? SPLIT LOCATION ?
                if (finalSplitLocation){
                    // Split Location For Right Hand
                    var final_location_bodyarm = xmlDoc.createElement("location_bodyarm");
                    var finalbodypart = document.getElementById('finalbodypart');
                    var finalside = document.getElementById('finalside');
                    var finalproximity = document.getElementById('finalproximity');
                    final_location_bodyarm.setAttribute('location',finalbodypart.value);
                    final_location_bodyarm.setAttribute('side',finalside.value);
                    final_location_bodyarm.setAttribute('contact',finalproximity.value);
                    $xml.find("tgt_motion")[0].appendChild(final_location_bodyarm);
                }
                else {
                    // LEFT HAND SITE
                    var final_relative_location = xmlDoc.createElement("handconstellation");
                    var finallrproximity_rel = document.getElementById('finallrproximity_rel');
                    final_relative_location.setAttribute("contact",finallrproximity_rel.value);
                    var finalr_hand = xmlDoc.createElement("location_hand");
                    var finalhptype1 = document.getElementById('finalhptype1').checked;
                    // Finger Part
                    if (finalhptype1){
                        var finaldigits = document.getElementById('finaldigits');
                        var finalfingerpart = document.getElementById('finalfingerpart');
                        var finalfingerside = document.getElementById('finalfingerside');
                        finalr_hand.setAttribute('digits',finaldigits.value);
                        finalr_hand.setAttribute('location',finalfingerpart.value);
                        finalr_hand.setAttribute('side',finalfingerside.value);
                    }
                    // Hand Part
                    else {
                        var finalhandpart = document.getElementById('finalhandpart');
                        var finalhandside = document.getElementById('finalhandside');
                        finalr_hand.setAttribute("location",finalhandpart.value);
                        finalr_hand.setAttribute("side", finalhandside.value);
                    }
                    // RIGHT HAND SITE
                    final_relative_location.appendChild(finalr_hand);
                    var finall_hand = xmlDoc.createElement("location_hand");
                    var lfinalhptype1 = document.getElementById('lfinalhptype1').checked;
                    // Finger Part
                    if (lfinalhptype1){
                        var lfinaldigits = document.getElementById('lfinaldigits');
                        var lfinalfingerpart = document.getElementById('lfinalfingerpart');
                        var lfinalfingerside = document.getElementById('lfinalfingerside');
                        finall_hand.setAttribute('digits',lfinaldigits.value);
                        finall_hand.setAttribute('location',lfinalfingerpart.value);
                        finall_hand.setAttribute('side',lfinalfingerside.value);
                    }
                    // Hand Part
                    else {
                        var lfinalhandpart = document.getElementById('lfinalhandpart');
                        var lfinalhandside = document.getElementById('lfinalhandside');
                        finall_hand.setAttribute("location",lfinalhandpart.value);
                        finall_hand.setAttribute("side",lfinalhandside.value);
                    }
                    final_relative_location.appendChild(finall_hand);
                    // LOCATION OF BOTH HANDS
                    var finallr_loc = xmlDoc.createElement("location_bodyarm");
                    var finallrbodypart = document.getElementById('finallrbodypart');
                    finallr_loc.setAttribute('location',finallrbodypart.value);
                    var finallrside = document.getElementById('finallrside');
                    finallr_loc.setAttribute('side',finallrside.value);
                    var finallrproximity = document.getElementById('finallrproximity');
                    finallr_loc.setAttribute('contact',finallrproximity.value);
                    final_relative_location.appendChild(finallr_loc);
                    $xml.find("tgt_motion")[0].appendChild(final_relative_location);
                }
            }
        }
    }

    // ONE HANDED
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

        // SPLIT MOTION XML SKELETON
        $sign_manual.append('<rpt_motion/>');
        var $rpt_motion = $xml.find("rpt_motion");
        $rpt_motion.append('<tgt_motion/>');
        // Repetition
        var rrpt = xmlDoc.getElementsByTagName('rpt_motion')[0];
        var repeat = document.getElementById('repeat');
        rrpt.setAttribute('repetition',repeat.value);
        
        var motiontype = document.getElementById('motiontype').value;
        if (motiontype == "directedmotion"){
            var directedmotion = xmlDoc.createElement("directedmotion");
            var manner = document.getElementById('manner');
            directedmotion.setAttribute('manner', manner.value)
            var direction = document.getElementById('direction');
            directedmotion.setAttribute('direction',direction.value);
            var directed_size = document.getElementById('directed_size');
            directedmotion.setAttribute('size',directed_size.value);
            var curve = document.getElementById('curve');
            directedmotion.setAttribute('curve',curve.value);
            var curve_size = document.getElementById('curve_size');
            directedmotion.setAttribute('curve_size',curve_size.value);
            var ellipse_direction = document.getElementById('ellipse_direction');
            directedmotion.setAttribute('ellipse_direction',ellipse_direction.value);
            var zigzag_size = document.getElementById('zigzag_size');
            directedmotion.setAttribute('zigzag_size',zigzag_size.value);
            var zigzag_style = document.getElementById('zigzag_style');
            directedmotion.setAttribute('zigzag_style',zigzag_style.value);
            $xml.find("tgt_motion")[0].appendChild(directedmotion);
        }
        // Circular Motion
        else if (motiontype == "circularmotion"){
            var circularmotion = xmlDoc.createElement("circularmotion");
            var manner = document.getElementById('manner');
            circularmotion.setAttribute('manner', manner.value)
            var axis = document.getElementById('axis');
            circularmotion.setAttribute('axis',axis.value);
            var circular_size = document.getElementById('circular_size');
            circularmotion.setAttribute('size',circular_size.value);
            var start = document.getElementById('start');
            circularmotion.setAttribute('start',start.value);
            $xml.find("tgt_motion")[0].appendChild(circularmotion);
        }
        // Wrist Motion
        else if (motiontype == "wristmotion") {
            var wristmotion = xmlDoc.createElement("wristmotion");
            var manner = document.getElementById('manner');
            wristmotion.setAttribute('manner', manner.value);
            var motion = document.getElementById('motion');
            wristmotion.setAttribute('motion', motion.value);
            var wristmotion_size = document.getElementById('wristmotion_size');
            wristmotion.setAttribute('size', wristmotion_size.value);
            $xml.find("tgt_motion")[0].appendChild(wristmotion);
        }
        // Finger Play
        else if (motiontype == "fingerplay") {
            var fingerplay = xmlDoc.createElement("fingerplay");
            var manner = document.getElementById('manner');
            fingerplay.setAttribute('manner', manner.value);
            $xml.find("tgt_motion")[0].appendChild(fingerplay);
        }

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
    document.getElementById('split').checked = true;
    document.getElementById('split_options').removeAttribute("hidden");
    document.getElementById('relative_options').setAttribute("hidden","true");

    document.getElementById('finalsplit').checked = true;
    document.getElementById('finalsplit_options').removeAttribute("hidden");
    document.getElementById('finalrelative_options').setAttribute("hidden","true");



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
    }
    else {
        document.getElementById('relative_options').removeAttribute("hidden")
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

function updatemotiontype(){
    var motiontype = document.getElementById('motiontype');
    switch(motiontype.value){
        case 'nomotion':
            document.getElementById('directedmotion').setAttribute("hidden","true");
            document.getElementById('circularmotion').setAttribute("hidden","true");
            document.getElementById('wristmotion').setAttribute("hidden","true");
            break;
        case 'changeposture':
            document.getElementById('directedmotion').setAttribute("hidden","true");
            document.getElementById('circularmotion').setAttribute("hidden","true");
            document.getElementById('wristmotion').setAttribute("hidden","true");
            break;
        case 'directedmotion':
            document.getElementById('directedmotion').removeAttribute("hidden");
            document.getElementById('circularmotion').setAttribute("hidden","true");
            document.getElementById('wristmotion').setAttribute("hidden","true");
            break;
        case 'circularmotion':
            document.getElementById('circularmotion').removeAttribute("hidden");
            document.getElementById('directedmotion').setAttribute("hidden","true");
            document.getElementById('wristmotion').setAttribute("hidden","true");
            break;
        case 'wristmotion':
            document.getElementById('wristmotion').removeAttribute("hidden");
            document.getElementById('directedmotion').setAttribute("hidden","true");
            document.getElementById('circularmotion').setAttribute("hidden","true");
            break;
        case 'fingerplay':
            document.getElementById('directedmotion').setAttribute("hidden","true");
            document.getElementById('circularmotion').setAttribute("hidden","true");
            document.getElementById('wristmotion').setAttribute("hidden","true");
            break;
    }
    reload();
}

function updateleftmotiontype(){
    var motiontype = document.getElementById('lmotiontype');
    switch(motiontype.value){
        case 'nomotion':
            document.getElementById('ldirectedmotion').setAttribute("hidden","true");
            document.getElementById('lcircularmotion').setAttribute("hidden","true");
            document.getElementById('lwristmotion').setAttribute("hidden","true");
            break;
        case 'changeposture':
            document.getElementById('ldirectedmotion').setAttribute("hidden","true");
            document.getElementById('lcircularmotion').setAttribute("hidden","true");
            document.getElementById('lwristmotion').setAttribute("hidden","true");
            break;
        case 'directedmotion':
            document.getElementById('ldirectedmotion').removeAttribute("hidden");
            document.getElementById('lcircularmotion').setAttribute("hidden","true");
            document.getElementById('lwristmotion').setAttribute("hidden","true");
            break;
        case 'circularmotion':
            document.getElementById('lcircularmotion').removeAttribute("hidden");
            document.getElementById('ldirectedmotion').setAttribute("hidden","true");
            document.getElementById('lwristmotion').setAttribute("hidden","true");
            break;
        case 'wristmotion':
            document.getElementById('lwristmotion').removeAttribute("hidden");
            document.getElementById('ldirectedmotion').setAttribute("hidden","true");
            document.getElementById('lcircularmotion').setAttribute("hidden","true");
            break;
        case 'fingerplay':
            document.getElementById('ldirectedmotion').setAttribute("hidden","true");
            document.getElementById('lcircularmotion').setAttribute("hidden","true");
            document.getElementById('lwristmotion').setAttribute("hidden","true");
            break;
    }
    reload();
}

function updatemotiondefinition(){
    var motiondefinitions = document.getElementsByName('motiondefinition')
    if (motiondefinitions[0].checked) {
        document.getElementById('leftmotion').removeAttribute("hidden");
        document.getElementById('lfinalHandConfig').removeAttribute("hidden");
        updateleftmotiontype();
        document.getElementById('finalsplit_options_left_1').removeAttribute("hidden");
        document.getElementById('finalsplit_options_left_2').removeAttribute("hidden");
        updatefinallocation();
    }
    else {
        document.getElementById('leftmotion').setAttribute("hidden","true");
        document.getElementById('ldirectedmotion').setAttribute("hidden","true");
        document.getElementById('lcircularmotion').setAttribute("hidden","true");
        document.getElementById('lwristmotion').setAttribute("hidden","true");
        // Hide left final config
        document.getElementById('lfinalHandConfig').setAttribute("hidden","true");
        document.getElementById('ldontchangeconfig').checked = true;
        document.getElementById('lfinalHandConfigOptions').setAttribute("hidden","true");
        // Disable split final config
        document.getElementById('finalsplit_options_left_1').setAttribute("hidden","true");
        document.getElementById('finalsplit_options_left_2').setAttribute("hidden","true");

    }
    reload();
}

function updatefinalhandconfig(){
    var isFinal = document.getElementsByName('changeconfig')
    if (isFinal[0].checked) {
        document.getElementById('finalHandConfigOptions').removeAttribute("hidden");
    }
    else {
        document.getElementById('finalHandConfigOptions').setAttribute("hidden","true");
    }
    reload();
}

function updateleftfinalhandconfig(){
    var isFinal = document.getElementsByName('lchangeconfig')
    if (isFinal[0].checked) {
        document.getElementById('lfinalHandConfigOptions').removeAttribute("hidden");
    }
    else {
        document.getElementById('lfinalHandConfigOptions').setAttribute("hidden","true");
    }
    reload();
}

function updatefinallocation(){
    var isFinal = document.getElementsByName('changeloc')
    if (isFinal[0].checked) {
        document.getElementById('finalLocOptions').removeAttribute("hidden");
    }
    else {
        document.getElementById('finalLocOptions').setAttribute("hidden","true");
    }
    reload();
}

function updatefinalloctype(){
    var loctypes = document.getElementsByName('finalloctype');
    if (loctypes[0].checked) {
        document.getElementById('finalsplit_options').removeAttribute("hidden")
        document.getElementById('finalrelative_options').setAttribute("hidden","true")
    }
    else {
        document.getElementById('finalrelative_options').removeAttribute("hidden")
        document.getElementById('finalsplit_options').setAttribute("hidden","true")
    }
    reload();
}

function updatefinalhptype(){
    var hptypes = document.getElementsByName('finalhptype');
    if (hptypes[0].checked) {
        document.getElementById('finalfingerpart_options').removeAttribute("hidden")
        document.getElementById('finalhandpart_options').setAttribute("hidden","true")
    }
    else {
        document.getElementById('finalhandpart_options').removeAttribute("hidden")
        document.getElementById('finalfingerpart_options').setAttribute("hidden","true")
    }
}

function updatelfinalhptype(){
    var hptypes = document.getElementsByName('lfinalhptype');
    if (hptypes[0].checked) {
        document.getElementById('lfinalfingerpart_options').removeAttribute("hidden")
        document.getElementById('lfinalhandpart_options').setAttribute("hidden","true")
    }
    else {
        document.getElementById('lfinalhandpart_options').removeAttribute("hidden")
        document.getElementById('lfinalfingerpart_options').setAttribute("hidden","true")
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

function updatemotion(){
    console.log("HELLOS");
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
        updatemotiondefinition();
        updatemotiontype();
    }
    document.getElementById("loading").innerHTML = "JASigning Avatar"
    document.getElementById("animate").click();
}, 3000 ); // end delay