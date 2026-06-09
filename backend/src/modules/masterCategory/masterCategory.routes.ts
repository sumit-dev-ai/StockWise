import { Router } from "express";
import { getMasterCategories } from "./masterCategory.controller";
import { verifyAuth } from "../../middlewares/verifyAuth";

const router = Router();

//  router.get("/", getMasterCategories) // for checking only
router.get("/",verifyAuth, getMasterCategories)

export default router;