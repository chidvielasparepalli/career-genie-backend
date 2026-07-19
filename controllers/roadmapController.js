import { askAI, generateCustomRoadmap } from "../services/geminiService.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function handleAskAI(req, res) {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }
    const answer = await askAI(question);
    res.json({ answer });
  } catch (error) {
    console.error("Ask AI Error:", error);
    res.status(500).json({ error: error.message || "Failed to process question" });
  }
}

export async function handleGenerateRoadmap(req, res) {
  try {
    const { studentDetails, career } = req.body;
    if (!career) {
      return res.status(400).json({ error: "Career target is required" });
    }

    const customData = await generateCustomRoadmap(studentDetails || {}, career);
    if (customData) {
      return res.json({ success: true, roadmap: customData });
    }

    // Fallback response if Gemini AI API key is not available or errors out
    res.json({
      success: true,
      roadmap: {
        overview: `A structured learning journey to master ${career}.`,
        timeline: "6 to 12 months",
        semesterLearning: [
          `Fundamentals & Basics for ${career}`,
          "Core Skill Development & Practice Projects",
          "Advanced Concepts & Real-World Portfolio",
          "Interview Prep & Job Application"
        ],
        skills: ["Core Engineering", "Problem Solving", "Domain Knowledge"],
        technologies: ["Git", "VS Code", "Industry Standard Tools"],
        certifications: ["Professional Certificate"],
        interviewPrep: ["Mock Interviews", "DSA / Technical Q&A Practice"],
        resumeTips: ["Quantify achievements", "Highlight portfolio link"],
        softSkills: ["Communication", "Team Collaboration"],
        jobRoles: [`Junior ${career}`, `${career} Specialist`],
        salaryInsights: "Competitive Industry Pay"
      }
    });
  } catch (error) {
    console.error("Generate Roadmap Controller Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

export function handleGetCareers(req, res) {
  try {
    const filePath = path.join(__dirname, "..", "data", "careers.json");
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      res.json(JSON.parse(data));
    } else {
      res.status(404).json({ error: "Careers database file not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
