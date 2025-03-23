import Note from "../model/Note.js";

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.json(notes);
  } catch (error) {
    res.json({ message: error });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    res.json(note);
  } catch (error) {
    res.json({ message: error });
  }
};

export const createNote = async (req, res) => {
  const { title, description } = req.body;
  try {
    const note = await Note.create({ title, description });
    res.json(note);
  } catch (error) {
    res.json({ message: error });
  }
};

export const updateNote = async (req, res) => {
  const { title, description } = req.body;
  try {
    const note = await Note.update(
      { title, description },
      { where: { id: req.params.id } }
    );
    res.json(note);
  } catch (error) {
    res.json({ message: error });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.destroy({ where: { id: req.params.id } });
    res.json(note);
  } catch (error) {
    res.json({ message: error });
  }
};
