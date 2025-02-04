from fastapi import APIRouter, Depends, status, HTTPException

machinelearning_router = APIRouter(
    prefix='/machine_learning',
    tags=['machinelearning']
)

@machinelearning_router.get("/{id}")
async def get_prediction_per_polygon():
    return None