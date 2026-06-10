import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import { createSupplierSchema, updateSupplierSchema } from "./supplier.validation";
import { supplierService } from "./supplier.service";
import ApiResponse from "../../utils/ApiResponse";


export const createSupplierHandler = asyncHandler(async(req: Request , res : Response)=>{
    if (!req.user) {
        throw new ApiError(401, "Unauthorzed");
    }

    const parsData = createSupplierSchema.parse(req.body);

    const supplier = await supplierService.createSupplier(req.user?.id , parsData);

    return res.status(201).json(
        new ApiResponse(201, supplier , "Supplier Created Succesfully")
    );
})



export const getSuppliers = asyncHandler(async(req: Request , res : Response)=>{
    if (!req.user) {
        throw new ApiError(401, "Unauthorzed");
    }

    const suppliers = await supplierService.getMySuppliers(
        req.user.id
    );

    return res.status(200)
    .json(
        new ApiResponse(200 , suppliers , "Suppliers created successfully")
    )


})

export const getSupplierById = asyncHandler(
  async (req: Request, res: Response) =>{
     if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    const supplierId = Number(req.params.id);

    if (!supplierId || Number.isNaN(supplierId)) {
      throw new ApiError(400, "Invalid supplier id");
    }
        const supplier = await supplierService.getSupplierById(
      req.user.id,
      supplierId
    );

    return res
      .status(200)
      .json(new ApiResponse(200, supplier, "Supplier fetched successfully"));
  });

export const updateSupplier = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const supplierId = Number(req.params.id);

    if (!supplierId || Number.isNaN(supplierId)) {
      throw new ApiError(400, "Invalid supplier id");
    }

    const parsedData = updateSupplierSchema.parse(req.body);

    const supplier = await supplierService.updateSupplier(
      req.user.id,
      supplierId,
      parsedData
    );

    return res
      .status(200)
      .json(new ApiResponse(200, supplier, "Supplier updated successfully"));
  }
);

export const deactivateSupplier = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const supplierId = Number(req.params.id);

    if (!supplierId || Number.isNaN(supplierId)) {
      throw new ApiError(400, "Invalid supplier id");
    }

    await supplierService.deactivateSupplier(req.user.id, supplierId);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Supplier deactivated successfully"));
  }
);
