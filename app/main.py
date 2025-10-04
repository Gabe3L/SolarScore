from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import random

from utils.energy_output import *
from utils.environmental_impact import *
from utils.financials import *
from utils.geolocation import get_gps_coordinates
from utils.roof_analysis import *
from utils.solar_potential import *
from utils.visualization import *

###############################################################################################

class AddressRequest(BaseModel):
    address: str

class SolarEstimate(BaseModel):
    address: str
    latitude: float
    longitude: float
    roof_area_m2: float
    solar_potential_score: float
    system_capacity_kw: float
    monthly_generation_kwh: float
    annual_generation_kwh: float
    monthly_savings_usd: float
    annual_savings_usd: float
    system_cost_usd: float
    payback_years: float
    roi_20yr_percent: float
    annual_co2_tonnes: float
    trees_equivalent: int
    cars_removed: float
    roof_overlay_url: Optional[str] = None

######################################################################################

def solar_estimate(address: str) -> SolarEstimate:
    lat, lon = get_gps_coordinates(address)

    panel_efficiency = 0.18
    score = random.uniform(50, 95)
    area = random.uniform(30, 80)
    system_size = area * panel_efficiency
    annual_kwh = system_size * 1100  # 1100 kWh/kW/year typical value
    monthly_kwh = annual_kwh / 12
    monthly_savings = monthly_kwh * 0.18
    annual_savings = monthly_savings * 12
    cost = system_size * 2500  # $/kW
    payback = cost / annual_savings
    roi = ((annual_savings * 20) - cost) / cost * 100
    co2 = annual_kwh * 0.455 / 1000  # tonnes
    trees = int(co2 * 16.5)
    cars = round(co2 / 4.6, 2)

    return SolarEstimate(
        address=address,
        latitude=lat,
        longitude=lon,
        roof_area_m2=area,
        solar_potential_score=score,
        system_capacity_kw=round(system_size, 2),
        monthly_generation_kwh=round(monthly_kwh, 1),
        annual_generation_kwh=round(annual_kwh, 1),
        monthly_savings_usd=round(monthly_savings, 2),
        annual_savings_usd=round(annual_savings, 2),
        system_cost_usd=round(cost, 2),
        payback_years=round(payback, 1),
        roi_20yr_percent=round(roi, 1),
        annual_co2_tonnes=round(co2, 2),
        trees_equivalent=trees,
        cars_removed=cars,
        roof_overlay_url=f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lon}&zoom=18&size=600x600&maptype=satellite"
    )

######################################################################################

app = FastAPI(title="SolarSpot Backend", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok"}

@app.post("/analyze", response_model=SolarEstimate)
async def analyze_address(req: AddressRequest):
    if not req.address or len(req.address) < 3:
        raise HTTPException(status_code=400, detail="Invalid address.")
    return solar_estimate(req.address)