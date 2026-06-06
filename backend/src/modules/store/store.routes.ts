import { Router } from "express";
import { createStoreSchema, updateStoreSchema } from "./store.validation";
import { createStoreController, getMyStore, updateMyStore } from "./store.controller";
import { verifyAuth } from "../../middlewares/verifyAuth";
import { validate } from "../../middlewares/validate.middleware";


const router = Router();

router.use(verifyAuth);

router.post("/", validate(createStoreSchema), createStoreController);
router.get("/me", getMyStore);
router.patch("/me", validate(updateStoreSchema), updateMyStore);

export default router;