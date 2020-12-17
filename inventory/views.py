from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

# To have access to our Handshapes.
from .models import Handshape, Sign
# To help us rearrange posts according to publishing date.
from django.utils import timezone
 # To render templates and get existing objects.
from django.shortcuts import render, get_object_or_404, redirect
# To authorize users before editing/posting/deleting handshapes
from django.contrib.auth.decorators import login_required
# For ajax
from django.template.loader import render_to_string
from django.http import JsonResponse

from django.db.models import Q

# Display index.
def index(request):
	return render(request, 'inventory/index.html')

# List all handshapes.
def handshape_list(request):
	handshapes = Handshape.objects.all()
	context = { 'handshapes' : handshapes }

	return render(request, 'inventory/handshape_list.html', context)

# Edit a handshape.
@login_required
def handshape_edit(request, pk):

	if request.method == "POST":

		hs = Handshape.objects.get(id=pk)

		hs.name = request.POST.get("handshapeName")
		hs.description = request.POST.get("handshapeDescription")
		hs.handshape = request.POST.get("selectedHandshape")
		hs.thumbpos = request.POST.get("thumbpos")
		hs.mainbend = request.POST.get("mainbend")
		hs.specialfingers = request.POST.get("specialfingers")

		hs.bend1_1 = request.POST.get("bend1_1")
		hs.bend1_2 = request.POST.get("bend1_2")
		hs.bend1_3 = request.POST.get("bend1_3")
		hs.bend1_4 = request.POST.get("bend1_4")
		hs.bend1_5 = request.POST.get("bend1_5")

		hs.bend2_1 = request.POST.get("bend2_1")
		hs.bend2_2 = request.POST.get("bend2_2")
		hs.bend2_3 = request.POST.get("bend2_3")
		hs.bend2_4 = request.POST.get("bend2_4")
		
		hs.bend3_1 = request.POST.get("bend3_1")
		hs.bend3_2 = request.POST.get("bend3_2")
		hs.bend3_3 = request.POST.get("bend3_3")
		hs.bend3_4 = request.POST.get("bend3_4")

		hs.bend4_1 = request.POST.get("bend4_1")
		hs.bend4_2 = request.POST.get("bend4_2")
		hs.bend4_3 = request.POST.get("bend4_3")
		hs.bend4_4 = request.POST.get("bend4_4")

		hs.bend5_1 = request.POST.get("bend5_1")
		hs.bend5_2 = request.POST.get("bend5_2")
		hs.bend5_3 = request.POST.get("bend5_3")
		hs.bend5_4 = request.POST.get("bend5_4")

		hs.sigml = hs.sigmlfy()

		hs.save();
		return redirect('handshape_list')

	handshape = Handshape.objects.get(id=pk)
	context = {'handshape' : handshape}
	return render(request, 'inventory/handshape_edit.html', context)

