from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

# To have access to our Handshapes.
from .models import Handshape
# To help us rearrange posts according to publishing date.
from django.utils import timezone
 # To render templates and get existing objects.
from django.shortcuts import render, get_object_or_404, redirect
# To authorize users before editing/posting/deleting handshapes
from django.contrib.auth.decorators import login_required

# Ham2SiGML
import xml.etree.ElementTree as ET
import xml.dom.minidom

sigml_dict = {'0020': 'hamspace', '0021': 'hamexclaim', '002C': 'hamcomma', '002E': 'hamfullstop', '003F': 'hamquery', '007B': 'hamaltbegin', '007C': 'hammetaalt', '007D': 'hamaltend', 'E000': 'hamfist', 'E001': 'hamflathand', 'E002': 'hamfinger2', 'E003': 'hamfinger23', 'E004': 'hamfinger23spread', 'E005': 'hamfinger2345', 'E006': 'hampinch12', 'E007': 'hampinchall', 'E008': 'hampinch12open', 'E009': 'hamcee12', 'E00A': 'hamceeall', 'E00B': 'hamceeopen', 'E00C': 'hamthumboutmod', 'E00D': 'hamthumbacrossmod', 'E00E': 'hamthumbopenmod', 'E010': 'hamfingerstraightmod', 'E011': 'hamfingerbendmod', 'E012': 'hamfingerhookmod', 'E013': 'hamdoublebent', 'E014': 'hamdoublehooked', 'E020': 'hamextfingeru', 'E021': 'hamextfingerur', 'E022': 'hamextfingerr', 'E023': 'hamextfingerdr', 'E024': 'hamextfingerd', 'E025': 'hamextfingerdl', 'E026': 'hamextfingerl', 'E027': 'hamextfingerul', 'E028': 'hamextfingerol', 'E029': 'hamextfingero', 'E02A': 'hamextfingeror', 'E02B': 'hamextfingeril', 'E02C': 'hamextfingeri', 'E02D': 'hamextfingerir', 'E02E': 'hamextfingerui', 'E02F': 'hamextfingerdi', 'E030': 'hamextfingerdo', 'E031': 'hamextfingeruo', 'E038': 'hampalmu', 'E039': 'hampalmur', 'E03A': 'hampalmr', 'E03B': 'hampalmdr', 'E03C': 'hampalmd', 'E03D': 'hampalmdl', 'E03E': 'hampalml', 'E03F': 'hampalmul', 'E040': 'hamhead', 'E041': 'hamheadtop', 'E042': 'hamforehead', 'E043': 'hameyebrows', 'E044': 'hameyes', 'E045': 'hamnose', 'E046': 'hamnostrils', 'E047': 'hamear', 'E048': 'hamearlobe', 'E049': 'hamcheek', 'E04A': 'hamlips', 'E04B': 'hamtongue', 'E04C': 'hamteeth', 'E04D': 'hamchin', 'E04E': 'hamunderchin', 'E04F': 'hamneck', 'E050': 'hamshouldertop', 'E051': 'hamshoulders', 'E052': 'hamchest', 'E053': 'hamstomach', 'E054': 'hambelowstomach', 'E058': 'hamlrbeside', 'E059': 'hamlrat', 'E05A': 'hamcoreftag', 'E05B': 'hamcorefref', 'E05F': 'hamneutralspace', 'E060': 'hamupperarm', 'E061': 'hamelbow', 'E062': 'hamelbowinside', 'E063': 'hamlowerarm', 'E064': 'hamwristback', 'E065': 'hamwristpulse', 'E066': 'hamthumbball', 'E067': 'hampalm', 'E068': 'hamhandback', 'E069': 'hamthumbside', 'E06A': 'hampinkyside', 'E070': 'hamthumb', 'E071': 'hamindexfinger', 'E072': 'hammiddlefinger', 'E073': 'hamringfinger', 'E074': 'hampinky', 'E075': 'hamfingertip', 'E076': 'hamfingernail', 'E077': 'hamfingerpad', 'E078': 'hamfingermidjoint', 'E079': 'hamfingerbase', 'E07A': 'hamfingerside', 'E07C': 'hamwristtopulse', 'E07D': 'hamwristtoback', 'E07E': 'hamwristtothumb', 'E07F': 'hamwristtopinky', 'E080': 'hammoveu', 'E081': 'hammoveur', 'E082': 'hammover', 'E083': 'hammovedr', 'E084': 'hammoved', 'E085': 'hammovedl', 'E086': 'hammovel', 'E087': 'hammoveul', 'E088': 'hammoveol', 'E089': 'hammoveo', 'E08A': 'hammoveor', 'E08B': 'hammoveil', 'E08C': 'hammovei', 'E08D': 'hammoveir', 'E08E': 'hammoveui', 'E08F': 'hammovedi', 'E090': 'hammovedo', 'E091': 'hammoveuo', 'E092': 'hamcircleo', 'E093': 'hamcirclei', 'E094': 'hamcircled', 'E095': 'hamcircleu', 'E096': 'hamcirclel', 'E097': 'hamcircler', 'E098': 'hamcircleul', 'E099': 'hamcircledr', 'E09A': 'hamcircleur', 'E09B': 'hamcircledl', 'E09C': 'hamcircleol', 'E09D': 'hamcircleir', 'E09E': 'hamcircleor', 'E09F': 'hamcircleil', 'E0A0': 'hamcircleui', 'E0A1': 'hamcircledo', 'E0A2': 'hamcircleuo', 'E0A3': 'hamcircledi', 'E0A4': 'hamfingerplay', 'E0A5': 'hamnodding', 'E0A6': 'hamswinging', 'E0A7': 'hamtwisting', 'E0A8': 'hamstircw', 'E0A9': 'hamstirccw', 'E0AA': 'hamreplace', 'E0AD': 'hammovecross', 'E0AE': 'hammoveX', 'E0AF': 'hamnomotion', 'E0B0': 'hamclocku', 'E0B1': 'hamclockul', 'E0B2': 'hamclockl', 'E0B3': 'hamclockdl', 'E0B4': 'hamclockd', 'E0B5': 'hamclockdr', 'E0B6': 'hamclockr', 'E0B7': 'hamclockur', 'E0B8': 'hamclockfull', 'E0B9': 'hamarcl', 'E0BA': 'hamarcu', 'E0BB': 'hamarcr', 'E0BC': 'hamarcd', 'E0BD': 'hamwavy', 'E0BE': 'hamzigzag', 'E0C0': 'hamellipseh', 'E0C1': 'hamellipseur', 'E0C2': 'hamellipsev', 'E0C3': 'hamellipseul', 'E0C4': 'hamincreasing', 'E0C5': 'hamdecreasing', 'E0C6': 'hamsmallmod', 'E0C7': 'hamlargemod', 'E0C8': 'hamfast', 'E0C9': 'hamslow', 'E0CA': 'hamtense', 'E0CB': 'hamrest', 'E0CC': 'hamhalt', 'E0D0': 'hamclose', 'E0D1': 'hamtouch', 'E0D2': 'haminterlock', 'E0D3': 'hamcross', 'E0D4': 'hamarmextended', 'E0D5': 'hambehind', 'E0D6': 'hambrushing', 'E0D8': 'hamrepeatfromstart', 'E0D9': 'hamrepeatfromstartseveral', 'E0DA': 'hamrepeatcontinue', 'E0DB': 'hamrepeatcontinueseveral', 'E0DC': 'hamrepeatreverse', 'E0DD': 'hamalternatingmotion', 'E0E0': 'hamseqbegin', 'E0E1': 'hamseqend', 'E0E2': 'hamparbegin', 'E0E3': 'hamparend', 'E0E4': 'hamfusionbegin', 'E0E5': 'hamfusionend', 'E0E6': 'hambetween', 'E0E7': 'hamplus', 'E0E8': 'hamsymmpar', 'E0E9': 'hamsymmlr', 'E0EA': 'hamnondominant', 'E0EB': 'hamnonipsi', 'E0EC': 'hametc', 'E0ED': 'hamorirelative', 'E0F0': 'hammime', 'E0F1': 'hamversion40'}

