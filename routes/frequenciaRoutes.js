import express from 'express';
import { baixarPdfAssinado } from "../controllers/frequenciaController.js";

const router = express.Router();

router.get('/baixar/:documentId', baixarPdfAssinado);

export default router;