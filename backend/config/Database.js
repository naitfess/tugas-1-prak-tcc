import { Sequelize } from "sequelize";

const db = new Sequelize("db-alung", "root", "slemanmagelang", {
  host: "34.66.179.32",
  dialect: "mysql",
});

export default db;
