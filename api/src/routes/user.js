import express from 'express';
import { addUser, getUserByEmail, getUser, deleteUser, updateUser, getUsers }  from '../controllers/user.js';
const router = express.Router();

router.post("/", addUser)
router.get("/email/:id", getUserByEmail)
router.get("/:id", getUser)
router.get("/", getUsers)
router.delete("/:id", deleteUser)
router.patch("/:id", updateUser)





export default router;

