import express from 'express';
import { findDriver }  from '../controllers/find.js';
const router = express.Router();

router.get("/find-closest-driver/:patientId", findDriver)


export default router;
