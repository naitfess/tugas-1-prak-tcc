import { Sequelize } from "sequelize";

const db = new Sequelize("db-alung", "root", "", {
  host: "34.170.57.16",
  dialect: "mysql",
});

export default db;
