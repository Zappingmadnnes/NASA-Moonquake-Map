import numpy as np
from jplephem.spk import SPK
import csv
import datetime

# Open the DE440S.BSP file
kernel = SPK.open("de440s.bsp")

# Specify the start and end date for the month you want to extract data
start_date = 2440546  # Example start date
end_date = start_date + 365 * 10  # Assuming a 30-day month

# Define the center and target identifiers for the Sun, Earth, and Moon
center_id_solar_system = 0  # Solar System Barycenter
target_id_sun = 10  # Sun
center_id_earth = 3  # Earth barrycenter
target_id_earth = 399  # Earth
target_id_moon = 301  # Moon


# Function to extract and save data to a CSV file
def save_data_to_csv(output_file, center_id, target_id, start_date, end_date):
    with open(output_file, "w", newline="") as csvfile:
        csvwriter = csv.writer(csvfile)

        # Write the header
        csvwriter.writerow(["Date", "X (km)", "Y (km)", "Z (km)"])

        # Loop through the date range in hourly increments
        current_date = start_date
        while current_date <= end_date:
            # Compute the position for the current date
            position = kernel[center_id, target_id].compute(current_date)

            # Convert Julian Date to a more readable format with hours and minutes
            date_time = datetime.datetime(2000, 1, 1) + datetime.timedelta(
                days=current_date - 2451545.0
            )
            formatted_date = date_time.strftime(
                "%Y-%m-%d %H:%M"
            )  # Format as Year-Month-Day Hour:Minute

            # Write the data row for the current date and position
            csvwriter.writerow([current_date] + position.tolist())

            # Increment the date by one hour
            current_date += 1 / 24  # Increment by 1 day


# Save data for the Sun
output_file_sun = "sun_positions_monthly.csv"
save_data_to_csv(
    output_file_sun, center_id_solar_system, target_id_sun, start_date, end_date
)
print(f"Data for the Sun has been saved to {output_file_sun}")

# Save data for the Earth
output_file_earth = "earth_center_monthly.csv"
save_data_to_csv(
    output_file_earth, center_id_solar_system, center_id_earth, start_date, end_date
)
print(f"Data for Earth center has been saved to {output_file_earth}")

# Save data for the Earth
output_file_earth = "earth_positions_monthly.csv"
save_data_to_csv(
    output_file_earth, center_id_earth, target_id_earth, start_date, end_date
)
print(f"Data for Earth has been saved to {output_file_earth}")

# Save data for the Moon
output_file_moon = "moon_positions_monthly.csv"
save_data_to_csv(
    output_file_moon, center_id_earth, target_id_moon, start_date, end_date
)
print(f"Data for the Moon has been saved to {output_file_moon}")