# Create a new handshape. 
@login_required
def handshape_new(request):

	if request.method == "POST":

		print(request.POST)
		name = request.POST.get("handshapeName")
		description = request.POST.get("handshapeDescription")
		handshape = request.POST.get("selectedHandshape")
		thumbpos = request.POST.get("thumbpos")
		mainbend = request.POST.get("mainbend")
		specialfingers = request.POST.get("specialfingers")

		bend1_1 = request.POST.get("bend1_1")
		bend1_2 = request.POST.get("bend1_2")
		bend1_3 = request.POST.get("bend1_3")
		bend1_4 = request.POST.get("bend1_4")
		bend1_5 = request.POST.get("bend1_5")

		bend2_1 = request.POST.get("bend2_1")
		bend2_2 = request.POST.get("bend2_2")
		bend2_3 = request.POST.get("bend2_3")
		bend2_4 = request.POST.get("bend2_4")
		
		bend3_1 = request.POST.get("bend3_1")
		bend3_2 = request.POST.get("bend3_2")
		bend3_3 = request.POST.get("bend3_3")
		bend3_4 = request.POST.get("bend3_4")

		bend4_1 = request.POST.get("bend4_1")
		bend4_2 = request.POST.get("bend4_2")
		bend4_3 = request.POST.get("bend4_3")
		bend4_4 = request.POST.get("bend4_4")

		bend5_1 = request.POST.get("bend5_1")
		bend5_2 = request.POST.get("bend5_2")
		bend5_3 = request.POST.get("bend5_3")
		bend5_4 = request.POST.get("bend5_4")

		hs = Handshape(name=name,description=description,handshape=handshape,thumbpos=thumbpos,mainbend=mainbend,specialfingers=specialfingers,bend1_1=bend1_1,bend1_2=bend1_2,bend1_3=bend1_3,bend1_4=bend1_4,bend1_5=bend1_5,bend2_1=bend2_1,bend2_2=bend2_2,bend2_3=bend2_3,bend2_4=bend2_4,bend3_1=bend3_1,bend3_2=bend3_2,bend3_3=bend3_3,bend3_4=bend3_4,bend4_1=bend4_1,bend4_2=bend4_2,bend4_3=bend4_3,bend4_4=bend4_4,bend5_1=bend5_1,bend5_2=bend5_2,bend5_3=bend5_3,bend5_4=bend5_4)
		hs.sigml = hs.sigmlfy()
		hs.save();
		return redirect('handshape_list')
	return render(request, 'inventory/handshape_new.html')

# Delete a handshape.
@login_required
def handshape_delete(request,pk):
	handshape = get_object_or_404(Handshape, id=pk)
	handshape.delete()
	return redirect('handshape_list')

# List all signs.
def sign_list(request):
	signs = Sign.objects.all()
	context = {'signs' : signs}
	return render(request, 'inventory/sign_list.html', context)

# Create a new sign. 
@login_required
def sign_new(request):

	handshapes = Handshape.objects.all()
	context = {'handshapes' : handshapes}
	if request.method == "POST":
		print(request.POST)
		
		# Name
		name = request.POST.get('signName')
		
		# Description
		description = request.POST.get('signDescription')

		# Two Handed
		signtype = request.POST.get('signtype')
		if signtype == 'twohanded':
			twoHanded = True;
		else:
			twoHanded = False;

		# Right Hand
		rightHandshape = request.POST.get('handshape')
		rightFingerDirection = request.POST.get('extfidir')
		rightPalmOrientation = request.POST.get('palmor')
		leftHandshape = request.POST.get('l_handshape')
		leftFingerDirection = request.POST.get('lextfidir')
		leftPalmOrientation = request.POST.get('lpalmor')

		# Location Definition
		locationType = request.POST.get('loctype')

		# Split Location
		rightLocation = request.POST.get('bodypart')
		rightLocationSide = request.POST.get('side')
		rightLocationContact = request.POST.get('proximity')
		leftLocation = request.POST.get('lbodypart')
		leftLocationSide = request.POST.get('lside')
		leftLocationContact = request.POST.get('lproximity')

		# Hand Constellation
		constellationContact = request.POST.get('lrproximity_rel')
		constellationLocation = request.POST.get('lrbodypart')
		constellationLocationSide = request.POST.get('lrside')
		constellationLocationContact = request.POST.get('lrproximity')
		rightContactType = request.POST.get('hptype')
		if (rightContactType == "fingerpart"):
			rightContactFinger = request.POST.get('digits')
			rightContactPart = request.POST.get('fingerpart')
			rightContactSide = request.POST.get('fingerside')
		else:
			rightContactFinger = ""
			rightContactPart = request.POST.get('handpart')
			rightContactSide = request.POST.get('handside')
		leftContactType = request.POST.get('lhptype')
		if (leftContactType == "fingerpart"):
			leftContactFinger = request.POST.get('ldigits')
			leftContactPart = request.POST.get('lfingerpart')
			leftContactSide = request.POST.get('lfingerside')
		else:
			leftContactFinger = ""
			leftContactPart = request.POST.get('lhandpart')
			leftContactSide = request.POST.get('lhandside')

		sigml = request.POST.get('sigml')

		sign = Sign(
			name=name,
			description=description,
			twoHanded=twoHanded,
			rightHandshape=Handshape.objects.get(id=rightHandshape),
			rightFingerDirection=rightFingerDirection,
			rightPalmOrientation=rightPalmOrientation,
			leftHandshape=Handshape.objects.get(id=leftHandshape),
			leftFingerDirection=leftFingerDirection,
			leftPalmOrientation=leftPalmOrientation,
			locationType=locationType,
			rightLocation=rightLocation,
			rightLocationSide=rightLocationSide,
			rightLocationContact=rightLocationContact,
			leftLocation=leftLocation,
			leftLocationSide=leftLocationSide,
			leftLocationContact=leftLocationContact,
			constellationContact=constellationContact,
			constellationLocation=constellationLocation,
			constellationLocationSide=constellationLocationSide,
			constellationLocationContact=constellationLocationContact,
			rightContactType=rightContactType,
			leftContactType=leftContactType,
			rightContactFinger=rightContactFinger,
			rightContactPart=rightContactPart,
			rightContactSide=rightContactSide,
			leftContactFinger=leftContactFinger,
			leftContactPart=leftContactPart,
			leftContactSide=leftContactSide,
			sigml=sigml,
		)

		sign.rightMotionSequence = request.POST.getlist("rightSeq");
		sign.rightMotionTags = request.POST.getlist("rightSeqMotionTag");
		sign.rightTargetConfigs = request.POST.getlist("rightSeqTargetConfig");
		sign.rightTargetLocs = request.POST.getlist("rightSeqTargetLoc");

		sign.leftMotionSequence = request.POST.getlist("left_Seq");
		sign.leftMotionTags = request.POST.getlist("left_SeqMotionTag");
		sign.leftTargetConfigs = request.POST.getlist("left_SeqTargetConfig");
		sign.leftTargetLocs = request.POST.getlist("left_SeqTargetLoc");

		nondom = request.POST.get('nondom');
		if nondom == "true":
			sign.nondom = True;

		motionType = request.POST.get("motiondefinition");
		if motionType == None:
			motionType = 'split'
		sign.motionType = motionType;
		if motionType == "symmetric":
			sign.symmetry = request.POST.get("symmetry");
			outofphase = request.POST.get("outofphase");
			if outofphase == "true":
				sign.outofphase = True;
			else:
				sign.outofphase = False;
		else:
			sign.symmetry = "none"

		sign.save();
		return redirect('sign_list')
	return render(request, 'inventory/sign_new.html', context)

