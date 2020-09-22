from django.conf import settings
from django.db import models
from django_mysql.models import ListTextField
from django.utils import timezone

import xml.etree.ElementTree as ET
import xml.dom.minidom
import html

# Define the Handshape model.
class Handshape(models.Model):

	# Handshape attributes
	name = models.CharField(max_length=200, verbose_name='Name')
	description = models.TextField(verbose_name='Description')
	created_date = models.DateTimeField(default=timezone.now, verbose_name='Date')
	# To upload illustration, configure with pillow and django-storage
	# illustration = models.ImageField(upload_to='images/')
	# transcription = models.CharField(max_length=20, verbose_name='Transcription')
	handshape = models.CharField(max_length=20, verbose_name='Handshape', default="None")
	thumbpos = models.CharField(max_length=20, verbose_name='Thumb Position', default="None")
	specialfingers = models.CharField(max_length=20, verbose_name='Special Fingers', default="None")
	mainbend = models.CharField(max_length=20, verbose_name='Main Bend', default="None")
	
	# Individual bending
	bend1_1 = models.FloatField(default=0)
	bend1_2 = models.FloatField(default=0)
	bend1_3 = models.FloatField(default=0)
	bend1_4 = models.FloatField(default=0)
	bend1_5 = models.FloatField(default=0)
	bend2_1 = models.FloatField(default=0)
	bend2_2 = models.FloatField(default=0)
	bend2_3 = models.FloatField(default=0)
	bend2_4 = models.FloatField(default=0)
	bend3_1 = models.FloatField(default=0)
	bend3_2 = models.FloatField(default=0)
	bend3_3 = models.FloatField(default=0)
	bend3_4 = models.FloatField(default=0)
	bend4_1 = models.FloatField(default=0)
	bend4_2 = models.FloatField(default=0)
	bend4_3 = models.FloatField(default=0)
	bend4_4 = models.FloatField(default=0)
	bend5_1 = models.FloatField(default=0)
	bend5_2 = models.FloatField(default=0)
	bend5_3 = models.FloatField(default=0)
	bend5_4 = models.FloatField(default=0)

	# SiGML representation
	sigml = models.TextField(default="<sigml></sigml>")

	def __str__(self):
		return self.name
		
	class Meta:
		# Default ordering by name, alphabetically
		ordering = ['name']

	# Convert parameters to HGS subelement
	def createHGSTree(self, handconfig):
		if self.handshape != "None":
			handconfig.set('handshape', self.handshape)
		if self.thumbpos != "None":
			handconfig.set('thumbpos', self.thumbpos)
		if self.specialfingers != "":
			handconfig.set('specialfingers', self.specialfingers)
		if self.mainbend != "None":
			handconfig.set('mainbend', self.mainbend)
		bend1Str = str(self.bend1_1) + " " + str(self.bend1_2) + " " + str(self.bend1_3) + " " + str(self.bend1_4) + " " + str(self.bend1_5)
		bend2Str = str(self.bend2_1) + " " + str(self.bend2_2) + " " + str(self.bend2_3) + " " + str(self.bend2_4)
		bend3Str = str(self.bend3_1) + " " + str(self.bend3_2) + " " + str(self.bend3_3) + " " + str(self.bend3_4)
		bend4Str = str(self.bend4_1) + " " + str(self.bend4_2) + " " + str(self.bend4_3)+ " " + str(self.bend4_4)
		bend5Str = str(self.bend5_1) + " " + str(self.bend5_2) + " " + str(self.bend5_3) + " " + str(self.bend5_4)
		if bend1Str != "0.0 0.0 0.0 0.0 0.0" and bend1Str != "0 0 0 0 0":
			handconfig.set('bend1', bend1Str)
		if bend2Str	!= "0.0 0.0 0.0 0.0" and bend2Str != "0 0 0 0":
			handconfig.set('bend2', bend2Str)
		if bend3Str != "0.0 0.0 0.0 0.0" and bend3Str != "0 0 0 0":
			handconfig.set('bend3', bend3Str)
		if bend4Str != "0.0 0.0 0.0 0.0" and bend4Str != "0 0 0 0":
			handconfig.set('bend4', bend4Str)
		if bend5Str != "0.0 0.0 0.0 0.0" and bend5Str != "0 0 0 0":
			handconfig.set('bend5', bend5Str)
		# return handconfig

	def sigmlfy(self):
		data = ET.Element('sigml')
		hamgs = ET.SubElement(data,'hamgestural_sign')
		sm = ET.SubElement(hamgs, 'sign_manual')
		handconfig = ET.SubElement(sm, 'handconfig')
		if self.handshape != "None":
			handconfig.set('handshape', self.handshape)
		if self.thumbpos != "None":
			handconfig.set('thumbpos', self.thumbpos)
		if self.specialfingers != "":
			handconfig.set('specialfingers', self.specialfingers)
		if self.mainbend != "None":
			handconfig.set('mainbend', self.mainbend)
		bend1Str = str(self.bend1_1) + " " + str(self.bend1_2) + " " + str(self.bend1_3) + " " + str(self.bend1_4) + " " + str(self.bend1_5)
		bend2Str = str(self.bend2_1) + " " + str(self.bend2_2) + " " + str(self.bend2_3) + " " + str(self.bend2_4)
		bend3Str = str(self.bend3_1) + " " + str(self.bend3_2) + " " + str(self.bend3_3) + " " + str(self.bend3_4)
		bend4Str = str(self.bend4_1) + " " + str(self.bend4_2) + " " + str(self.bend4_3)+ " " + str(self.bend4_4)
		bend5Str = str(self.bend5_1) + " " + str(self.bend5_2) + " " + str(self.bend5_3) + " " + str(self.bend5_4)
		if bend1Str != "0.0 0.0 0.0 0.0 0.0" and bend1Str != "0 0 0 0 0":
			handconfig.set('bend1', bend1Str)
		if bend2Str	!= "0.0 0.0 0.0 0.0" and bend2Str != "0 0 0 0":
			handconfig.set('bend2', bend2Str)
		if bend3Str != "0.0 0.0 0.0 0.0" and bend3Str != "0 0 0 0":
			handconfig.set('bend3', bend3Str)
		if bend4Str != "0.0 0.0 0.0 0.0" and bend4Str != "0 0 0 0":
			handconfig.set('bend4', bend4Str)
		if bend5Str != "0.0 0.0 0.0 0.0" and bend5Str != "0 0 0 0":
			handconfig.set('bend5', bend5Str)
		handconfig.set('extfidir', "u");
		handconfig.set('palmor', "d");
		dataStr = ET.tostring(data, encoding='unicode')
		return dataStr;

	def sigmlStr(self):
		handconfig = ET.Element('handconfig')
		if self.handshape != "None":
			handconfig.set('handshape', self.handshape)
		if self.thumbpos != "None":
			handconfig.set('thumbpos', self.thumbpos)
		if self.specialfingers != "":
			handconfig.set('specialfingers', self.specialfingers)
		if self.mainbend != "None":
			handconfig.set('mainbend', self.mainbend)
		bend1Str = str(self.bend1_1) + " " + str(self.bend1_2) + " " + str(self.bend1_3) + " " + str(self.bend1_4) + " " + str(self.bend1_5)
		bend2Str = str(self.bend2_1) + " " + str(self.bend2_2) + " " + str(self.bend2_3) + " " + str(self.bend2_4)
		bend3Str = str(self.bend3_1) + " " + str(self.bend3_2) + " " + str(self.bend3_3) + " " + str(self.bend3_4)
		bend4Str = str(self.bend4_1) + " " + str(self.bend4_2) + " " + str(self.bend4_3)+ " " + str(self.bend4_4)
		bend5Str = str(self.bend5_1) + " " + str(self.bend5_2) + " " + str(self.bend5_3) + " " + str(self.bend5_4)
		if bend1Str != "0.0 0.0 0.0 0.0 0.0" and bend1Str != "0 0 0 0 0":
			handconfig.set('bend1', bend1Str)
		if bend2Str	!= "0.0 0.0 0.0 0.0" and bend2Str != "0 0 0 0":
			handconfig.set('bend2', bend2Str)
		if bend3Str != "0.0 0.0 0.0 0.0" and bend3Str != "0 0 0 0":
			handconfig.set('bend3', bend3Str)
		if bend4Str != "0.0 0.0 0.0 0.0" and bend4Str != "0 0 0 0":
			handconfig.set('bend4', bend4Str)
		if bend5Str != "0.0 0.0 0.0 0.0" and bend5Str != "0 0 0 0":
			handconfig.set('bend5', bend5Str)
		handconfig.set('extfidir', "u");
		handconfig.set('palmor', "d");
		dataStr = html.escape(ET.tostring(handconfig, encoding='unicode'))
		return dataStr;


