import { Router } from "express";
import { verifyAuth } from "../../middlewares/verifyAuth";
import { createProductSchema, updateProductSchema } from "./product.validation";
import { createProduct, deactivateProduct, getLowStockProducts, getProductById, getProducts, updateProduct } from "./product.controller";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.use(verifyAuth);

router.route("/").post(validate(createProductSchema), createProduct)
  .get(getProducts);

router.get("/low-stock", getLowStockProducts);

router.route("/:id").get(getProductById)
  .patch(validate(updateProductSchema), updateProduct)
  .delete(deactivateProduct);

export default router;