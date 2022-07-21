import connection from "../config/db.js";

export async function getCategories(_req, res) {
  try {
    const { rows: categories } = await connection.query(
      "SELECT * FROM categories"
    );

    return res.status(200).send(categories);
  } catch (err) {
    return res.sendStatus(500);
  }
}

export async function postCategories(_req, res) {
  const { name } = res.locals;

  try {
    await connection.query("INSERT INTO categories (name) VALUES ($1)", [name]);

    return res.sendStatus(201);
  } catch (err) {
    return res.sendStatus(500);
  }
}
