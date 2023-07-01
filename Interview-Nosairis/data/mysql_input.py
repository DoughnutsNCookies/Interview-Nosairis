import csv
import mysql.connector
import sys
from dotenv import dotenv_values

table_name = 'switch_status'

if len(sys.argv) != 2:
	print("Usage: python mysql_input.py your_file.csv")
	sys.exit(1)

file_path = sys.argv[1]

try:
	env_path = '../.env'
	env_vars = dotenv_values('../.env')
	conn = mysql.connector.connect(
		host=env_vars['DB_HOST'],
		user=env_vars['DB_USER'],
		database=env_vars['DB_NAME'],
		password=env_vars['DB_PASSWORD']
	)
	cursor = conn.cursor()
	with open(file_path, 'r') as file:
		csv_reader = csv.reader(file)
		next(csv_reader)

		for row in csv_reader:
			col1, col2, col3, col4, col5, col6, col7 = row
			query = f"INSERT INTO {table_name} (switch_label, T1, T2, T3, T4, T5, TS) VALUES (%s, %s, %s, %s, %s, %s, %s)"
			values = (col1, col2, col3, col4, col5, col6, col7)
			cursor.execute(query, values)
	print("Input data complete.")
except mysql.connector.Error as err:
	print(f"Error: {err}")
	print("Have you run mysql_init.py to initialize MySQL?")

finally:
	if conn.is_connected():
		conn.commit()
		cursor.close()
		conn.close()
		print("MySQL connection closed")