import { Router } from "express"
import { login, getUsers, addUser, findUserById, updateUser, deleteUser, passwordUpdate } from "../controllers/UserController";
import { verifyToken } from "../common/validations/auth-validations";
import { addScehma, validateSchema } from "../common/validations/input-validation";
import * as userSchema from "../modules/users/schema.json"

const userRouter = Router()

addScehma(userSchema, 'user')

userRouter.post('/login', login)
userRouter.get("/", verifyToken, getUsers)
userRouter.post("/", validateSchema('user'), verifyToken, addUser)
userRouter.get("/:id", verifyToken, findUserById)
userRouter.put("/:id", validateSchema('user'), verifyToken, updateUser)
userRouter.delete("/:id", verifyToken, deleteUser)
userRouter.patch("/reset_password/:id", verifyToken, passwordUpdate)

export { userRouter }