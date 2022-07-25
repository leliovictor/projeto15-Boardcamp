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

export async function getCustomersById(_req, res) {
  const { customer } = res.locals;

  return res.status(200).send(customer);
}

export async function postCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    const query = `
    INSERT INTO customers ("name","phone","cpf", "birthday") VALUES ($1,$2,$3,$4)
    `;

    await connection.query(query, [name, phone, cpf, birthday]);

    return res.sendStatus(201);
  } catch (err) {
    return res.sendStatus(500);
  }
}

export async function updateCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;

  try {
    const query = `
    UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5;
    `;

    await connection.query(query,[name,phone, cpf, birthday, id]);

    return res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
}
