import connection from "../config/db.js";
import dayjs from "dayjs";

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

export async function postRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const { game } = res.locals;

  const rentDate = dayjs().format("YYYY-MM-DD");
  const [returnDate, delayFee] = [null, null];
  const originalPrice = parseInt(req.body.daysRented) * game.pricePerDay;

  try {
    const query = `
    INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    `;

    const queryParams = [
      customerId,
      gameId,
      rentDate,
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
    ];

    console.log(queryParams);

    await connection.query(query, queryParams);
    return res.sendStatus(201);
  } catch (err) {
    return res.sendStatus(500);
  }
}

export async function deleteRental(req, res) {
  const id = req.params.id;
  const rental = res.locals.rental;

  if (rental.returnDate !== null) {
    return res.sendStatus(400);
  } 

  try {
    await connection.query(
      `DELETE FROM rentals
      WHERE id = $1
      `,
      [id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
}

export async function returnRental(_req, res) {
  const rental = res.locals.rental;

  if (rental.returnDate !== null) {
    res.sendStatus(400);
    return;
  }
  const returnDate = new Date().toISOString();
  try {
    const gameResult = await connection.query(
      `
        SELECT * FROM games
        WHERE id = $1
      `,
      [rental.gameId]
    );

    const game = gameResult.rows[0];

    const daysToMilliseconds = 86400000;
    const idealReturnDate = new Date(
      new Date(rental.rentDate).getTime() +
        rental.daysRented * daysToMilliseconds
    );

    let delayFee;

    if (new Date(returnDate) > new Date(idealReturnDate)) {
      const delay =
        new Date(
          new Date(returnDate).getTime() - new Date(rental.rentDate).getTime()
        ) / daysToMilliseconds;

      delayFee = Math.floor(delay) * game.pricePerDay;
    } else {
      delayFee = 0;
    }

    await connection.query(
      `
        UPDATE rentals
        SET "returnDate" = $1,
        "delayFee" = $2
        WHERE id = $3
      `,
      [returnDate, delayFee, rental.id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
}