def sigmlfy(transcription, gloss):
	# List unicode for each HamNoSys character.
	codesList = []
	for char in transcription:
		hamnosysCode = char.encode('unicode_escape').decode()
		hamnosysCode = hamnosysCode.replace("\\u", "")
		hamnosysCode = hamnosysCode.upper()
		codesList.append(hamnosysCode)
	# List SiGML tags for each character.
	sigmlList = []
	for code in codesList:
		sigmlList.append(sigml_dict[code])
	# Create SiGML file structure.
	data = ET.Element('sigml')
	# Creat hns_sign structure. 
	itemGloss = ET.SubElement(data, 'hns_sign')
	itemGloss.set('gloss', gloss)	
	# Create nonmanual and manual substructures.
	itemNonManual = ET.SubElement(itemGloss, 'hamnosys_nonmanual')
	itemManual = ET.SubElement(itemGloss, 'hamnosys_manual')
	for tag in sigmlList:
		ET.SubElement(itemManual, tag)
	
	# For handshapes, set location to @head
	ET.SubElement(itemManual, "hamextfingeru")
	ET.SubElement(itemManual, "hampalml")

	dataStr = ET.tostring(data, encoding='unicode')
	dom = xml.dom.minidom.parseString(dataStr)
	sigml_data = dom.toprettyxml(encoding='UTF-8').decode("utf-8")
	return sigml_data


