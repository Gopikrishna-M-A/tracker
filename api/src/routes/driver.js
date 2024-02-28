import express from 'express';
import { addDriver, getDriver, deleteDriver, updateDriver }  from '../controllers/driver.js';
const router = express.Router();

router.post("/", addDriver)
router.get("/:id", getDriver)
router.delete("/:id", deleteDriver)
router.patch("/:id", updateDriver)

export default router;
