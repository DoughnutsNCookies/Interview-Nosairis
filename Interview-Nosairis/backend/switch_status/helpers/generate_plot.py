import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from datetime import datetime


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
				plt.savefig(f"media/{switch_label}-plot.png")
				plt.clf()
		return 1