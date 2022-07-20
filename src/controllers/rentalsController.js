import connection from "../config/db.js";

export async function getRentals(_req, res) {
  try {
    const { rows: rentals } = await connection.query("SELECT * FROM rentals");

    return res.status(200).send(rentals);
  } catch (err) {
    return res.sendStatus(500);
  }
}
