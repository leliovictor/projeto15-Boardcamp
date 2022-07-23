import connection from "../config/db.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;

  try {
    if (cpf) {
      const { rows: customersFilter } = await connection.query(
        `
        SELECT * FROM customers WHERE customers.cpf LIKE $1
        `,
        [`${cpf}%`]
      );

      return res.status(200).send(customersFilter);
    }

    const query = `SELECT * FROM customers`;
    const { rows: customers } = await connection.query(query);

    return res.status(200).send(customers);
  } catch (err) {
    return res.sendStatus(500);
  }
}
