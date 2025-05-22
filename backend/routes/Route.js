import express from "express";
import * as NoteController from "../controller/NoteController.js";
import * as UserController from "../controller/UserController.js";
import * as PageController from "../controller/PageController.js";
import verifyToken from "../middleware/verifyToken.js";
import { getAccessToken } from "../controller/TokenController.js";

const router = express.Router();

router.get("/notes", verifyToken, NoteController.getNotes);
router.get("/notes/:id", verifyToken, NoteController.getNoteById);
router.post("/notes", verifyToken, NoteController.createNote);
router.put("/notes/:id", verifyToken, NoteController.updateNote);
router.delete("/notes/:id", verifyToken, NoteController.deleteNote);

router.get("/", PageController.index);
router.get("/login", PageController.login);
router.get("/register", PageController.register);

router.post("/login", UserController.login);
router.post("/register", UserController.register);

router.get("/token", getAccessToken);

export default router;
