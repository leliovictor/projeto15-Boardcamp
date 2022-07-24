import connection from "../config/db.js";

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
