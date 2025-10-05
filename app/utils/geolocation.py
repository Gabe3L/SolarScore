
import requests

def get_gps_coordinates(address: str) -> tuple[float, float]:
    if not address:
        raise ValueError("Address cannot be empty.")

    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": address,
        "format": "json",
        "limit": 1
    }
    headers = {
        "User-Agent": "SolarScore/1.0 (contact@gabelynch.com)" 
    }

    response = requests.get(url, params=params, headers=headers)
    if response.status_code != 200:
        raise ValueError(f"Geocoding request failed with status {response.status_code}")

    data = response.json()
    if not data:
        raise ValueError(f"No coordinates found for address: {address}")

    lat = float(data[0]["lat"])
    lon = float(data[0]["lon"])
    return lat, lon


if __name__ == "__main__":
    test_address = "450 Millbank Dr, London, ON N6C 4W7"
    try:
        lat, lon = get_gps_coordinates(test_address)
        print(f"Address: {test_address}")
        print(f"Latitude: {lat:.6f}, Longitude: {lon:.6f}")
    except ValueError as e:
        print(f"Error: {e}")