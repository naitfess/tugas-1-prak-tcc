import { Sequelize } from "sequelize";

const db = new Sequelize("tugas_note", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
