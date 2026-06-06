import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { createStoreService, findStoreByUserId, updateStoreService } from "./store.service";
import ApiResponse from "../../utils/ApiResponse";


//Crete Store Controller
export const createStoreController = asyncHandler(async (req: Request, res: Response) => {
    const userId  = req.user?.id;
    const data = req.body
    const store = await createStoreService(userId!, data);

    return res.status(201)
    .json(
        new ApiResponse(
            201, { store } , "Store is created succesfully" 
        )
    );
})
// getting store info.
export const getMyStore = asyncHandler(async (req :Request , res : Response)=>{
    const userId = req.user?.id;
    const store = await findStoreByUserId(userId!)

    return res.status(200)
    .json(
        new ApiResponse(

            200,  { store  } , "Fetching store details successfully"
        )
    );
})
// update controller
export const updateMyStore = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const store = await updateStoreService(userId!, req.body);

    return res.status(200).json(
      new ApiResponse(
        200,
        { store },
        "Store updated successfully"
      )
    );
  }
);