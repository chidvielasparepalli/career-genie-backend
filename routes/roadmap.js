import express from "express";
import { handleAskAI, handleGenerateRoadmap, handleGetCareers } from "../controllers/roadmapController.js";

const router = express.Router();

router.post("/ask-ai", handleAskAI);
router.post("/generate-roadmap", handleGenerateRoadmap);
router.get("/careers", handleGetCareers);

export default router;
