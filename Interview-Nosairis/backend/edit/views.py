from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Status
from django.core import serializers
from django.middleware.csrf import get_token
import json

# Create your views here.
def edit(request):
	if request.method == "GET":
		return read(request)
	if request.method == "POST":
		return write(request)
	if request.method == "PATCH":
		return update(request)
	return HttpResponse("Hello, world. You're at the edit index.")

def read(request):
		csrf_token = get_token(request)
		statuses = Status.objects.values(
			"id", "switch_label", "T1", "T2", "T3", "T4", "T5", "TS"
		)
		return JsonResponse(list(statuses), safe=False)

def write(request):
		data = json.loads(request.body)
		new_status = Status.objects.create(
				switch_label=data['switch_label'],
				T1=data['T1'],
				T2=data['T2'],
				T3=data['T3'],
				T4=data['T4'],
				T5=data['T5'],
				TS=data['TS']
		)
		return JsonResponse(data)

def update(request):
		data = json.loads(request.body)
		status_id = data['id']
		updated_fields = {
				'switch_label': data['switch_label'],
				'T1': data['T1'],
				'T2': data['T2'],
				'T3': data['T3'],
				'T4': data['T4'],
				'T5': data['T5'],
				'TS': data['TS']
		}
		Status.objects.filter(id=status_id).update(**updated_fields)
		return JsonResponse(data)