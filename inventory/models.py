from django.conf import settings
from django.db import models
from django.utils import timezone

# Define the Handshape model.
class Handshape(models.Model):

	# Handshape attributes
	name = models.CharField(max_length=200, verbose_name='Name')
	description = models.TextField(verbose_name='Description')
	created_date = models.DateTimeField(default=timezone.now, verbose_name='Date')
	# To upload illustration, configure with pillow and django-storage
	# illustration = models.ImageField(upload_to='images/')

	# Separate Base Form and Finger Specs
	base = models.CharField(max_length=10, verbose_name='Base Form')
	fingerspecs = models.CharField(max_length=10, null=True, verbose_name='Finger Specifications')
	transcription = models.CharField(max_length=20, verbose_name='Transcription')

	# Using the Handshape name to identify handshapes.
	def __str__(self):
		return self.name
		
	# Metadata
	class Meta:
		# Default ordering by name, alphabetically
		ordering = ['name']