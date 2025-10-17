import {Router} from 'express';
const userRouter = Router();
import userController from '../controllers/userController.js';
import { validation } from '../middlewares/validation.js';
import { createUserValidation, loginValidation } from '../validations/userValidation.js';
import { verifyToken } from '../middlewares/authentication.js';

userRouter.post('/register', validation(createUserValidation), userController.createUser);
userRouter.post('/login', validation(loginValidation), userController.login);
userRouter.post('/logout', verifyToken, userController.logout);
userRouter.post('/refresh-token', userController.refreshToken);
export default userRouter;
