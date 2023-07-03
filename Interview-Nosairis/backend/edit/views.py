from django.shortcuts import render
from django.http import JsonResponse
from .models import Status
from django.core import serializers
from django.middleware.csrf import get_token
from django.shortcuts import render
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import json
from datetime import datetime

# Create your views here.
def edit(request):
	if request.method == "GET":
		return read(request)
	if request.method == "POST":
		return write(request)
	if request.method == "PATCH":
		return update(request)
	return render(request, 'edit/index.html')

def generate_plot(statuses, page):
		s_times = {"S1": [], "S2": [], "S3": []}
		s_results = {"S1": [], "S2": [], "S3": []}
		s_padding = {"S1": 30 * page, "S2": 30 * page, "S3": 30 * page}

		for item in statuses:
				switch_label = item["switch_label"]
				if (s_padding[switch_label] > 0 or len(s_times[switch_label]) > 30):
					s_padding[switch_label] -= 1
					continue
				time_converted = datetime.fromtimestamp(item["TS"]).strftime("%H:%M")
				t_values = [item["T1"], item["T2"], item["T3"], item["T4"], item["T5"]]
				result = 1 if any(t_values) else 0

				s_times[switch_label].append(time_converted)
				s_results[switch_label].append(result)

		if all(len(times) <= 1 for times in s_times.values()) and all(len(results) <= 1 for results in s_results.values()):
				return 0

		plot_data = [("S1", "SW-S1 Ping Availability"), ("S2", "SW-S2 Ping Availability"), ("S3", "SW-S3 Ping Availability")]
		for switch_label, title in plot_data:
				plt.figure(figsize=(20, 5))
				plt.plot(s_times[switch_label], s_results[switch_label], color='blue')
				plt.xlabel('Time')
				plt.ylabel('Status')
				plt.title(title)
				plt.yticks([0, 1])
				plt.grid(True)
				plt.savefig(f"{switch_label}-plot.png")
				plt.clf()
		return 1

def read(request):
		get_token(request)
		statuses = Status.objects.values(
			"id", "switch_label", "T1", "T2", "T3", "T4", "T5", "TS"
		)
		try:
			page = int(request.GET.getlist("page")[0]) - 1
			if (page < 0):
				raise ValueError
		except ValueError:
			return JsonResponse({"error": "Invalid page number - page must be 1 or more"}, status=400)
		except IndexError:
			page = 1
		if generate_plot(statuses, page):
			return render(request, 'edit/index.html', {"page": page + 1})
		return JsonResponse({"error": "No data available"}, status=400)

def write(request):
		data = json.loads(request.body)
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