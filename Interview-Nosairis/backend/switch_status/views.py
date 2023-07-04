from django.shortcuts import render
from django.http import JsonResponse
from .models import Status
from django.middleware.csrf import get_token
from django.shortcuts import render
from switch_status.helpers.generate_plot import generate_plot
from switch_status.helpers.encode_image import encode_image
from datetime import datetime
import json

# Create your views here.
def switch_status(request):
	if request.method == "GET":
		return read(request)
	if request.method == "POST":
		return write(request)
	if request.method == "PATCH":
		return update(request)
	return render(request, 'switch_status/index.html')

def read(request):
		statuses = Status.objects.values(
			"id", "switch_label", "T1", "T2", "T3", "T4", "T5", "TS"
		)
		try:
			page = int(request.GET.getlist("page")[0])
			if (page <= 0):
				raise ValueError
		except ValueError:
			return JsonResponse({"error": "Invalid page number - page must be 1 or more"}, status=400)
		except IndexError:
			page = 1
		if generate_plot(statuses, page - 1):
			image_paths = ["media/S1-plot.png", "media/S2-plot.png", "media/S3-plot.png"]
			serialized_images = [encode_image(image_path) for image_path in image_paths]
			response_data = {
				"images": serialized_images,
			}
			return JsonResponse(response_data)
		return JsonResponse({"error": "No data available"}, status=400)

def write(request):
		data = json.loads(request.body)
		statuses = Status.objects.values(
			"id", "switch_label", "T1", "T2", "T3", "T4", "T5", "TS"
		)
		if Status.objects.filter(switch_label=data['switch_label'], TS=data['TS']).exists():
			return update(request)
		else:
			Status.objects.create(
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
		updated_fields = {
				'switch_label': data['switch_label'],
				'T1': data['T1'],
				'T2': data['T2'],
				'T3': data['T3'],
				'T4': data['T4'],
				'T5': data['T5'],
				'TS': data['TS']
		}
		Status.objects.filter(switch_label=data['switch_label'], TS=data['TS']).update(**updated_fields)
		return JsonResponse(data)

def alert(request):
		if request.method == 'GET':
				statuses = Status.objects.values(
					"id", "switch_label", "T1", "T2", "T3", "T4", "T5", "TS"
				)
				output = []
				for item in statuses:
						t_values = [item["T1"], item["T2"], item["T3"], item["T4"], item["T5"]]
						if any(t_values) == False:
							output.append({
								"switch_label": item["switch_label"],
								"time": datetime.fromtimestamp(item["TS"]).strftime("%d/%m/%Y %H:%M")
							})
				return JsonResponse(output, safe=False)