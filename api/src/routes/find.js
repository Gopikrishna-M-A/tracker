import express from 'express';
import { findDriver, findClosestDriver }  from '../controllers/find.js';
const router = express.Router();

router.get("/find-closest-driver/:patientId", findClosestDriver)
router.get("/find-driver/:patientId", findDriver)


export default router;
