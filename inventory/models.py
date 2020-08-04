from django.conf import settings
from django.db import models
from django.utils import timezone

import xml.etree.ElementTree as ET
import xml.dom.minidom

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

	sigml = models.TextField(default="<sigml></sigml>")
	# Using the Handshape name to identify handshapes.
	def __str__(self):
		return self.name
		
	# Metadata
	class Meta:
		# Default ordering by name, alphabetically
		ordering = ['name']

	def sigmlfy(self):
		data = ET.Element('sigml')
		hamgs = ET.SubElement(data, 'hamgestural_sign')
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
		bend1Str = self.bend1_1 + " " + self.bend1_2 + " " + self.bend1_3 + " " + self.bend1_4 + " " + self.bend1_5
		bend2Str = self.bend2_1 + " " +self.bend2_2 + " " + self.bend2_3 + " " + self.bend2_4
		bend3Str = self.bend3_1 + " " + self.bend3_2 + " " + self.bend3_3 + " " + self.bend3_4
		bend4Str = self.bend4_1 + " " + self.bend4_2 + " " + self.bend4_3 + " " + self.bend4_4
		bend5Str = self.bend5_1 + " " + self.bend5_2 + " " + self.bend5_3 + " " + self.bend5_4
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

		return dataStr