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

	none_to_str = lambda i : i or ''

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