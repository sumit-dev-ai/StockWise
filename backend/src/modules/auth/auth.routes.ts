import { Router } from "express";
import { getCurrentUser, googleLogin, logoutUser } from "./auth.controller";
import { verifyAuth } from "../../middlewares/verifyAuth";

const router = Router();

router.post("/google", googleLogin);
router.get("/me",verifyAuth, getCurrentUser);
router.post("/logout", verifyAuth, logoutUser);
export default router;