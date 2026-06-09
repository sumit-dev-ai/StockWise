import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { getAllMasterCategories } from "./masterCategory.service";
import ApiResponse from "../../utils/ApiResponse";


export const getMasterCategories = asyncHandler(async (req : Request , res: Response)=>{
    const categories = await getAllMasterCategories();

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            categories
            ,
            "Categories fetched Succesfully"
        )
    )

})