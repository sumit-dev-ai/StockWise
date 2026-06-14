import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { createPurchaseService, getPurchaseByIdService, getPurchasesService } from "./purchase.service";
import ApiResponse from "../../utils/ApiResponse";

export const createPurchase = asyncHandler(
  async (req: Request, res: Response) => {
    const user_id = req.user!.id;

    const purchase = await createPurchaseService(user_id, req.body);

    return res
      .status(201)
      .json(new ApiResponse(201, purchase, "Purchase recorded successfully."));
  }
);

export const getPurchases = asyncHandler(
  async (req: Request, res: Response) => {
    const user_id = req.user!.id;

    const purchases = await getPurchasesService(user_id);

    return res
      .status(200)
      .json(new ApiResponse(200, purchases, "Purchases fetched successfully."));
  }
);

export const getPurchaseById = asyncHandler(
  async (req: Request, res: Response) => {
    const user_id = req.user!.id;
    const purchase_id = Number(req.params.id);

    const purchase = await getPurchaseByIdService(user_id, purchase_id);

    return res
      .status(200)
      .json(new ApiResponse(200, purchase, "Purchase fetched successfully."));
  }
);