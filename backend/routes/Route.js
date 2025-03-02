import express from "express";
import * as NoteController from "../controller/NoteController.js";

const router = express.Router();

router.get("/notes", NoteController.getNotes);
router.get("/notes/:id", NoteController.getNoteById);
router.post("/notes", NoteController.createNote);
router.put("/notes/:id", NoteController.updateNote);
router.delete("/notes/:id", NoteController.deleteNote);

export default router;
