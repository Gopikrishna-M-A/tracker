import express from 'express';
import { addDriver, getDriver, deleteDriver, updateDriver, getDriverforHospital }  from '../controllers/driver.js';
const router = express.Router();

router.post("/", addDriver)
router.get("/:id", getDriver)
router.delete("/:id", deleteDriver)
router.patch("/:id", updateDriver)

router.get("/get-hospital-driver/:hospitalId", getDriverforHospital)

export default router;
