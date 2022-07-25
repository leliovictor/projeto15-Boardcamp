import connection from "../config/db.js";
import { customerBodySchema } from "../schemas/customersSchemas.js";

export async function checkCustomerId(req, res, next) {
  const { id } = req.params;

  try {
    const query = `
        SELECT * FROM customers WHERE customers.id = $1
        `;
    const queryId = [id];

    const { rows: customer } = await connection.query(query, queryId);

    if (customer.length === 0)
      return res.status(404).send("Customer not found");

    res.locals.customer = customer[0];
  } catch (err) {
    return res.sendStatus(500);
  }

  next();
}

export async function checkBodyPostCustomer(req, res, next) {
  const bodyValidation = customerBodySchema.validate(req.body);
  if (bodyValidation.error) {
    return res.status(400).send({
      message: "Body with invalid format",
      detail: bodyValidation.error.details[0].message,
    });
  }

  next();
}

export async function checkDuplicateCpf(req, res, next) {
  const { cpf } = req.body;

  try {
    const query = `
        SELECT cpf FROM customers WHERE cpf = $1 
        `;
    const { rows: customer } = await connection.query(query, [cpf]);

    if (customer.length !== 0)
      return res.status(409).send("CPF already in use");
  } catch (err) {
    return res.sendStatus(500);
  }

  next();
}
