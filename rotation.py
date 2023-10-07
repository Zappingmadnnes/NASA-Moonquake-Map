# from jplephem.pck import PCK

# p = PCK.open("moon_pa_de421_1900-2050.bpc")

# # print(p.segments[0].body)

# # print(p.segments[0].frame)

# # print(p.segments[0].data_type)
# tdb = 2454540.34103
# print(p.segments[0].compute(tdb, 0.0, False))


from jplephem.pck import PCK
import csv
import datetime

# Open the PCK file
p = PCK.open("moon_pa_de421_1900-2050.bpc")

# Define start, end, and time interval
start_jd = 2440546
end_jd = start_jd + 365 * 10  # Change this to your desired end Julian date
time_interval = 1 / 24  # Change this to your desired time interval

# Create a list to store the computed data
data_list = []

# Compute and store the data in the specified time intervals
current_jd = start_jd
while current_jd <= end_jd:
    data = p.segments[0].compute(current_jd, 0.0, False)

    date_time = datetime.datetime(2000, 1, 1) + datetime.timedelta(
        days=current_jd - 2451545.0
    )
    formatted_date = date_time.strftime("%Y-%m-%d %H:%M")
    data_list.append([current_jd] + list(data))
    current_jd += time_interval

# Define the CSV file path
csv_file_path = "moon_rotation.csv"

# Write the data to a CSV file
with open(csv_file_path, mode="w", newline="") as csv_file:
    csv_writer = csv.writer(csv_file)

    # Write header
    csv_writer.writerow(
        ["Date", "Right Ascension", "Declination", "Cumulative Rotation"]
    )

    # Write data
    csv_writer.writerows(data_list)
print("==========================================")
print(f"✅ CSV file '{csv_file_path}' generated successfully.")
print("==========================================")