import mysql from "mysql";
import { dbConfig } from "../configs/db.config";

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.log("Can not connect to the database::", err);
  } else {
    console.log("Successfully connected to the database");
  }
});

export default db;
