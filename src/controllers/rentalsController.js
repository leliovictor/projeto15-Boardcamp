import connection from "../config/db.js";

export async function getRentals(req, res) {
  const { customerId } = req.query;
  const { gameId } = req.query;
  let queryParam;

  function transformObject(obj) {
    const newObject = {
      ...obj,
      customer: { id: obj["customer.id"], name: obj["customer.name"] },
      game: {
        id: obj["game.id"],
        name: obj["game.name"],
        categoryId: obj["game.categoryId"],
        categoryName: obj["game.categoryName"],
      },
    };

    const deleteKeys = [
      "customer.id",
      "customer.name",
      "game.id",
      "game.name",
      "game.categoryId",
      "game.categoryName",
    ];
    deleteKeys.forEach((key) => delete newObject[key]);

    return newObject;
  }

  try {
    let query = `
    SELECT rentals.*, 
    customers.id AS "customer.id", customers.name AS "customer.name",
    games.id AS "game.id", games.name AS "game.name", games."categoryId" AS "game.categoryId",
    categories.name AS "game.categoryName"
    FROM rentals
    JOIN customers ON rentals."customerId" = customers.id
    JOIN games ON rentals."gameId" = games.id
    JOIN categories ON games."categoryId" = categories.id
    `;

    if (customerId) {
      query = `
      SELECT rentals.*, 
      customers.id AS "customer.id", customers.name AS "customer.name",
      games.id AS "game.id", games.name AS "game.name", games."categoryId" AS "game.categoryId",
      categories.name AS "game.categoryName"
      FROM rentals
      JOIN customers ON rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id
      JOIN categories ON games."categoryId" = categories.id
      WHERE rentals."customerId" = $1
      `;
      queryParam = [customerId];
    }

    if (gameId) {
      query = `
      SELECT rentals.*, 
      customers.id AS "customer.id", customers.name AS "customer.name",
      games.id AS "game.id", games.name AS "game.name", games."categoryId" AS "game.categoryId",
      categories.name AS "game.categoryName"
      FROM rentals
      JOIN customers ON rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id
      JOIN categories ON games."categoryId" = categories.id
      WHERE rentals."gameId" = $1
      `;
      queryParam = [gameId];
    }

    const { rows: rentals } =
      customerId || gameId
        ? await connection.query(query, queryParam)
        : await connection.query(query);

    const ajustRentalsObject = [];

    rentals.map((rental) => {
      ajustRentalsObject.push(transformObject(rental));
    });

    return res.status(200).send(ajustRentalsObject);
  } catch (err) {
    return res.sendStatus(500);
  }
}
