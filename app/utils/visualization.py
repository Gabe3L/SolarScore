import math
import json
import requests
from urllib.parse import urlencode
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
from typing import List, Tuple, Optional

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
LOCATIONIQ_API_KEY = "pk.6105afa85e05418f4cef0629ebcb4915"
LOCATIONIQ_STATICMAP = "https://maps.locationiq.com/v2/staticmap"

def haversine_m(lat1, lon1, lat2, lon2):
    R = 6371000.0
    φ1, φ2 = math.radians(lat1), math.radians(lat2)
    Δφ, Δλ = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(Δφ / 2) ** 2 + math.cos(φ1) * math.cos(φ2) * math.sin(Δλ / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def fetch_building_footprint(lat: float, lon: float, radius: int = 50) -> Optional[dict]:
    query = f"""
    [out:json][timeout:25];
    (
      way(around:{radius},{lat},{lon})[building];
      relation(around:{radius},{lat},{lon})[building];
    );
    out body geom;
    """
    resp = requests.post(OVERPASS_URL, data=query, timeout=25)
    if resp.status_code != 200:
        raise RuntimeError(f"Overpass API error: {resp.status_code}")

    elements = resp.json().get("elements", [])
    if not elements:
        return None
    def footprint_area(geom):
        if len(geom) < 3:
            return 0
        total = 0
        for i in range(len(geom)):
            lat1, lon1 = geom[i]["lat"], geom[i]["lon"]
            lat2, lon2 = geom[(i + 1) % len(geom)]["lat"], geom[(i + 1) % len(geom)]["lon"]
            total += (lon1 * lat2 - lon2 * lat1)
        return abs(total) / 2

    best = max(elements, key=lambda el: footprint_area(el.get("geometry", [])), default=None)
    if not best or "geometry" not in best:
        return None

    coords = [(p["lat"], p["lon"]) for p in best["geometry"]]
    return {"coords": coords, "tags": best.get("tags", {})}

def estimate_building_dimensions(coords: List[Tuple[float, float]], tags: dict) -> Tuple[float, float]:
    lats, lons = [c[0] for c in coords], [c[1] for c in coords]
    minlat, maxlat, minlon, maxlon = min(lats), max(lats), min(lons), max(lons)
    mean_lat = (minlat + maxlat) / 2
    width_m = haversine_m(mean_lat, minlon, mean_lat, maxlon)
    depth_m = haversine_m(minlat, (minlon + maxlon) / 2, maxlat, (minlon + maxlon) / 2)

    height_m = None
    if "height" in tags:
        try:
            height_m = float(tags["height"].split()[0])
        except Exception:
            pass
    elif "building:levels" in tags:
        try:
            height_m = float(tags["building:levels"]) * 3.0
        except Exception:
            pass

    return (max(width_m, depth_m), height_m or 6.0)

def generate_top_down(lat: float, lon: float, zoom: int = 19, size=(800, 800)) -> str:
    params = {
        "key": LOCATIONIQ_API_KEY,
        "center": f"{lat},{lon}",
        "zoom": zoom,
        "size": f"{size[0]}x{size[1]}",
        "format": "png",
        "markers": f"icon:large-red-cutout|{lat},{lon}"
    }
    url = f"{LOCATIONIQ_STATICMAP}?{urlencode(params)}"
    resp = requests.get(url, timeout=30)
    if resp.status_code != 200:
        raise RuntimeError(f"Failed to get static map: {resp.status_code}")

    img = Image.open(BytesIO(resp.content))
    out_path = "top_down.png"
    img.save(out_path)
    return out_path

def generate_front_view(coords: List[Tuple[float, float]], tags: dict, out_path="front_view.png"):
    """Generate a simple front elevation from footprint dimensions."""
    width_m, height_m = estimate_building_dimensions(coords, tags)
    img = Image.new("RGB", (800, 600), "white")
    draw = ImageDraw.Draw(img)
    margin = 40
    base_y = 560
    px_per_m = 600 / width_m

    building_w = width_m * px_per_m
    building_h = height_m * px_per_m
    left_x = (800 - building_w) / 2
    top_y = base_y - building_h

    # Building
    draw.rectangle([left_x, top_y, left_x + building_w, base_y], fill="#dddddd", outline="black", width=2)
    # Roof
    draw.polygon([(left_x, top_y), (left_x + building_w, top_y), (400, top_y - 0.25 * building_h)], fill="#d0b080", outline="black")
    # Door
    door_w, door_h = building_w / 8, building_h / 3
    door_x = 400 - door_w / 2
    draw.rectangle([door_x, base_y - door_h, door_x + door_w, base_y], fill="#7a5230", outline="black")

    try:
        font = ImageFont.load_default()
        text = f"Width ≈ {width_m:.1f} m | Height ≈ {height_m:.1f} m"
        draw.text((margin, 10), text, fill="black", font=font)
    except Exception:
        pass

    img.save(out_path)
    return out_path, width_m, height_m


def create_visualization(lat: float, lon: float):
    """Main entry point: returns paths + dimensions."""
    footprint = fetch_building_footprint(lat, lon)
    if footprint:
        coords, tags = footprint["coords"], footprint["tags"]
    else:
        coords = [(lat, lon), (lat, lon + 0.0001), (lat + 0.00005, lon + 0.0001), (lat + 0.00005, lon)]
        tags = {}

    top_path = generate_top_down(lat, lon)
    front_path, width_m, height_m = generate_front_view(coords, tags)

    return {
        "front_view": front_path,
        "top_down": top_path,
        "width_m": round(width_m, 1),
        "height_m": round(height_m, 1),
    }


if __name__ == "__main__":
    lat, lon = 42.947291, -81.206586  # Example: Sir Wilfrid Laurier S.S., London ON
    result = create_visualization(lat, lon)
    print(json.dumps(result, indent=2))
