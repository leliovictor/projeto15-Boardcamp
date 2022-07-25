import connection from "../config/db.js";

import { rentalsBodySchema } from "../schemas/rentalsSchemas.js";

export async function checkBodyRentals(req, res, next) {
  const bodyValidation = rentalsBodySchema.validate(req.body);
  if (bodyValidation.error) {
    return res.status(400).send({
      message: "Body with invalid format",
      detail: bodyValidation.error.details[0].message,
    });
  }

  next();
}

export async function checkCustomerId(req, res, next) {
  const { customerId } = req.body;

  try {
    const query = `SELECT * FROM customers WHERE id=$1`;
    const { rows: customer } = await connection.query(query, [customerId]);

    if (customer.length === 0)
      return res.status(400).send("Customer not found");
  } catch (err) {
    return res.sendStatus(500);
  }

  next();
}

export async function checkGameId(req, res, next) {
  const { gameId } = req.body;

  try {
    const query = `SELECT * FROM games WHERE id=$1`;
    const { rows: game } = await connection.query(query, [gameId]);
    
    if (game.length === 0) return res.status(400).send("Game not found");

    res.locals.game = game[0];
  } catch (err) {
    return res.sendStatus(500);
  }

  next();
}

export async function checkRentalExists(req, res, next) {
  const id = req.params.id;

  try {
    const rentalResult = await connection.query(
      `SELECT * FROM rentals
            WHERE id = $1`,
      [id]
    );

    if (rentalResult.rows.length > 0) {
      res.locals.rental = rentalResult.rows[0];
      next();
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
