import { Router } from "express";

const router = Router();

router.get("/test", (req, res) => {
  res.json({ message: "GET /test" });
});

router.post("/test", (req, res) => {
  res.json({ message: "POST /test", body: req.body });
});

export default router;
