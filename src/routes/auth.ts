// src/routes/auth.ts
import express from "express";
import { createUser, findUserByEmail } from "../services/userServices";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const user = await createUser({ userInput: { email, password, username } });
    res.json(user);
    console.log("WORKING");
  } catch (error) {
    res.status(400).json({ error: "User registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).json({ error: "Login failed" });
  }
});

export default router;
