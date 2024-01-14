from fastapi import APIRouter, Depends, status, HTTPException

earthquake_router = APIRouter(
    prefix='/machine_learning',
    tags=['machinelearning']
)