# Display index.
def index(request):
	return render(request, 'inventory/index.html')

# List all handshapes.
def handshape_list(request):
	# Get all handshapes.
	handshapes = Handshape.objects.all()
	# We store in context things from here that we want to send to the template.
	context = { 'handshapes' : handshapes }
	# Render post_list.html template.
	return render(request, 'inventory/handshape_list.html', context)

# View handshape details.
def handshape_detail(request, pk):
	# Get handshape using the primary key from the URL
	# Return 404 if it doesn't exit
	handshape = get_object_or_404(Handshape, pk=pk)
	context = {'handshape' : handshape, 'sigml' : sigmlfy(handshape.transcription,handshape.name)}
	return render(request, 'inventory/handshape_detail.html', context)

# Edit a handshape.
@login_required
def handshape_edit(request, pk):
	none_to_str = lambda i : i or ''
	if request.method == "POST":
		new_name = request.POST.get("hs_name")
		new_description = request.POST.get("hs_description")
		# new_base = request.POST.get("hs_base")
		# new_fingerspecs = request.POST.get("hs_fingerspecs")
		new_transcription = request.POST.get("hs_transcription")
		hs = Handshape.objects.get(id=pk)
		hs.name = new_name
		hs.description = new_description
		# hs.base = new_base
		# hs.fingerspecs = new_fingerspecs
		hs.transcription = new_transcription
		hs.save();
		return redirect('handshape_detail', pk=hs.pk)
	handshape = Handshape.objects.get(id=pk)
	context = {'handshape' : handshape}
	return render(request, 'inventory/handshape_edit.html', context)

# Create a new handshape. 
@login_required
def handshape_new(request):
	none_to_str = lambda i : i or ''
	if request.method == "POST":
		new_name = request.POST.get("hs_name")
		new_description = request.POST.get("hs_description")
		# new_base = request.POST.get("hs_base")
		# new_fingerspecs = request.POST.get("hs_fingerspecs")
		new_transcription = request.POST.get("hs_transcription")
		hs = Handshape(name=new_name, description=new_description, transcription=new_transcription)
		hs.save();
		return redirect('handshape_detail', pk=hs.pk)
	return render(request, 'inventory/handshape_new.html')

# Delete a handshape.
@login_required
def handshape_delete(request,pk):
	handshape = get_object_or_404(Handshape, pk=pk)
	handshape.delete()
	return redirect('handshape_list')