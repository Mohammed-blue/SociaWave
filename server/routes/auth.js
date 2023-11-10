import express from "express";
import { login } from "../controllers/auth.js";

// Create an instance of Express Router
const router = express.Router();

// Define the route for handling login requests
router.post('/login', login);

export default router;