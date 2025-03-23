import { Sequelize } from "sequelize";

const db = new Sequelize("RECOVER_YOUR_DATA", "root", "", {
  host: "23.251.145.171",
  dialect: "mysql",
});

export default db;
