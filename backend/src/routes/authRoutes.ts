import { Router } from "express";
import { register, login } from "../controllers/authControllers";
import { loginValidator, registerValidator } from "../validators/authValidator";
import { validate } from "../middlewares/validatorMiddleware";

const router = Router();

router.post("/register", registerValidator, validate, register);
router.post("/login",loginValidator,validate, login);

export default router;
