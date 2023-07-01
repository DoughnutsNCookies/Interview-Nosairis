import mysql.connector
import csv
from dotenv import dotenv_values

env_path = '../.env'
env_vars = dotenv_values('../.env')

try:
	conn = mysql.connector.connect(
			host=env_vars['DB_HOST'],
			port= env_vars['DB_PORT'],
			user=env_vars['DB_USER'],
			password=env_vars['DB_PASSWORD']
	)
	cursor = conn.cursor()
	database_name = env_vars['DB_NAME']
	cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database_name}")
	print(f"Database '{database_name}' created successfully.")
	conn.database = database_name
	table_name = 'switch_status'
	cursor.execute(f"CREATE TABLE IF NOT EXISTS {table_name} "
									"(id INT AUTO_INCREMENT PRIMARY KEY, "
									"switch_label VARCHAR(255), "
									"T1 BOOLEAN, "
									"T2 BOOLEAN, "
									"T3 BOOLEAN, "
									"T4 BOOLEAN, "
									"T5 BOOLEAN, "
									"TS BIGINT)")
	print(f"Table '{table_name}' created successfully.")
	print("Initialization complete.")
except mysql.connector.Error as err:
	print(f"Error: {err}")

finally:
	if conn.is_connected():
			cursor.close()
			conn.close()
			print("MySQL connection closed")