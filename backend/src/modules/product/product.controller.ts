import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { createProductService, deactivateProductService, getLowStockProductsService, getProductByIdService, getProductService, updateProductService } from "./product.service";
import ApiResponse from "../../utils/ApiResponse";


export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const user_id= req.user!.id;

    const product =await createProductService(user_id, req.body);

    return res
      .status(201)
      .json(
        new ApiResponse(201, product, "Product created successfully.")
      );
  }
);

export const getProducts =asyncHandler(
  async (req: Request, res: Response) => {
    const user_id = req.user!.id;

    const filters = {
      search: req.query.search as string | undefined,
      store_category_id: req.query.store_category_id
        ? Number(req.query.store_category_id)
        : undefined,
      supplier_id: req.query.supplier_id
        ? Number(req.query.supplier_id)
        : undefined,
      is_active:
        req.query.is_active === undefined
          ? undefined
          :req.query.is_active === "true",
    };

    const products =await getProductService(user_id, filters);

    return res
      .status(200)
      .json(new ApiResponse(200, products, "Products fetched successfully."));
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const user_id = req.user!.id;
    const product_id =Number(req.params.id);

    const product = await getProductByIdService(user_id, product_id);

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully."));
  }
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const user_id = req.user!.id;
    const product_id= Number(req.params.id);

    const product= await updateProductService(user_id, product_id, req.body);

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product updated successfully."));
  }
);

export const deactivateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const user_id = req.user!.id;
    const product_id = Number(req.params.id);

    const result = await deactivateProductService(user_id, product_id);

    return res
      .status(200).json(new ApiResponse(200, result, "Product deactivated successfully."));
  }
);

export const getLowStockProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const user_id = req.user!.id;

    const products = await getLowStockProductsService(user_id);

    return res
      .status(200)
      .json(
        new ApiResponse(200, products, "Low-stock products fetched successfully.")
      );
  }
);