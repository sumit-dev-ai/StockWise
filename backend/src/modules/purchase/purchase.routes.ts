import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { verifyAuth } from "../../middlewares/verifyAuth";
import { createPurchase, getPurchaseById, getPurchases } from "./purchase.controller";
import { createPurchaseSchema } from "./purchase.validation";

const router = Router();

router.use(verifyAuth);

router.route("/")
  .post(validate(createPurchaseSchema), createPurchase)
  .get(getPurchases);

router.get("/:id", getPurchaseById);

export default router;