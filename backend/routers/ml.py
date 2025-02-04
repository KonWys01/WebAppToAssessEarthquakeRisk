from fastapi import APIRouter, Depends, status, HTTPException

machinelearning_router = APIRouter(
    prefix='/machine_learning',
    tags=['machinelearning']
)

@machinelearning_router.get("/{id}")
async def get_prediction_per_polygon():
    return None
    # crud_data = get_multiple_earthquakes(
    #     db=db,
    #     mag_min=mag_min,
    #     mag_max=mag_max,
    #     date_start=date_start,
    #     date_end=date_end,
    #     coordinates=coordinates,
    #     type_eq=type
    # )
    # return ResponseModel(
    #     data=crud_data,
    #     status_code=status.HTTP_200_OK,
    #     count=len(crud_data)
    # )