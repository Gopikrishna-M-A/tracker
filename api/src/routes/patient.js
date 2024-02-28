import express from 'express';
import { addPatient, getPatient, deletePatient, updatePatient }  from '../controllers/patient.js';
const router = express.Router();

router.post("/", addPatient)
router.get("/:id", getPatient)
router.delete("/:id", deletePatient)
router.patch("/:id", updatePatient)

export default router;