class Sign(models.Model):

	name = models.CharField(max_length=200, verbose_name='Name')
	description = models.TextField(verbose_name='Description')

	# Two handed
	twoHanded = models.BooleanField(default=False) 

	# Initial Configuration
	rightHandshape = models.ForeignKey(Handshape, verbose_name="Right Handshape", default="1", on_delete=models.CASCADE, related_name='rightHandshape_sign_set')
	rightFingerDirection = models.CharField(max_length=5, verbose_name='Right External Finger Direction', default='')
	rightPalmOrientation = models.CharField(max_length=5, verbose_name='Right Palm Orientation', default='')
	leftHandshape = models.ForeignKey(Handshape, verbose_name="Left Handshape", default="1", on_delete=models.CASCADE, related_name='leftHandshape_sign_set')
	leftFingerDirection = models.CharField(max_length=5, verbose_name='Left External Finger Direction', default='')
	leftPalmOrientation = models.CharField(max_length=5, verbose_name='Left Palm Orientation', default='')

	# Location Definition
	locationType = models.CharField(max_length=10, verbose_name='Location Type', default='')

	# Split Location
	rightLocation = models.CharField(max_length=20, verbose_name='Right Hand Location', default='')
	rightLocationSide = models.CharField(max_length=20, verbose_name='Right Hand Location Side', default='')
	rightLocationContact = models.CharField(max_length=20, verbose_name='Right Hand Location Contact', default='')
	leftLocation = models.CharField(max_length=20, verbose_name='Left Hand Location', default='')
	leftLocationSide = models.CharField(max_length=20, verbose_name='Left Hand Location Contact', default='')
	leftLocationContact = models.CharField(max_length=20, verbose_name='Left Hand Location Side', default='')
	
	# Constellation
	constellationContact = models.CharField(max_length=20, verbose_name='Constellation Contact', default='')
	constellationLocation = models.CharField(max_length=20, verbose_name='Constellation Location', default='')
	constellationLocationSide = models.CharField(max_length=20, verbose_name='Constellation Location Side', default='')
	constellationLocationContact = models.CharField(max_length=20, verbose_name='Constellation Location Contact', default='')

	# Contact Definition
	rightContactType = models.CharField(max_length=20, verbose_name='Right Contact Type', default='')
	leftContactType = models.CharField(max_length=20, verbose_name='Left Contact Type', default='')

	# Contact Part
	rightContactFinger = models.CharField(max_length=5, verbose_name='Constellation Location Contact', default='')
	rightContactPart = models.CharField(max_length=20, verbose_name='Right Contact Part', default='')
	rightContactSide = models.CharField(max_length=20, verbose_name='Right Contact Side', default='')
	leftContactFinger = models.CharField(max_length=20, verbose_name='Right Contact Side', default='') 
	leftContactPart = models.CharField(max_length=20, verbose_name='Right Contact Side', default='')
	leftContactSide = models.CharField(max_length=20, verbose_name='Right Contact Side', default='')
	
	sigml = models.TextField(default="<sigml></sigml>");

	rightMotionSequence = ListTextField(base_field=models.CharField(max_length=1000), size=10,)
	rightMotionTags = ListTextField(base_field=models.CharField(max_length=500), size=10,)
	rightTargetConfigs = ListTextField(base_field=models.CharField(max_length=500), size=10,)
	rightTargetLocs = ListTextField(base_field=models.CharField(max_length=500), size=10,)

	leftMotionSequence = ListTextField(base_field=models.CharField(max_length=1000), size=10,)
	leftMotionTags = ListTextField(base_field=models.CharField(max_length=500), size=10,)
	leftTargetConfigs = ListTextField(base_field=models.CharField(max_length=500), size=10,)
	leftTargetLocs = ListTextField(base_field=models.CharField(max_length=500), size=10,)

	# NON DOM
	nondom = models.BooleanField(default=False)

	# SYMMETRY
	motionType = models.CharField(max_length=10, verbose_name='Motion Type', default='split')
	symmetry = models.CharField(max_length=7, verbose_name='Symmetry', default='split')
	outofphase = models.BooleanField(default=False)

	def __str__(self):
		return self.name
		
	class Meta:
		# Default ordering by name, alphabetically
		ordering = ['name']


	# DELETE THIS SOON.
	def sigmlfy(self):
		
		sigml = ET.Element('sigml')
		hamgestural_sign = ET.SubElement(sigml,'hamgestural_sign')
		sign_manual = ET.SubElement(hamgestural_sign, 'sign_manual')

		# Hand Config
		if self.twoHanded:

			# Hand Configuration
			split_handconfig = ET.SubElement(sign_manual, 'split_handconfig')
			
			# Right Hand Config
			r_handconfig = ET.SubElement(split_handconfig, 'handconfig')
			self.rightHandshape.createHGSTree(r_handconfig)
			r_handconfig.set('extfidir', self.rightFingerDirection)
			r_handconfig.set('palmor', self.rightPalmOrientation)

			# Left Hand Config
			l_handconfig = ET.SubElement(split_handconfig, 'handconfig')
			self.leftHandshape.createHGSTree(l_handconfig)
			l_handconfig.set('extfidir', self.leftFingerDirection)
			l_handconfig.set('palmor', self.leftPalmOrientation)

			if self.locationType == "split":
				# Split location
				split_location = ET.SubElement(sign_manual, 'split_location')

				# Right Hand Location
				r_location = ET.SubElement(split_location,'location_bodyarm')
				r_location.set('location',self.rightLocation)
				r_location.set('contact',self.rightLocationContact)
				r_location.set('side',self.rightLocationSide)

				# Left Hand Location
				l_location = ET.SubElement(split_location,'location_bodyarm')
				l_location.set('location',self.leftLocation)
				l_location.set('contact',self.leftLocationContact)
				l_location.set('side',self.leftLocationSide)

			else:
				handconstellation = ET.SubElement(sign_manual, 'handconstellation')
				handconstellation.set('contact', self.constellationContact)

				r_site = ET.SubElement(handconstellation, 'location_hand')
				if self.rightContactType == "fingerpart":
					r_site.set('digits', self.rightContactFinger)
					r_site.set('location', self.rightContactPart)
					r_site.set('side',self.rightContactSide)
				else:
					r_site.set('location', self.rightContactPart)
					r_site.set('side',self.rightContactSide)


				l_site = ET.SubElement(handconstellation, 'location_hand')
				if self.leftContactType == "fingerpart":
					l_site.set('digits', self.leftContactFinger)
					l_site.set('location', self.leftContactPart)
					l_site.set('side',self.leftContactSide)
				else:
					l_site.set('location', self.leftContactPart)
					l_site.set('side',self.leftContactSide)

				site_loc = ET.SubElement(handconstellation, 'location_bodyarm')
				site_loc.set('location', self.constellationLocation)
				site_loc.set('side', self.constellationLocationSide)
				site_loc.set('contact', self.constellationLocationContact)
				

		else:

			# Hand Configuration
			handconfig = ET.SubElement(sign_manual,'handconfig')
			self.rightHandshape.createHGSTree(handconfig)
			handconfig.set('extfidir', self.rightFingerDirection)
			handconfig.set('palmor', self.rightPalmOrientation)

			# Location
			location = ET.SubElement(sign_manual,'location_bodyarm')
			location.set('location', self.rightLocation)
			location.set('contact', self.rightLocationContact)
			location.set('side', self.rightLocationSide)

		dataStr = ET.tostring(sigml, encoding='unicode')
		return dataStr;