# Edit a sign.
@login_required
def sign_edit(request, pk):

	sign = Sign.objects.get(id=pk)

	if request.method == "POST":
		
		# print(request.POST);
		# print(request.POST.getlist("rightSeq"));

		# General Information
		sign.name = request.POST.get('signName')
		sign.description = request.POST.get('signDescription')

		# Two Handed
		signtype = request.POST.get('signtype')
		if signtype == 'twohanded':
			sign.twoHanded = True;
		else:
			sign.twoHanded = False;

		# Initial Configuration
		sign.rightHandshape = Handshape.objects.get(id=request.POST.get('handshape'))
		sign.rightFingerDirection = request.POST.get('extfidir')
		sign.rightPalmOrientation = request.POST.get('palmor')
		sign.leftHandshape = Handshape.objects.get(id=request.POST.get('l_handshape'))
		sign.leftFingerDirection = request.POST.get('lextfidir')
		sign.leftPalmOrientation = request.POST.get('lpalmor')

		# Location Definition
		sign.locationType = request.POST.get('loctype')

		# Split Location
		sign.rightLocation = request.POST.get('bodypart')
		sign.rightLocationSide = request.POST.get('side')
		sign.rightLocationContact = request.POST.get('proximity')
		sign.leftLocation = request.POST.get('lbodypart')
		sign.leftLocationSide = request.POST.get('lside')
		sign.leftLocationContact = request.POST.get('lproximity')

		# Hand Constellation
		sign.constellationContact = request.POST.get('lrproximity_rel')
		sign.constellationLocation = request.POST.get('lrbodypart')
		sign.constellationLocationSide = request.POST.get('lrside')
		sign.constellationLocationContact = request.POST.get('lrproximity')

		sign.rightContactType = request.POST.get('hptype')
		if (sign.rightContactType == "fingerpart"):
			sign.rightContactFinger = request.POST.get('digits')
			sign.rightContactPart = request.POST.get('fingerpart')
			sign.rightContactSide = request.POST.get('fingerside')
		else:
			sign.rightContactFinger = ""
			sign.rightContactPart = request.POST.get('handpart')
			sign.rightContactSide = request.POST.get('handside')

		sign.leftContactType = request.POST.get('lhptype')
		if (sign.leftContactType == "fingerpart"):
			sign.leftContactFinger = request.POST.get('ldigits')
			sign.leftContactPart = request.POST.get('lfingerpart')
			sign.leftContactSide = request.POST.get('lfingerside')
		else:
			sign.leftContactFinger = ""
			sign.leftContactPart = request.POST.get('lhandpart')
			sign.leftContactSide = request.POST.get('lhandside')

		sign.sigml = request.POST.get('sigml')

		sign.rightMotionSequence = request.POST.getlist("rightSeq");
		sign.rightMotionTags = request.POST.getlist("rightSeqMotionTag");
		sign.rightTargetConfigs = request.POST.getlist("rightSeqTargetConfig");
		sign.rightTargetLocs = request.POST.getlist("rightSeqTargetLoc");

		sign.leftMotionSequence = request.POST.getlist("left_Seq");
		sign.leftMotionTags = request.POST.getlist("left_SeqMotionTag");
		sign.leftTargetConfigs = request.POST.getlist("left_SeqTargetConfig");
		sign.leftTargetLocs = request.POST.getlist("left_SeqTargetLoc");

		nondom = request.POST.get('nondom');
		if nondom == "true":
			sign.nondom = True;

		motionType = request.POST.get("motiondefinition");
		sign.motionType = motionType;
		if motionType == "symmetric":
			sign.symmetry = request.POST.get("symmetry");
			outofphase = request.POST.get("outofphase");
			if outofphase == "true":
				sign.outofphase = True;
			else:
				sign.outofphase = False;
		else:
			sign.symmetry = "none"

		sign.save();
		return redirect('sign_list')

	handshapes = Handshape.objects.all()
	rightMotionList = zip(sign.rightMotionSequence, sign.rightMotionTags, sign.rightTargetConfigs, sign.rightTargetLocs);
	leftMotionList = zip(sign.leftMotionSequence, sign.leftMotionTags, sign.leftTargetConfigs, sign.leftTargetLocs);
	context = {'handshapes' : handshapes, 'sign' : sign, 'rightMotionList' : rightMotionList, 'leftMotionList' : leftMotionList}

	return render(request, 'inventory/sign_edit.html', context)

# Delete a sign.
@login_required
def sign_delete(request,pk):
	print("DELETING");
	sign = get_object_or_404(Sign, id=pk)
	sign.delete()
	return redirect('sign_list');

def translator(request):
	
	spellout = False;
	sigml = ""
	query = ""
	url_parameter = request.GET.get("q")

	signs = Sign.objects.all()

	if url_parameter:
		signs = Sign.objects.filter( Q(name__icontains=url_parameter) | Q(description__icontains=url_parameter))
		if not signs:
			signs = []
			for c in url_parameter:
				if c.isalpha() or c.isnumeric():
					sign = Sign.objects.filter(name=c.upper())
					if sign:
						signs.append(sign[0])
						sigml = sigml + sign[0].sigml[7:-8]
						query = query + c.upper()

			if query:
				# query = ": " + query
				spellout=True;

	if request.is_ajax():
		print("QUERY: "+query);
		# dprint(typeof(query));
		html = render_to_string(template_name="inventory/translator-partial.html",context={'signs' : signs, 'spellout' : spellout, 'sigml' : sigml, 'query' : query})
		data_dict = {"html_from_view": html}
		return JsonResponse(data=data_dict, safe=False)

	context = {'signs' : signs}

	return render(request, "inventory/translator.html", context)