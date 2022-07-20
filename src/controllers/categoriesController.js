import connection from "../config/db.js";

export async function getCategories(_req, res) {
  try {
    const { rows: categories } = await connection.query(
      'SELECT * FROM categories'
    );

    return res.status(200).send(categories);
  } catch (err) {
    return res.sendStatus(500);
  }
}
