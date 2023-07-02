from django.db import models

# Create your models here.
class Status(models.Model):
	switch_label = models.CharField(max_length=255)
	T1 = models.BooleanField()
	T2 = models.BooleanField()
	T3 = models.BooleanField()
	T4 = models.BooleanField()
	T5 = models.BooleanField()
	TS = models.BigIntegerField()

	class Meta:
		db_table = "switch_status"