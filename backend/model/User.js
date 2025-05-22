import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const Note = db.define(
  "users",
  {
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    refresh_token: {
      type: Sequelize.TEXT,
    },
  },
  {
    timestamps: true,
  }
);

export default Note;

(async () => {
  await db.sync();
})();
