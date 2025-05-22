import jwt from "jsonwebtoken"; // Tambahkan ini
import dotenv from "dotenv"; // Tambahkan ini
dotenv.config(); // Tambahkan ini

const ACCESS_TOKEN = process.env.ACCESS_TOKEN; // Tambahkan ini

export const verifyToken = (req, res, next) => {
  console.log("==== HEADERS ====");
  console.log(req.headers); //  Cek semua header yang diterima

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Received Token:", token); // Sudah ada

  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, ACCESS_TOKEN, (error, decoded) => {
    if (error) return res.sendStatus(403); // Forbidden
    req.username = decoded.username;
    next();
  });
};
