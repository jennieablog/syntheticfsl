from django.conf import settings
from django.db import models
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

	# Single handed?
	twohanded = models.BooleanField(default=False) 

	# Handshape
	hs = models.ForeignKey(Handshape, default=1, verbose_name="Right Handshape", on_delete=models.SET_DEFAULT, related_name='rhs_sign_set')
	lhs = models.ForeignKey(Handshape, default=1, verbose_name="Left Handshape", on_delete=models.SET_DEFAULT, related_name='lhs_sign_set')

	# External Finger Direction
	efd = models.CharField(max_length=5, verbose_name='Right External Finger Direction', default='')
	lefd = models.CharField(max_length=5, verbose_name='Left External Finger Direction', default='')

	# Hand Orientation
	ori = models.CharField(max_length=5, verbose_name='Right Palm Orientation', default='')
	lori = models.CharField(max_length=5, verbose_name='Left Palm Orientation', default='')

	# Location
	loc = models.CharField(max_length=20, verbose_name='Right Hand Location', default='')
	contact = models.CharField(max_length=20, verbose_name='Right Hand Location Contact', default='')
	side = models.CharField(max_length=20, verbose_name='Right Hand Location Side', default='')

	lloc = models.CharField(max_length=20, verbose_name='Left Hand Location', default='')
	lcontact = models.CharField(max_length=20, verbose_name='Left Hand Location Contact', default='')
	lside = models.CharField(max_length=20, verbose_name='Left Hand Location Side', default='')
	
	sigml = models.TextField(default="<sigml></sigml>")

	def __str__(self):
		return self.name
		
	class Meta:
		# Default ordering by name, alphabetically
		ordering = ['name']

	def sigmlfy(self):
		
		sigml = ET.Element('sigml')
		hamgestural_sign = ET.SubElement(sigml,'hamgestural_sign')
		sign_manual = ET.SubElement(hamgestural_sign, 'sign_manual')

		# Hand Config
		if self.twohanded:

			# Hand Configuration
			split_handconfig = ET.SubElement(sign_manual, 'split_handconfig')
			
			# Right Hand Config
			r_handconfig = ET.SubElement(split_handconfig, 'handconfig')
			self.hs.createHGSTree(r_handconfig)
			r_handconfig.set('extfidir', self.efd)
			r_handconfig.set('palmor', self.ori)

			# Left Hand Config
			l_handconfig = ET.SubElement(split_handconfig, 'handconfig')
			self.lhs.createHGSTree(l_handconfig)
			l_handconfig.set('extfidir', self.lefd)
			l_handconfig.set('palmor', self.lori)

			# Location
			split_location = ET.SubElement(sign_manual, 'split_location')

			# Right Hand Location
			r_location = ET.SubElement(split_location,'location_bodyarm')
			r_location.set('location',self.loc)
			r_location.set('contact',self.contact)
			r_location.set('side',self.side)

			# Left Hand Location
			l_location = ET.SubElement(split_location,'location_bodyarm')
			l_location.set('location',self.lloc)
			l_location.set('contact',self.lcontact)
			l_location.set('side',self.lside)

		else:

			# Hand Configuration
			handconfig = ET.SubElement(sign_manual,'handconfig')
			self.hs.createHGSTree(handconfig)
			handconfig.set('extfidir', self.efd)
			handconfig.set('palmor', self.ori)

			# Location
			location = ET.SubElement(sign_manual,'location_bodyarm')
			location.set('location', self.loc)
			location.set('contact', self.contact)
			location.set('side', self.side)


		dataStr = ET.tostring(sigml, encoding='unicode')
		return dataStr;


