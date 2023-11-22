import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js"

const router = express.Router();

/* READE */
/* READ Endpoint to fetch user data */
router.get("/:id", verifyToken, getUser);
/* READ Endpoint to get a user's friends */
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
/* UPDATE Endpoint to add or remove friends */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;

