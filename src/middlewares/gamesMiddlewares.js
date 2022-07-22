import connection from "../config/db.js";

import { gamesBodySchema } from "../schemas/gamesSchemas.js";

export function validationGameBody(req, res, next) {
  const gamesValidation = gamesBodySchema.validate(req.body);

  if (gamesValidation.error) {
    return res.status(400).send({
      message: "Invalid body format",
      detail: gamesValidation.error.details[0].message,
    });
  }

  next();
}

export async function checkNameDuplicate(req, res, next) {
  const { name } = req.body;

  try {
    const { rows: games } = await connection.query(
      "SELECT name FROM games WHERE name=$1",
      [name]
    );

    if (games.length !== 0)
      return res.status(409).send("Game name already exist");
  } catch (err) {
    return res.sendStatus(500);
  }

  next();
}

export async function checkIfExistCategoryId(req, res, next) {
  const { categoryId } = req.body;

  try {
    const { rows: category } = await connection.query(
      "SELECT id FROM categories WHERE id=$1",
      [categoryId]
    );

    if (category.length === 0)
      return res.status(400).send("CategoryId doens't exist");
  } catch (err) {
    return res.sendStatus(500);
  }

  next();
}
