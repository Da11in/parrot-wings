import db from "./dbService";

export const getUserById = async (id: number) =>
  db.query(`SELECT * from users WHERE id=${id}`, (error, results, fields) => {
    if (error) {
      throw new Error(error.message);
    }
    return results[0];
  });
