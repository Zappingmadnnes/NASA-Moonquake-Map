import sys
import numpy as np
from jplephem.spk import SPK
import json

# Open the DE440S.BSP file
kernel = SPK.open("de440s.bsp")

# Define the center and target identifiers for the Sun, Earth, and Moon
center_id_solar_system = 0  # Solar System Barycenter
target_id_sun = 10  # Sun
center_id_earth = 3  # Earth barycenter
target_id_earth = 399  # Earth
target_id_moon = 301  # Moon

def get_coordinates_for_date(julian_date):
    # Compute positions for the given Julian date
    sun_position = kernel[center_id_solar_system, target_id_sun].compute(julian_date)
    earth_center_position = kernel[center_id_solar_system, center_id_earth].compute(julian_date)
    earth_position = kernel[center_id_earth, target_id_earth].compute(julian_date)
    moon_position = kernel[center_id_earth, target_id_moon].compute(julian_date)
    
    return {
        "sun": sun_position.tolist(),
        "earth_center": earth_center_position.tolist(),
        "earth": earth_position.tolist(),
        "moon": moon_position.tolist()
    }

if __name__ == "__main__":
    julian_date = float(sys.argv[1])  # Accept Julian date as an argument
    coordinates = get_coordinates_for_date(julian_date)
    print(json.dumps(coordinates))