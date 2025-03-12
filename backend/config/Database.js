import { Sequelize } from "sequelize";

const db = new Sequelize("notes_alung", "root", "", {
  host: "23.251.145.171",
  dialect: "mysql",
});

export default db;
