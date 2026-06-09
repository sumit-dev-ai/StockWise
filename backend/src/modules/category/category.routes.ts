import { Router } from "express";
import { verifyAuth } from "../../middlewares/verifyAuth";
import { createCustomCategory, deactivateStoreCategory, getMyStoreCategories, selectMasterCategories } from "./category.controller";

const router = Router();

router.use(verifyAuth);

router.get("/", getMyStoreCategories);
router.post("/select", selectMasterCategories);
router.post("/", createCustomCategory);
router.patch("/:id/deactivate", deactivateStoreCategory);

export default router;