import { Router } from "express";

const router = Router();

router.get("/test1", (req, res) => {
  res.json({ message: "GET /test1" });
});

export default router;
