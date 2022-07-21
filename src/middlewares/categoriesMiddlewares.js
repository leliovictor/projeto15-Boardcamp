import connection from "../config/db.js";

import { categoriesBodySchema } from "../schemas/categoriesSchemas.js";

export function validationCategoryBody(req, res, next) {
  const categoryValidation = categoriesBodySchema.validate(req.body);

  if (categoryValidation.error) {
    return res.status(400).send({
      message: "Body required",
      detail: categoryValidation.error.details[0].message,
    });
  }

  next();
}

export async function checkDuplicate(req, res, next) {
  const { name } = req.body;

  const { rows: category } = await connection.query(
    "SELECT name FROM categories WHERE name=$1",
    [name]
  );

  if (category.length !== 0)
    return res.status(409).send("Category already exist");

  res.locals.name = name;

  next();
}
