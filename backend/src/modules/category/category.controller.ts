import { Request, Response } from "express";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { storeCategoryService } from "./category.service";
import { createCustomCategorySchema, selectMasterCategoriesSchema } from "./category.validation";

export const getMyStoreCategories = asyncHandler(
  async (req: Request, res: Response) => {


    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const categories = await storeCategoryService.getMyStoreCategories(
      req.user.id
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Store categories fetched successfully"
        )
      );
  }
);

export const selectMasterCategories = asyncHandler(
  async (req: Request, res: Response) => {

    
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const parsedData = selectMasterCategoriesSchema.parse(req.body);

    const categories = await storeCategoryService.selectFromMasterCategories(
      req.user.id,
      parsedData
    );

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          categories,
          "Categories added to your store successfully"
        )
      );
  }
);

export const createCustomCategory = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const parsedData = createCustomCategorySchema.parse(req.body);

    const category = await storeCategoryService.createCustomCategory(
      req.user.id,
      parsedData
    );

    return res
      .status(201)
      .json(
        new ApiResponse(201, category, "Custom category created successfully")
      );
  }
);

export const deactivateStoreCategory = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const categoryId = Number(req.params.id);

    if (!categoryId || Number.isNaN(categoryId)) {
      throw new ApiError(400, "Invalid category id");
    }

    await storeCategoryService.deactivateStoreCategory(req.user.id, categoryId);

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Store category deactivated successfully")
      );
  }
);