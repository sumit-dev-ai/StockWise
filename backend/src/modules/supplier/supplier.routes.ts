import { Router } from "express";
import { verifyAuth } from "../../middlewares/verifyAuth";
import { createSupplierHandler, deactivateSupplier, getSupplierById, getSuppliers, updateSupplier } from "./supplier.controller";


const router = Router();

router.use(verifyAuth);

router.post("/", createSupplierHandler);
router.get("/", getSuppliers);
router.get("/:id", getSupplierById);
router.patch("/:id", updateSupplier);
router.patch("/:id/deactivate", deactivateSupplier);

export default router;