import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import roadmapRouter from "./routes/roadmap.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", roadmapRouter);
app.post("/ask-ai", (req, res, next) => {
  req.url = "/api/ask-ai";
  app.handle(req, res, next);
});

// Serve static assets if dist exists
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  if (req.accepts("html")) {
    const indexPath = path.join(distPath, "index.html");
    if (express.static(indexPath)) {
      return res.sendFile(indexPath, (err) => {
        if (err) {
          res.send("Server running. Frontend available via Vite dev server at http://localhost:5173");
        }
      });
    }
  }
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 CareerGeenieAI Server Running on http://localhost:${PORT}`);
});
